import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import useGameState from '../lib/useGameState';
import { ALBUMS } from '../lib/gameData';

export default function AlbumsPage() {
  const router = useRouter();
  const { state, loaded, getAlbumProgress } = useGameState();

  if (!loaded || !state) return null;

  const totalCollected = Object.keys(state.collection).length;
  const totalPossible = ALBUMS.reduce((sum, a) => sum + a.totalStickers, 0);
  const overallPercent = Math.round((totalCollected / totalPossible) * 100);

  return (
    <>
      <Head>
        <title>Albums - Sticker Collector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Layout title="Albums">
        <div className="overall-progress card">
          <div className="op-header">
            <span className="op-label">Overall Collection</span>
            <span className="op-count">{totalCollected}/{totalPossible}</span>
          </div>
          <div className="progress-bar" style={{ height: 12 }}>
            <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
          </div>
          <div className="op-percent">{overallPercent}% Complete</div>
        </div>

        <div className="albums-list">
          {ALBUMS.map((album, idx) => {
            const progress = getAlbumProgress(album.id);
            const isComplete = progress.collected === progress.total;
            return (
              <div
                key={album.id}
                className={`album-full-card ${isComplete ? 'complete' : ''}`}
                onClick={() => router.push(`/album/${album.id}`)}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="album-banner">
                  <div className="album-big-icon">{album.icon}</div>
                  {isComplete && <div className="complete-badge">COMPLETE!</div>}
                </div>
                <div className="album-body">
                  <h3 className="album-title">{album.name}</h3>
                  <p className="album-desc">{album.description}</p>
                  <div className="album-cats">
                    {album.categories.map(c => (
                      <span key={c.name} className="cat-pill">{c.icon} {c.name}</span>
                    ))}
                  </div>
                  <div className="album-prog-row">
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
                    </div>
                    <span className="album-prog-text">{progress.collected}/{progress.total}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          .overall-progress {
            margin-bottom: 24px;
            text-align: center;
            animation: fadeInUp 0.4s ease;
          }
          .op-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .op-label {
            font-size: 14px;
            font-weight: 700;
            color: white;
          }
          .op-count {
            font-size: 14px;
            font-weight: 700;
            color: #8B5CF6;
          }
          .op-percent {
            margin-top: 8px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
            font-weight: 600;
          }
          .albums-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .album-full-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 20px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            animation: fadeInUp 0.5s ease both;
          }
          .album-full-card:hover {
            border-color: rgba(139,92,246,0.3);
            transform: translateY(-2px);
          }
          .album-full-card.complete {
            border-color: rgba(243,156,18,0.3);
          }
          .album-banner {
            position: relative;
            background: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08));
            padding: 28px;
            text-align: center;
          }
          .album-full-card.complete .album-banner {
            background: linear-gradient(135deg, rgba(243,156,18,0.15), rgba(241,196,15,0.1));
          }
          .album-big-icon {
            font-size: 56px;
          }
          .complete-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: linear-gradient(135deg, #F39C12, #F1C40F);
            color: #000;
            font-size: 10px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 8px;
            letter-spacing: 1px;
          }
          .album-body {
            padding: 18px 20px 20px;
          }
          .album-title {
            font-size: 20px;
            font-weight: 800;
            color: white;
            margin-bottom: 4px;
          }
          .album-desc {
            font-size: 13px;
            color: rgba(255,255,255,0.4);
            margin-bottom: 12px;
          }
          .album-cats {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 14px;
          }
          .cat-pill {
            font-size: 11px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            padding: 4px 10px;
            border-radius: 20px;
            color: rgba(255,255,255,0.6);
            white-space: nowrap;
          }
          .album-prog-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .album-prog-text {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255,255,255,0.6);
            white-space: nowrap;
          }
        `}</style>
      </Layout>
    </>
  );
}
