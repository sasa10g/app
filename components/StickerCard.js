import { RARITY_CONFIG } from '../lib/gameData';

export default function StickerCard({ sticker, collected, count, onClick, size = 'normal', revealed = true }) {
  const rarity = RARITY_CONFIG[sticker.rarity];
  const isCollected = collected || revealed;

  return (
    <div
      className={`sticker-card ${sticker.rarity} ${isCollected ? 'collected' : 'empty'} size-${size}`}
      onClick={onClick}
    >
      {isCollected ? (
        <>
          <div className="sticker-number">#{sticker.number}</div>
          <div className="sticker-emoji">{getCategoryEmoji(sticker)}</div>
          <div className="sticker-name">{sticker.name}</div>
          <div className="sticker-rarity" style={{ color: rarity.color }}>
            {rarity.label}
          </div>
          {count > 1 && <div className="sticker-count">×{count}</div>}
          <div className="shine" />
        </>
      ) : (
        <>
          <div className="sticker-number">#{sticker.number}</div>
          <div className="sticker-placeholder">?</div>
        </>
      )}

      <style jsx>{`
        .sticker-card {
          position: relative;
          border-radius: 12px;
          padding: 10px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          user-select: none;
          border: 2px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
        }
        .size-normal {
          min-height: 120px;
        }
        .size-large {
          min-height: 200px;
          padding: 20px 12px;
        }
        .sticker-card.collected {
          background: rgba(255,255,255,0.06);
        }
        .sticker-card.collected.legendary {
          border-color: rgba(243, 156, 18, 0.5);
          background: linear-gradient(135deg, rgba(243,156,18,0.12), rgba(241,196,15,0.06));
          box-shadow: 0 0 20px rgba(243,156,18,0.15);
        }
        .sticker-card.collected.rare {
          border-color: rgba(52, 152, 219, 0.4);
          background: linear-gradient(135deg, rgba(52,152,219,0.1), rgba(41,128,185,0.05));
          box-shadow: 0 0 15px rgba(52,152,219,0.1);
        }
        .sticker-card.collected.uncommon {
          border-color: rgba(46, 204, 113, 0.3);
          background: linear-gradient(135deg, rgba(46,204,113,0.08), rgba(39,174,96,0.04));
        }
        .sticker-card.collected.common {
          border-color: rgba(139,139,139,0.2);
        }
        .sticker-card.empty {
          opacity: 0.4;
          background: rgba(255,255,255,0.02);
        }
        .sticker-card:hover {
          transform: translateY(-2px);
        }
        .sticker-card.collected:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .sticker-number {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          font-weight: 600;
          position: absolute;
          top: 6px;
          left: 8px;
        }
        .sticker-emoji {
          font-size: ${size === 'large' ? '48px' : '32px'};
          line-height: 1;
        }
        .sticker-name {
          font-size: ${size === 'large' ? '13px' : '10px'};
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sticker-rarity {
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .sticker-count {
          position: absolute;
          top: 4px;
          right: 6px;
          background: #8B5CF6;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 8px;
        }
        .sticker-placeholder {
          font-size: ${size === 'large' ? '48px' : '32px'};
          color: rgba(255,255,255,0.15);
          font-weight: 800;
        }
        .shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(255,255,255,0.03) 45%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0.03) 55%,
            transparent 60%
          );
          pointer-events: none;
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { transform: translateX(-30%) translateY(-30%); }
          50% { transform: translateX(30%) translateY(30%); }
        }
      `}</style>
    </div>
  );
}

function getCategoryEmoji(sticker) {
  const emojiMap = {
    'football': ['⚽','🥅','🏟️','👟','🦵','🧤','🎯','🥇','🤙','🌟','⚡','🔥','💫','🎪','🧱','🎩'],
    'basketball': ['🏀','👑','🌟','✨','🎯','💪','🏆','🔥','💫','⚡','🦅','🐍','🎪','🎭','💎','🌊'],
    'tennis': ['🎾','🏆','🌟','⚡','🎯','💪','🔥','❄️','💫','✨','🌸','🌊','🦊','🐊','☀️','🌙'],
    'olympics': ['🥇','🏊','🤸','🏃','🏋️','🥊','🏊','🎾','🏄','🚴','🤺','🏹','⛷️','🤾','🏑','🛹'],
    'motorsport': ['🏎️','🏁','🔧','⚡','🌟','🔥','💨','🏆','💫','🌊','🦁','❄️','☀️','🌙','⭐','🎯'],
    'planets': ['☿️','♀️','🌍','🔴','🟤','🪐','💠','🔵','⚫','🧊','🌕','🟡','🟠','⚪','💎','🔷'],
    'stars': ['☀️','⭐','🔴','💫','✨','🌟','💙','🟠','🌀','🦅','🦀','💍','💜','🐴','🏛️','👁️'],
    'astronauts': ['👨‍🚀','🧑‍🚀','👩‍🚀','🚀','🌙','🛸','🔭','🌍','⭐','🇬🇧','💫','🇨🇳','👨‍🔬','🛰️','🌌','🇫🇷'],
    'spacecraft': ['🚀','🛸','🛰️','🌌','🔭','📡','🌙','⭐','🤖','🏔️','💫','🪐','🧑‍🚀','🦅','🌟','🐉'],
    'galaxies': ['🌌','🌀','💫','🎩','🔺','🌀','🎡','🚬','👁️','🌻','📡','☁️','⭐','🌟','⚫','🐸'],
    'africa': ['🦁','🐘','🦒','🦓','🦏','🦛','🐆','🦍','🐆','🐃','🦩','🐺','🐿️','🐗','🪶','🦔'],
    'ocean': ['🐋','🦈','🐬','🐙','🐢','🦑','🪼','🦑','🐠','🐳','🔨','🦄','🐡','⭐','🪸','🐟'],
    'rainforest': ['🦜','🐆','🐸','🦥','🦜','🐍','🐸','🐹','🐒','🦛','🦎','🐱','🦎','🐟','🦅','🦋'],
    'arctic': ['🐻‍❄️','🐧','🦊','🦉','🦭','🦭','🐳','🐋','🦌','🐦','🐰','🐹','🦡','🐆','🐂','🐃'],
    'mythical': ['🐉','🔥','🦄','🦅','🐙','🐕','🐴','🐍','⚡','🐍','🦁','🐂','🗿','🐺','🦊','❄️'],
  };
  const emojis = emojiMap[sticker.categoryId] || ['❓'];
  return emojis[sticker.number - 1] || '❓';
}
