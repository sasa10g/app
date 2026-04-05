import Navigation from './Navigation';

export default function Layout({ children, title }) {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="header-title">{title}</h1>
      </header>
      <main className="main-content">
        {children}
      </main>
      <Navigation />

      <style jsx>{`
        .layout {
          min-height: 100vh;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(13, 13, 25, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 20px;
          text-align: center;
        }
        .header-title {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.5px;
        }
        .main-content {
          padding: 20px 16px 100px;
        }
      `}</style>
    </div>
  );
}
