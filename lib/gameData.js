// Sticker Albums and Data

const ALBUMS = [
  {
    id: 'world-legends',
    name: 'World Legends',
    description: 'Legendary athletes from around the globe',
    icon: '🏆',
    totalStickers: 80,
    categories: [
      { name: 'Football Icons', icon: '⚽', stickers: generateStickers('world-legends', 'football', [
        'Pelé', 'Maradona', 'Zidane', 'Ronaldo R9', 'Beckham', 'Maldini', 'Cruyff', 'Platini',
        'Ronaldinho', 'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Buffon', 'Xavi'
      ])},
      { name: 'Basketball Stars', icon: '🏀', stickers: generateStickers('world-legends', 'basketball', [
        'Michael Jordan', 'LeBron James', 'Kobe Bryant', 'Magic Johnson', 'Larry Bird', 'Shaq',
        'Tim Duncan', 'Kareem', 'Steph Curry', 'Kevin Durant', 'Giannis', 'Luka Dončić',
        'Wilt Chamberlain', 'Bill Russell', 'Hakeem', 'Iverson'
      ])},
      { name: 'Tennis Greats', icon: '🎾', stickers: generateStickers('world-legends', 'tennis', [
        'Federer', 'Nadal', 'Djokovic', 'Serena Williams', 'Agassi', 'Sampras', 'Borg', 'McEnroe',
        'Steffi Graf', 'Billie Jean King', 'Venus Williams', 'Naomi Osaka', 'Sinner', 'Alcaraz',
        'Navratilova', 'Connors'
      ])},
      { name: 'Olympic Heroes', icon: '🥇', stickers: generateStickers('world-legends', 'olympics', [
        'Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Carl Lewis', 'Jesse Owens', 'Nadia Comăneci',
        'Muhammad Ali', 'Serena Williams', 'Ian Thorpe', 'Mo Farah', 'Allyson Felix', 'Kipchoge',
        'Daley Thompson', 'Jackie Joyner', 'Paavo Nurmi', 'Emil Zátopek'
      ])},
      { name: 'Motorsport Legends', icon: '🏎️', stickers: generateStickers('world-legends', 'motorsport', [
        'Senna', 'Schumacher', 'Hamilton', 'Verstappen', 'Prost', 'Lauda', 'Fangio', 'Clark',
        'Vettel', 'Alonso', 'Mansell', 'Piquet', 'Häkkinen', 'Räikkönen', 'Leclerc', 'Norris'
      ])}
    ]
  },
  {
    id: 'space-explorers',
    name: 'Space Explorers',
    description: 'Journey through the cosmos',
    icon: '🚀',
    totalStickers: 80,
    categories: [
      { name: 'Planets', icon: '🪐', stickers: generateStickers('space-explorers', 'planets', [
        'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune',
        'Pluto', 'Europa', 'Titan', 'Ganymede', 'Io', 'Callisto', 'Enceladus', 'Triton'
      ])},
      { name: 'Stars & Nebulae', icon: '⭐', stickers: generateStickers('space-explorers', 'stars', [
        'Sun', 'Sirius', 'Betelgeuse', 'Polaris', 'Alpha Centauri', 'Vega', 'Rigel', 'Aldebaran',
        'Orion Nebula', 'Eagle Nebula', 'Crab Nebula', 'Ring Nebula', 'Carina Nebula', 'Horsehead',
        'Pillars of Creation', 'Cat\'s Eye Nebula'
      ])},
      { name: 'Astronauts', icon: '👨‍🚀', stickers: generateStickers('space-explorers', 'astronauts', [
        'Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Sally Ride', 'John Glenn', 'Valentina T.',
        'Chris Hadfield', 'Mae Jemison', 'Alan Shepard', 'Tim Peake', 'Peggy Whitson', 'Yang Liwei',
        'Scott Kelly', 'Sunita Williams', 'Samantha Cristoforetti', 'Thomas Pesquet'
      ])},
      { name: 'Spacecraft', icon: '🛸', stickers: generateStickers('space-explorers', 'spacecraft', [
        'Apollo 11', 'Space Shuttle', 'ISS', 'Voyager 1', 'Voyager 2', 'Hubble', 'James Webb',
        'Sputnik', 'Curiosity Rover', 'Perseverance', 'New Horizons', 'Cassini', 'Soyuz',
        'Falcon 9', 'Starship', 'Dragon Capsule'
      ])},
      { name: 'Galaxies', icon: '🌌', stickers: generateStickers('space-explorers', 'galaxies', [
        'Milky Way', 'Andromeda', 'Whirlpool', 'Sombrero', 'Triangulum', 'Pinwheel',
        'Cartwheel', 'Cigar Galaxy', 'Black Eye', 'Sunflower', 'Centaurus A',
        'Large Magellanic', 'Small Magellanic', 'NGC 1300', 'Messier 87', 'Tadpole Galaxy'
      ])}
    ]
  },
  {
    id: 'wild-kingdom',
    name: 'Wild Kingdom',
    description: 'Amazing animals from every continent',
    icon: '🦁',
    totalStickers: 80,
    categories: [
      { name: 'African Safari', icon: '🌍', stickers: generateStickers('wild-kingdom', 'africa', [
        'Lion', 'Elephant', 'Giraffe', 'Zebra', 'Rhino', 'Hippo', 'Cheetah', 'Gorilla',
        'Leopard', 'Wildebeest', 'Flamingo', 'Hyena', 'Meerkat', 'Warthog', 'Ostrich', 'Pangolin'
      ])},
      { name: 'Ocean Deep', icon: '🌊', stickers: generateStickers('wild-kingdom', 'ocean', [
        'Blue Whale', 'Great White Shark', 'Dolphin', 'Octopus', 'Sea Turtle', 'Manta Ray',
        'Jellyfish', 'Seahorse', 'Clownfish', 'Orca', 'Hammerhead', 'Narwhal', 'Pufferfish',
        'Starfish', 'Coral', 'Anglerfish'
      ])},
      { name: 'Rainforest', icon: '🌴', stickers: generateStickers('wild-kingdom', 'rainforest', [
        'Toucan', 'Jaguar', 'Tree Frog', 'Sloth', 'Macaw', 'Anaconda', 'Poison Dart Frog',
        'Capybara', 'Howler Monkey', 'Tapir', 'Chameleon', 'Ocelot', 'Iguana', 'Piranha',
        'Harpy Eagle', 'Morpho Butterfly'
      ])},
      { name: 'Arctic & Antarctic', icon: '❄️', stickers: generateStickers('wild-kingdom', 'arctic', [
        'Polar Bear', 'Emperor Penguin', 'Arctic Fox', 'Snowy Owl', 'Walrus', 'Seal',
        'Narwhal', 'Beluga', 'Reindeer', 'Puffin', 'Arctic Hare', 'Lemming',
        'Wolverine', 'Snow Leopard', 'Yak', 'Musk Ox'
      ])},
      { name: 'Mythical Beasts', icon: '🐉', stickers: generateStickers('wild-kingdom', 'mythical', [
        'Dragon', 'Phoenix', 'Unicorn', 'Griffin', 'Kraken', 'Cerberus', 'Pegasus', 'Hydra',
        'Thunderbird', 'Basilisk', 'Chimera', 'Minotaur', 'Sphinx', 'Fenrir', 'Kitsune', 'Yeti'
      ])}
    ]
  }
];

