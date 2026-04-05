import { useState, useEffect, useCallback } from 'react';
import { ALBUMS, getRandomStickers } from './gameData';

const INITIAL_STATE = {
  profile: {
    name: '',
    avatar: '😎',
    createdAt: null,
    level: 1,
    xp: 0,
  },
  collection: {},       // { [stickerId]: count }
  activeAlbumId: null,
  lastPackOpen: null,    // ISO date string of last pack open
  packsOpened: 0,
  totalStickersCollected: 0,
  duplicatesFound: 0,
  tradedIn: 0,
};

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function useGameState() {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sticker-collector-state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {
        setState(INITIAL_STATE);
      }
    } else {
      setState(INITIAL_STATE);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (state && loaded) {
      localStorage.setItem('sticker-collector-state', JSON.stringify(state));
    }
  }, [state, loaded]);

  const updateProfile = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates, createdAt: prev.profile.createdAt || new Date().toISOString() }
    }));
  }, []);

  const setActiveAlbum = useCallback((albumId) => {
    setState(prev => ({ ...prev, activeAlbumId: albumId }));
  }, []);

  const canOpenPack = useCallback(() => {
    if (!state) return false;
    const today = getToday();
    return state.lastPackOpen !== today;
  }, [state]);

  const openPack = useCallback((albumId) => {
    if (!canOpenPack()) return [];

    const stickers = getRandomStickers(albumId, 5);
    const today = getToday();

    setState(prev => {
      const newCollection = { ...prev.collection };
      let newDuplicates = prev.duplicatesFound;

      stickers.forEach(s => {
        if (newCollection[s.id]) {
          newCollection[s.id] += 1;
          newDuplicates++;
        } else {
          newCollection[s.id] = 1;
        }
      });

      const xpGain = stickers.reduce((sum, s) => {
        const xpMap = { common: 5, uncommon: 10, rare: 25, legendary: 50 };
        return sum + (xpMap[s.rarity] || 5);
      }, 0);

      const newXp = prev.profile.xp + xpGain;
      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prev,
        collection: newCollection,
        lastPackOpen: today,
        packsOpened: prev.packsOpened + 1,
        totalStickersCollected: prev.totalStickersCollected + 5,
        duplicatesFound: newDuplicates,
        profile: {
          ...prev.profile,
          xp: newXp,
          level: newLevel,
        }
      };
    });

    return stickers;
  }, [canOpenPack]);

  const tradeInDuplicates = useCallback((albumId) => {
    const album = ALBUMS.find(a => a.id === albumId);
    if (!album) return null;

    const allStickers = album.categories.flatMap(c => c.stickers);
    const duplicateIds = [];

    allStickers.forEach(s => {
      const count = state.collection[s.id] || 0;
      if (count > 1) {
        for (let i = 1; i < count; i++) {
          duplicateIds.push(s.id);
        }
      }
    });

    if (duplicateIds.length < 3) return null;

    // Trade 3 duplicates for 1 new sticker you don't have
    const missing = allStickers.filter(s => !state.collection[s.id]);
    if (missing.length === 0) return null;

    const gained = missing[Math.floor(Math.random() * missing.length)];

    setState(prev => {
      const newCollection = { ...prev.collection };
      let traded = 0;
      for (const id of duplicateIds) {
        if (traded >= 3) break;
        if (newCollection[id] > 1) {
          newCollection[id] -= 1;
          traded++;
        }
      }
      newCollection[gained.id] = (newCollection[gained.id] || 0) + 1;

      return {
        ...prev,
        collection: newCollection,
        tradedIn: prev.tradedIn + 1,
        profile: { ...prev.profile, xp: prev.profile.xp + 15 }
      };
    });

    return gained;
  }, [state]);

  const getAlbumProgress = useCallback((albumId) => {
    if (!state) return { collected: 0, total: 0, percentage: 0 };
    const album = ALBUMS.find(a => a.id === albumId);
    if (!album) return { collected: 0, total: 0, percentage: 0 };

    const allStickers = album.categories.flatMap(c => c.stickers);
    const collected = allStickers.filter(s => state.collection[s.id]).length;
    return {
      collected,
      total: allStickers.length,
      percentage: Math.round((collected / allStickers.length) * 100)
    };
  }, [state]);

  const getCategoryProgress = useCallback((albumId, categoryStickers) => {
    if (!state) return { collected: 0, total: 0 };
    const collected = categoryStickers.filter(s => state.collection[s.id]).length;
    return { collected, total: categoryStickers.length };
  }, [state]);

  const getDuplicateCount = useCallback((albumId) => {
    if (!state) return 0;
    const album = ALBUMS.find(a => a.id === albumId);
    if (!album) return 0;
    const allStickers = album.categories.flatMap(c => c.stickers);
    return allStickers.reduce((sum, s) => {
      const count = state.collection[s.id] || 0;
      return sum + Math.max(0, count - 1);
    }, 0);
  }, [state]);

  const resetGame = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem('sticker-collector-state');
  }, []);

  return {
    state,
    loaded,
    updateProfile,
    setActiveAlbum,
    canOpenPack,
    openPack,
    tradeInDuplicates,
    getAlbumProgress,
    getCategoryProgress,
    getDuplicateCount,
    resetGame,
  };
}
