import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  const path = router.pathname;

  const tabs = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/albums', icon: '📚', label: 'Albums' },
    { href: '/pack', icon: '🎁', label: 'Open Pack' },
    { href: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.href}
          className={`nav-tab ${path === tab.href ? 'active' : ''}`}
          onClick={() => router.push(tab.href)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          background: rgba(20, 20, 35, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 6px 0 env(safe-area-inset-bottom, 8px);
          z-index: 100;
        }
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-icon {
          font-size: 22px;
          transition: transform 0.2s;
        }
        .nav-tab.active .nav-icon {
          transform: scale(1.2);
        }
        .nav-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .nav-tab.active .nav-label {
          color: #8B5CF6;
          font-weight: 700;
        }
      `}</style>
    </nav>
  );
}
