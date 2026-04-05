import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useGameState from '../lib/useGameState';
import { ALBUMS } from '../lib/gameData';

export default function Home() {
  const router = useRouter();
  const { state, loaded, updateProfile, canOpenPack, getAlbumProgress } = useGameState();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (loaded && state && !state.profile.name) {
      setShowSetup(true);
    }
  }, [loaded, state]);

  if (!loaded || !state) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontSize: 48, animation: 'float 2s ease-in-out infinite' }}>🎴</div>
      </div>
    );
  }

  if (showSetup) {
    return <SetupScreen onComplete={(name, avatar) => {
      updateProfile({ name, avatar });
      setShowSetup(false);
    }} />;
  }

  const packAvailable = canOpenPack();
  const totalCollected = Object.keys(state.collection).length;
  const totalPossible = ALBUMS.reduce((sum, a) => sum + a.totalStickers, 0);

  return (
    <>
      <Head>
        <title>Sticker Collector</title>
        <meta name="description" content="Collect stickers every day!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎴</text></svg>" />
      </Head>
      <Layout title="Sticker Collector">
        {/* Welcome Banner */}
        <div className="welcome-card">
          <div className="welcome-left">
            <div className="avatar-display">{state.profile.avatar}</div>
            <div>
              <div className="welcome-text">Welcome back,</div>
              <div className="welcome-name">{state.profile.name}</div>
              <div className="level-badge">Level {state.profile.level}</div>
            </div>
          </div>
          <div className="welcome-stats">
            <div className="mini-stat">{totalCollected}/{totalPossible}</div>
            <div className="mini-stat-label">Collected</div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="xp-section">
          <div className="xp-labels">
            <span>XP</span>
            <span>{state.profile.xp % 100}/100</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${state.profile.xp % 100}%` }} />
          </div>
        </div>

        {/* Daily Pack CTA */}
        {packAvailable && (
          <button
            className="pack-cta"
            onClick={() => router.push('/pack')}
          >
            <div className="pack-cta-icon">🎁</div>
            <div className="pack-cta-text">
              <div className="pack-cta-title">Daily Pack Ready!</div>
              <div className="pack-cta-sub">Tap to open 5 new stickers</div>
            </div>
            <div className="pack-cta-arrow">→</div>
          </button>
        )}

        {!packAvailable && (
          <div className="pack-cta pack-cta-done">
            <div className="pack-cta-icon">✅</div>
            <div className="pack-cta-text">
              <div className="pack-cta-title">Pack Opened Today</div>
              <div className="pack-cta-sub">Come back tomorrow for more!</div>
            </div>
          </div>
        )}

        {/* Albums Overview */}
        <h2 className="section-title">Your Albums</h2>
        <div className="albums-grid">
          {ALBUMS.map(album => {
            const progress = getAlbumProgress(album.id);
            return (
              <div
                key={album.id}
                className="album-card card"
                onClick={() => router.push(`/album/${album.id}`)}
              >
                <div className="album-icon">{album.icon}</div>
                <div className="album-info">
                  <div className="album-name">{album.name}</div>
                  <div className="album-desc">{album.description}</div>
                  <div className="album-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
                    </div>
                    <span className="album-count">{progress.collected}/{progress.total} ({progress.percentage}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <h2 className="section-title">Stats</h2>
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-value">{state.packsOpened}</div>
            <div className="stat-label">Packs Opened</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{state.totalStickersCollected}</div>
            <div className="stat-label">Total Pulled</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{state.duplicatesFound}</div>
            <div className="stat-label">Duplicates</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{state.tradedIn}</div>
            <div className="stat-label">Trades</div>
          </div>
        </div>

        <style jsx>{`
          .welcome-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1));
            border: 1px solid rgba(139,92,246,0.2);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 16px;
            animation: fadeInUp 0.5s ease;
          }
          .welcome-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .avatar-display {
            font-size: 40px;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.08);
            border-radius: 16px;
          }
          .welcome-text {
            font-size: 12px;
            color: rgba(255,255,255,0.5);
            font-weight: 500;
          }
          .welcome-name {
            font-size: 20px;
            font-weight: 800;
            color: white;
          }
          .level-badge {
            display: inline-block;
            margin-top: 4px;
            font-size: 10px;
            font-weight: 700;
            color: #8B5CF6;
            background: rgba(139,92,246,0.15);
            padding: 2px 10px;
            border-radius: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .welcome-stats {
            text-align: center;
          }
          .mini-stat {
            font-size: 18px;
            font-weight: 800;
            color: white;
          }
          .mini-stat-label {
            font-size: 10px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .xp-section {
            margin-bottom: 20px;
            animation: fadeInUp 0.6s ease;
          }
          .xp-labels {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            margin-bottom: 6px;
            font-weight: 600;
          }
          .pack-cta {
            display: flex;
            align-items: center;
            gap: 14px;
            width: 100%;
            padding: 18px 20px;
            border-radius: 16px;
            border: 2px solid rgba(139,92,246,0.4);
            background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08));
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 28px;
            animation: fadeInUp 0.7s ease, pulse-glow 2s ease-in-out infinite;
            font-family: inherit;
          }
          .pack-cta:hover {
            transform: translateY(-2px);
            border-color: rgba(139,92,246,0.6);
          }
          .pack-cta-done {
            animation: fadeInUp 0.7s ease;
            border-color: rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            cursor: default;
          }
          .pack-cta-done:hover {
            transform: none;
          }
          .pack-cta-icon {
            font-size: 32px;
          }
          .pack-cta-text {
            flex: 1;
            text-align: left;
          }
          .pack-cta-title {
            font-size: 16px;
            font-weight: 700;
            color: white;
          }
          .pack-cta-sub {
            font-size: 12px;
            color: rgba(255,255,255,0.5);
            margin-top: 2px;
          }
          .pack-cta-arrow {
            font-size: 24px;
            color: #8B5CF6;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
          }
          .albums-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 28px;
          }
          .album-card {
            display: flex;
            align-items: center;
            gap: 16px;
            cursor: pointer;
            animation: fadeInUp 0.5s ease;
          }
          .album-icon {
            font-size: 36px;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.04);
            border-radius: 14px;
            flex-shrink: 0;
          }
          .album-info {
            flex: 1;
            min-width: 0;
          }
          .album-name {
            font-size: 16px;
            font-weight: 700;
            color: white;
          }
          .album-desc {
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            margin: 2px 0 8px;
          }
          .album-progress {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .album-count {
            font-size: 11px;
            color: rgba(255,255,255,0.5);
            font-weight: 600;
            white-space: nowrap;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .stat-card {
            text-align: center;
            animation: fadeInUp 0.6s ease;
          }
          .stat-value {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .stat-label {
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
          }
        `}</style>
      </Layout>
    </>
  );
}

function SetupScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const avatars = ['😎', '🤠', '🧑‍🚀', '🦸', '🧙', '🥷', '🎮', '⭐', '🔥', '💎', '🏆', '🎯'];

  return (
    <div className="setup">
      <Head>
        <title>Welcome - Sticker Collector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div className="setup-inner">
        <div className="setup-icon">🎴</div>
        <h1 className="setup-title">Sticker Collector</h1>
        <p className="setup-sub">Collect them all! Open daily packs and complete your albums.</p>

        <div className="setup-field">
          <label className="setup-label">Your Name</label>
          <input
            className="setup-input"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="setup-field">
          <label className="setup-label">Choose Avatar</label>
          <div className="avatar-grid">
            {avatars.map(a => (
              <button
                key={a}
                className={`avatar-btn ${avatar === a ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary setup-btn"
          disabled={!name.trim()}
          onClick={() => onComplete(name.trim(), avatar)}
        >
          Start Collecting!
        </button>
      </div>

      <style jsx>{`
        .setup {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .setup-inner {
          max-width: 400px;
          width: 100%;
          text-align: center;
          animation: fadeInUp 0.8s ease;
        }
        .setup-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: float 3s ease-in-out infinite;
        }
        .setup-title {
          font-size: 32px;
          font-weight: 900;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        .setup-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .setup-field {
          margin-bottom: 24px;
          text-align: left;
        }
        .setup-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .setup-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s;
        }
        .setup-input:focus {
          border-color: #8B5CF6;
        }
        .setup-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .avatar-btn {
          font-size: 28px;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-btn:hover {
          border-color: rgba(139,92,246,0.3);
        }
        .avatar-btn.selected {
          border-color: #8B5CF6;
          background: rgba(139,92,246,0.15);
          transform: scale(1.1);
        }
        .setup-btn {
          width: 100%;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
