import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adw_progress_tracker';

export function getProgressStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgressStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event('adw_progress_change'));
}

export function useProgressTracker(dramaId) {
  const [store, setStore] = useState(getProgressStore());

  useEffect(() => {
    const handleStoreChange = () => setStore(getProgressStore());
    window.addEventListener('adw_progress_change', handleStoreChange);
    return () => window.removeEventListener('adw_progress_change', handleStoreChange);
  }, []);

  const dramaData = dramaId ? store[dramaId] || null : null;

  const updateProgress = (id, data) => {
    const current = store[id] || {};
    const updated = {
      ...store,
      [id]: {
        ...current,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };
    saveProgressStore(updated);
  };

  const removeProgress = (id) => {
    const copy = { ...store };
    delete copy[id];
    saveProgressStore(copy);
  };

  return {
    allProgress: store,
    progress: dramaData,
    updateProgress,
    removeProgress,
  };
}
