import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import useGameState from '../lib/useGameState';
import { ALBUMS, AVATARS, RARITY_CONFIG } from '../lib/gameData';

export default function ProfilePage() {
  const router = useRouter();
  const { state, loaded, updateProfile, getAlbumProgress, resetGame } = useGameState();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [showReset, setShowReset] = useState(false);

  if (!loaded || !state) return null;

  const totalCollected = Object.keys(state.collection).length;
  const totalPossible = ALBUMS.reduce((sum, a) => sum + a.totalStickers, 0);

  // Calculate rarity breakdown
  const rarityBreakdown = { common: 0, uncommon: 0, rare: 0, legendary: 0 };
  ALBUMS.forEach(album => {
    album.categories.forEach(cat => {
      cat.stickers.forEach(s => {
        if (state.collection[s.id]) {
          rarityBreakdown[s.rarity]++;
        }
      });
    });
  });

  const daysPlaying = state.profile.createdAt
    ? Math.max(1, Math.ceil((Date.now() - new Date(state.profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const startEdit = () => {
    setEditName(state.profile.name);
    setEditAvatar(state.profile.avatar);
    setEditing(true);
  };

  const saveEdit = () => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim(), avatar: editAvatar });
    }
    setEditing(false);
  };

  const handleReset = () => {
    resetGame();
    setShowReset(false);
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Profile - Sticker Collector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Layout title="Profile">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">{state.profile.avatar}</div>
          <h2 className="profile-name">{state.profile.name}</h2>
          <div className="profile-level">Level {state.profile.level}</div>
          <div className="profile-xp">{state.profile.xp} XP Total</div>
          <button className="edit-btn" onClick={startEdit}>Edit Profile</button>
        </div>

        {/* Achievement Cards */}
        <h3 className="section-title">Achievements</h3>
        <div className="achievements">
          <Achievement
            icon="📦"
            title="Pack Opener"
            value={state.packsOpened}
            target={[1, 5, 10, 25, 50, 100]}
          />
          <Achievement
            icon="🎴"
            title="Collector"
            value={totalCollected}
            target={[10, 25, 50, 100, 150, 240]}
          />
          <Achievement
            icon="⭐"
            title="Legendary Hunter"
            value={rarityBreakdown.legendary}
            target={[1, 3, 5, 10, 15, 30]}
          />
          <Achievement
            icon="🔄"
            title="Trader"
            value={state.tradedIn}
            target={[1, 5, 10, 25]}
          />
          <Achievement
            icon="📅"
            title="Dedicated"
            value={daysPlaying}
            target={[1, 7, 14, 30, 60, 100]}
          />
        </div>

        {/* Rarity Breakdown */}
        <h3 className="section-title">Collection by Rarity</h3>
        <div className="rarity-grid">
          {Object.entries(rarityBreakdown).map(([rarity, count]) => (
            <div key={rarity} className="rarity-card card">
              <div className="rarity-dot" style={{ background: RARITY_CONFIG[rarity].color }} />
              <div className="rarity-count">{count}</div>
              <div className="rarity-label">{RARITY_CONFIG[rarity].label}</div>
            </div>
          ))}
        </div>

        {/* Album Completion */}
        <h3 className="section-title">Album Progress</h3>
        {ALBUMS.map(album => {
          const progress = getAlbumProgress(album.id);
          return (
            <div key={album.id} className="album-prog-item" onClick={() => router.push(`/album/${album.id}`)}>
              <span className="api-icon">{album.icon}</span>
              <span className="api-name">{album.name}</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
              </div>
              <span className="api-pct">{progress.percentage}%</span>
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="danger-zone">
          <button className="reset-btn" onClick={() => setShowReset(true)}>
            Reset All Progress
          </button>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="modal-overlay" onClick={() => setEditing(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Edit Profile</h3>
              <div className="modal-field">
                <label>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  maxLength={20}
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label>Avatar</label>
                <div className="modal-avatar-grid">
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      className={`modal-avatar-btn ${editAvatar === a ? 'selected' : ''}`}
                      onClick={() => setEditAvatar(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirm Modal */}
        {showReset && (
          <div className="modal-overlay" onClick={() => setShowReset(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Reset Progress?</h3>
              <p className="reset-warning">This will delete ALL your stickers, stats, and progress. This cannot be undone!</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowReset(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleReset}>Yes, Reset Everything</button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .profile-card {
            text-align: center;
            padding: 32px 20px;
            background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08));
            border: 1px solid rgba(139,92,246,0.2);
            border-radius: 24px;
            margin-bottom: 28px;
            animation: fadeInUp 0.4s ease;
          }
          .profile-avatar {
            font-size: 64px;
            width: 88px;
            height: 88px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.08);
            border-radius: 24px;
            margin: 0 auto 12px;
          }
          .profile-name {
            font-size: 26px;
            font-weight: 900;
            color: white;
          }
          .profile-level {
            display: inline-block;
            margin-top: 6px;
            font-size: 12px;
            font-weight: 700;
            color: #8B5CF6;
            background: rgba(139,92,246,0.15);
            padding: 4px 14px;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .profile-xp {
            margin-top: 8px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
          }
          .edit-btn {
            margin-top: 16px;
            padding: 10px 24px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
          }
          .edit-btn:hover {
            background: rgba(255,255,255,0.1);
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
          }
          .achievements {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 28px;
          }
          .rarity-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 28px;
          }
          .rarity-card {
            text-align: center;
            padding: 14px 8px;
          }
          .rarity-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 auto 8px;
          }
          .rarity-count {
            font-size: 22px;
            font-weight: 800;
            color: white;
          }
          .rarity-label {
            font-size: 9px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }
          .album-prog-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .album-prog-item:hover {
            border-color: rgba(139,92,246,0.2);
          }
          .api-icon {
            font-size: 22px;
          }
          .api-name {
            font-size: 13px;
            font-weight: 600;
            color: white;
            min-width: 80px;
          }
          .api-pct {
            font-size: 13px;
            font-weight: 700;
            color: #8B5CF6;
            min-width: 36px;
            text-align: right;
          }
          .danger-zone {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.06);
            text-align: center;
          }
          .reset-btn {
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid rgba(231,76,60,0.3);
            background: rgba(231,76,60,0.08);
            color: #E74C3C;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
          }
          .reset-btn:hover {
            background: rgba(231,76,60,0.15);
          }
          .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
            padding: 20px;
            animation: fadeIn 0.2s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .modal {
            background: #1A1A2E;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 28px;
            max-width: 400px;
            width: 100%;
            animation: scaleIn 0.3s ease;
          }
          .modal h3 {
            font-size: 20px;
            font-weight: 800;
            color: white;
            margin-bottom: 20px;
          }
          .modal-field {
            margin-bottom: 20px;
          }
          .modal-field label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .modal-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: 2px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.04);
            color: white;
            font-size: 15px;
            outline: none;
          }
          .modal-input:focus {
            border-color: #8B5CF6;
          }
          .modal-avatar-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
          }
          .modal-avatar-btn {
            font-size: 24px;
            aspect-ratio: 1;
            border-radius: 10px;
            border: 2px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.03);
            cursor: pointer;
            transition: all 0.2s;
          }
          .modal-avatar-btn.selected {
            border-color: #8B5CF6;
            background: rgba(139,92,246,0.15);
          }
          .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }
          .modal-actions .btn {
            flex: 1;
            padding: 12px;
            font-size: 13px;
          }
          .btn-danger {
            background: linear-gradient(135deg, #E74C3C, #C0392B);
            color: white;
            border: none;
          }
          .reset-warning {
            color: rgba(255,255,255,0.5);
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 8px;
          }
        `}</style>
      </Layout>
    </>
  );
}

function Achievement({ icon, title, value, target }) {
  const currentTier = target.filter(t => value >= t).length;
  const nextTarget = target[currentTier] || target[target.length - 1];
  const prevTarget = currentTier > 0 ? target[currentTier - 1] : 0;
  const progress = Math.min(100, Math.round(((value - prevTarget) / (nextTarget - prevTarget)) * 100));
  const maxed = currentTier >= target.length;

  return (
    <div className="achievement-card card">
      <div className="ach-icon">{icon}</div>
      <div className="ach-info">
        <div className="ach-header">
          <span className="ach-title">{title}</span>
          <span className="ach-tier">
            {'★'.repeat(currentTier)}{'☆'.repeat(Math.max(0, target.length - currentTier))}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: maxed ? '100%' : `${progress}%` }} />
        </div>
        <div className="ach-count">{maxed ? 'MAX!' : `${value}/${nextTarget}`}</div>
      </div>

      <style jsx>{`
        .achievement-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
        }
        .ach-icon {
          font-size: 28px;
          flex-shrink: 0;
        }
        .ach-info {
          flex: 1;
          min-width: 0;
        }
        .ach-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .ach-title {
          font-size: 13px;
          font-weight: 700;
          color: white;
        }
        .ach-tier {
          font-size: 11px;
          color: #F39C12;
        }
        .ach-count {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
