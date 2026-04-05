import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import StickerCard from '../components/StickerCard';
import useGameState from '../lib/useGameState';
import { ALBUMS, RARITY_CONFIG } from '../lib/gameData';

export default function PackPage() {
  const router = useRouter();
  const { state, loaded, canOpenPack, openPack } = useGameState();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [phase, setPhase] = useState('select'); // select, opening, reveal, done
  const [stickers, setStickers] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (loaded && state && state.activeAlbumId) {
      setSelectedAlbum(state.activeAlbumId);
    }
  }, [loaded, state]);

  if (!loaded || !state) return null;

  const packAvailable = canOpenPack();

  const handleOpenPack = () => {
    if (!selectedAlbum || !packAvailable) return;
    const newStickers = openPack(selectedAlbum);
    setStickers(newStickers);
    setPhase('opening');
    setTimeout(() => setPhase('reveal'), 1500);
  };

  const handleRevealNext = () => {
    if (revealedCount < stickers.length) {
      const next = revealedCount + 1;
      setRevealedCount(next);
      if (stickers[revealedCount]?.rarity === 'legendary') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      if (next >= stickers.length) {
        setTimeout(() => setPhase('done'), 300);
      }
    }
  };

  const handleRevealAll = () => {
    setRevealedCount(stickers.length);
    if (stickers.some(s => s.rarity === 'legendary')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setTimeout(() => setPhase('done'), 300);
  };

  return (
    <>
      <Head>
        <title>Open Pack - Sticker Collector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Layout title="Open Pack">
        {showConfetti && <Confetti />}

        {!packAvailable && phase === 'select' && (
          <div className="no-pack">
            <div className="no-pack-icon">⏰</div>
            <h2>No Packs Available</h2>
            <p>You already opened today's pack. Come back tomorrow!</p>
            <button className="btn btn-secondary" onClick={() => router.push('/')}>
              Back to Home
            </button>
          </div>
        )}

        {packAvailable && phase === 'select' && (
          <div className="select-phase">
            <div className="pack-visual">
              <div className="pack-icon-big">🎁</div>
              <div className="pack-sparkles">✨</div>
            </div>
            <h2 className="phase-title">Choose an Album</h2>
            <p className="phase-sub">Select which album to get stickers for</p>

            <div className="album-select-list">
              {ALBUMS.map(album => (
                <button
                  key={album.id}
                  className={`album-select-item ${selectedAlbum === album.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAlbum(album.id)}
                >
                  <span className="album-select-icon">{album.icon}</span>
                  <span className="album-select-name">{album.name}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary open-btn"
              disabled={!selectedAlbum}
              onClick={handleOpenPack}
            >
              Open Pack!
            </button>
          </div>
        )}

        {phase === 'opening' && (
          <div className="opening-phase">
            <div className="pack-opening">
              <div className="pack-shake">🎁</div>
            </div>
            <h2 className="opening-text">Opening Pack...</h2>
          </div>
        )}

        {(phase === 'reveal' || phase === 'done') && (
          <div className="reveal-phase">
            <h2 className="reveal-title">
              {phase === 'done' ? 'Pack Complete!' : `Tap to Reveal (${revealedCount}/${stickers.length})`}
            </h2>

            <div className="sticker-reveal-grid">
              {stickers.map((sticker, i) => {
                const isRevealed = i < revealedCount;
                const isDuplicate = state.collection[sticker.id] > 1;
                return (
                  <div
                    key={i}
                    className={`reveal-slot ${isRevealed ? 'revealed' : 'hidden'}`}
                    onClick={() => {
                      if (!isRevealed && i === revealedCount) handleRevealNext();
                    }}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {isRevealed ? (
                      <div className="revealed-sticker">
                        <StickerCard sticker={sticker} collected={true} count={1} size="large" />
                        {isDuplicate && <div className="dupe-badge">DUPLICATE</div>}
                      </div>
                    ) : (
                      <div className="unrevealed-sticker">
                        <span className="q-mark">?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {phase === 'reveal' && revealedCount < stickers.length && (
              <div className="reveal-actions">
                <button className="btn btn-primary" onClick={handleRevealNext}>
                  Reveal Next
                </button>
                <button className="btn btn-secondary" onClick={handleRevealAll}>
                  Reveal All
                </button>
              </div>
            )}

            {phase === 'done' && (
              <div className="done-actions">
                <div className="pack-summary">
                  {Object.entries(
                    stickers.reduce((acc, s) => {
                      acc[s.rarity] = (acc[s.rarity] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([rarity, count]) => (
                    <span key={rarity} className="summary-pill" style={{ color: RARITY_CONFIG[rarity].color }}>
                      {count}× {RARITY_CONFIG[rarity].label}
                    </span>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={() => router.push(`/album/${selectedAlbum}`)}>
                  View Album
                </button>
                <button className="btn btn-secondary" onClick={() => router.push('/')}>
                  Back to Home
                </button>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .no-pack {
            text-align: center;
            padding: 60px 20px;
            animation: fadeInUp 0.5s ease;
          }
          .no-pack-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .no-pack h2 {
            font-size: 22px;
            font-weight: 800;
            color: white;
            margin-bottom: 8px;
          }
          .no-pack p {
            color: rgba(255,255,255,0.5);
            margin-bottom: 24px;
          }
          .select-phase {
            text-align: center;
            animation: fadeInUp 0.5s ease;
          }
          .pack-visual {
            position: relative;
            display: inline-block;
            margin-bottom: 20px;
          }
          .pack-icon-big {
            font-size: 80px;
            animation: float 3s ease-in-out infinite;
          }
          .pack-sparkles {
            position: absolute;
            top: -10px;
            right: -20px;
            font-size: 28px;
            animation: float 2s ease-in-out infinite reverse;
          }
          .phase-title {
            font-size: 22px;
            font-weight: 800;
            color: white;
            margin-bottom: 4px;
          }
          .phase-sub {
            font-size: 13px;
            color: rgba(255,255,255,0.4);
            margin-bottom: 24px;
          }
          .album-select-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 24px;
          }
          .album-select-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 14px;
            border: 2px solid rgba(255,255,255,0.06);
            background: rgba(255,255,255,0.03);
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            color: white;
            font-size: 15px;
            font-weight: 600;
          }
          .album-select-item:hover {
            border-color: rgba(139,92,246,0.3);
          }
          .album-select-item.selected {
            border-color: #8B5CF6;
            background: rgba(139,92,246,0.12);
          }
          .album-select-icon {
            font-size: 28px;
          }
          .open-btn {
            width: 100%;
          }
          .opening-phase {
            text-align: center;
            padding: 80px 20px;
          }
          .pack-opening {
            margin-bottom: 24px;
          }
          .pack-shake {
            font-size: 100px;
            display: inline-block;
            animation: shake 0.4s ease-in-out infinite;
          }
          @keyframes shake {
            0%, 100% { transform: rotate(-5deg) scale(1); }
            25% { transform: rotate(5deg) scale(1.05); }
            50% { transform: rotate(-3deg) scale(1.1); }
            75% { transform: rotate(3deg) scale(1.05); }
          }
          .opening-text {
            font-size: 20px;
            font-weight: 800;
            color: white;
            animation: pulse 1s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .reveal-phase {
            animation: fadeInUp 0.5s ease;
          }
          .reveal-title {
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            color: white;
            margin-bottom: 20px;
          }
          .sticker-reveal-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
          @media (max-width: 380px) {
            .sticker-reveal-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          .reveal-slot {
            animation: scaleIn 0.3s ease;
          }
          .revealed-sticker {
            position: relative;
          }
          .unrevealed-sticker {
            min-height: 200px;
            background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1));
            border: 2px dashed rgba(139,92,246,0.3);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
          }
          .unrevealed-sticker:hover {
            border-color: rgba(139,92,246,0.6);
            transform: scale(1.02);
          }
          .q-mark {
            font-size: 48px;
            color: rgba(139,92,246,0.4);
            font-weight: 900;
          }
          .dupe-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            font-size: 8px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .reveal-actions {
            display: flex;
            gap: 10px;
          }
          .reveal-actions .btn {
            flex: 1;
          }
          .done-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
          .pack-summary {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 8px;
          }
          .summary-pill {
            font-size: 12px;
            font-weight: 700;
          }
        `}</style>
      </Layout>
    </>
  );
}

function Confetti() {
  const colors = ['#8B5CF6', '#EC4899', '#F39C12', '#2ECC71', '#3498DB', '#E74C3C'];
  return (
    <div className="confetti-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
      <style jsx>{`
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 200;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confetti-fall linear forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
