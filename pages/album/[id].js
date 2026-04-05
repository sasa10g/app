import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import StickerCard from '../../components/StickerCard';
import useGameState from '../../lib/useGameState';
import { ALBUMS, RARITY_CONFIG } from '../../lib/gameData';

export default function AlbumDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state, loaded, getAlbumProgress, getCategoryProgress, getDuplicateCount, tradeInDuplicates } = useGameState();
  const [filter, setFilter] = useState('all'); // all, collected, missing
  const [tradeResult, setTradeResult] = useState(null);

  if (!loaded || !state || !id) return null;

  const album = ALBUMS.find(a => a.id === id);
  if (!album) return <Layout title="Not Found"><p>Album not found</p></Layout>;

  const progress = getAlbumProgress(album.id);
  const duplicates = getDuplicateCount(album.id);

  const handleTrade = () => {
    const result = tradeInDuplicates(album.id);
    if (result) {
      setTradeResult(result);
      setTimeout(() => setTradeResult(null), 4000);
    }
  };

  return (
    <>
      <Head>
        <title>{album.name} - Sticker Collector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Layout title={album.name}>
        {/* Album Header */}
        <div className="album-header">
          <div className="album-icon-wrap">{album.icon}</div>
          <div className="album-meta">
            <h2>{album.name}</h2>
            <p>{album.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section card">
          <div className="prog-row">
            <span>Progress</span>
            <span className="prog-pct">{progress.percentage}%</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
          </div>
          <div className="prog-stats">
            <span>{progress.collected} collected</span>
            <span>{progress.total - progress.collected} missing</span>
            <span>{duplicates} duplicates</span>
          </div>
        </div>

        {/* Trade In */}
        {duplicates >= 3 && (
          <button className="trade-btn" onClick={handleTrade}>
            <span>🔄</span>
            <span>Trade 3 Duplicates for 1 New Sticker</span>
          </button>
        )}

        {tradeResult && (
          <div className="trade-result">
            You got <strong style={{ color: RARITY_CONFIG[tradeResult.rarity].color }}>
              {tradeResult.name}
            </strong> ({RARITY_CONFIG[tradeResult.rarity].label})!
          </div>
        )}

        {/* Filter */}
        <div className="filter-row">
          {['all', 'collected', 'missing'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Categories */}
        {album.categories.map(category => {
          const catProgress = getCategoryProgress(album.id, category.stickers);
          const filteredStickers = category.stickers.filter(s => {
            const isCollected = !!state.collection[s.id];
            if (filter === 'collected') return isCollected;
            if (filter === 'missing') return !isCollected;
            return true;
          });

          if (filteredStickers.length === 0) return null;

          return (
            <div key={category.name} className="category-section">
              <div className="cat-header">
                <h3 className="cat-title">{category.icon} {category.name}</h3>
                <span className="cat-count">{catProgress.collected}/{catProgress.total}</span>
              </div>
              <div className="sticker-grid">
                {filteredStickers.map(sticker => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    collected={!!state.collection[sticker.id]}
                    count={state.collection[sticker.id] || 0}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <style jsx>{`
          .album-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            animation: fadeInUp 0.4s ease;
          }
          .album-icon-wrap {
            font-size: 48px;
            width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08));
            border-radius: 20px;
            flex-shrink: 0;
          }
          .album-meta h2 {
            font-size: 22px;
            font-weight: 800;
            color: white;
          }
          .album-meta p {
            font-size: 13px;
            color: rgba(255,255,255,0.4);
            margin-top: 2px;
          }
          .progress-section {
            margin-bottom: 16px;
            animation: fadeInUp 0.5s ease;
          }
          .prog-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            font-weight: 700;
            color: rgba(255,255,255,0.6);
            margin-bottom: 8px;
          }
          .prog-pct {
            color: #8B5CF6;
            font-size: 16px;
          }
          .prog-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 11px;
            color: rgba(255,255,255,0.35);
          }
          .trade-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 14px 18px;
            border-radius: 14px;
            border: 2px solid rgba(46,204,113,0.3);
            background: rgba(46,204,113,0.08);
            color: #2ECC71;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 16px;
            transition: all 0.3s;
            font-family: inherit;
          }
          .trade-btn:hover {
            border-color: rgba(46,204,113,0.5);
            transform: translateY(-1px);
          }
          .trade-result {
            text-align: center;
            padding: 12px;
            background: rgba(46,204,113,0.1);
            border: 1px solid rgba(46,204,113,0.3);
            border-radius: 12px;
            margin-bottom: 16px;
            font-size: 14px;
            color: rgba(255,255,255,0.8);
            animation: scaleIn 0.3s ease;
          }
          .filter-row {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
          }
          .filter-btn {
            flex: 1;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
            color: rgba(255,255,255,0.4);
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-family: inherit;
          }
          .filter-btn.active {
            background: rgba(139,92,246,0.15);
            border-color: #8B5CF6;
            color: #8B5CF6;
          }
          .category-section {
            margin-bottom: 28px;
            animation: fadeInUp 0.5s ease;
          }
          .cat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .cat-title {
            font-size: 15px;
            font-weight: 700;
            color: white;
          }
          .cat-count {
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            font-weight: 600;
          }
          .sticker-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }
          @media (max-width: 400px) {
            .sticker-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (min-width: 500px) {
            .sticker-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }
        `}</style>
      </Layout>
    </>
  );
}