function generateStickers(albumId, categoryId, names) {
  return names.map((name, i) => {
    const num = i + 1;
    const rarity = num <= 2 ? 'legendary' : num <= 5 ? 'rare' : num <= 9 ? 'uncommon' : 'common';
    return {
      id: `${albumId}-${categoryId}-${num}`,
      number: num,
      name,
      rarity,
      categoryId,
      albumId,
    };
  });
}

const RARITY_CONFIG = {
  common: { chance: 0.50, color: '#8B8B8B', label: 'Common', glow: 'rgba(139,139,139,0.3)' },
  uncommon: { chance: 0.30, color: '#2ECC71', label: 'Uncommon', glow: 'rgba(46,204,113,0.4)' },
  rare: { chance: 0.15, color: '#3498DB', label: 'Rare', glow: 'rgba(52,152,219,0.5)' },
  legendary: { chance: 0.05, color: '#F39C12', label: 'Legendary', glow: 'rgba(243,156,18,0.6)' },
};

const AVATARS = ['😎', '🤠', '🧑‍🚀', '🦸', '🧙', '🥷', '🎮', '⭐', '🔥', '💎', '🏆', '🎯'];

function getRandomStickers(albumId, count = 5) {
  const album = ALBUMS.find(a => a.id === albumId);
  if (!album) return [];

  const allStickers = album.categories.flatMap(c => c.stickers);
  const result = [];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let targetRarity;
    if (roll < RARITY_CONFIG.legendary.chance) targetRarity = 'legendary';
    else if (roll < RARITY_CONFIG.legendary.chance + RARITY_CONFIG.rare.chance) targetRarity = 'rare';
    else if (roll < RARITY_CONFIG.legendary.chance + RARITY_CONFIG.rare.chance + RARITY_CONFIG.uncommon.chance) targetRarity = 'uncommon';
    else targetRarity = 'common';

    const pool = allStickers.filter(s => s.rarity === targetRarity);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    result.push({ ...picked });
  }

  return result;
}

export { ALBUMS, RARITY_CONFIG, AVATARS, getRandomStickers };
