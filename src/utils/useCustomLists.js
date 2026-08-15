import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adw_custom_lists';

const DEFAULT_LISTS = [
  {
    id: 'list-1',
    title: '🔥 Must-Watch Enemies-to-Lovers K-Dramas',
    description: 'The absolute best K-dramas featuring intense rivalry turning into sweet romance.',
    author: 'DramaEnthusiast',
    isOfficial: true,
    items: [
      { id: 114472, title: 'Crash Course in Romance', poster_path: '/4DkhYvO2z6ZkH8K2f5l3A0Wf6J.jpg' },
      { id: 136283, title: 'Business Proposal', poster_path: '/3Yg2mR46a48x5rJ6D7K9xQ2P6d.jpg' },
    ],
    likes: 42,
    createdAt: '2024-06-10',
  },
  {
    id: 'list-2',
    title: '🌸 High-Fantasy Xianxia Masterpieces',
    description: 'Breathtaking Chinese fantasy dramas with deities, immortals, and epic storylines.',
    author: 'XianxiaLover',
    isOfficial: true,
    items: [
      { id: 92685, title: 'The Untamed', poster_path: '/k5vC5p4eY6J2D9mF3k8Q7W.jpg' },
      { id: 124580, title: 'Love Between Fairy and Devil', poster_path: '/p8Q4m2R8x0L2.jpg' },
    ],
    likes: 88,
    createdAt: '2024-07-02',
  },
];

export function getCustomListsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LISTS));
      return DEFAULT_LISTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LISTS;
  }
}

export function saveCustomListsStore(lists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  window.dispatchEvent(new Event('adw_lists_change'));
}

export function useCustomLists() {
  const [lists, setLists] = useState(getCustomListsStore());

  useEffect(() => {
    const handleChange = () => setLists(getCustomListsStore());
    window.addEventListener('adw_lists_change', handleChange);
    return () => window.removeEventListener('adw_lists_change', handleChange);
  }, []);

  const createList = (newList) => {
    const listObj = {
      id: `list-${Date.now()}`,
      title: newList.title,
      description: newList.description || '',
      author: newList.author || 'Anonymous Fan',
      isOfficial: false,
      items: newList.items || [],
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [listObj, ...lists];
    saveCustomListsStore(updated);
    return listObj;
  };

  const toggleLikeList = (listId) => {
    const updated = lists.map(l =>
      l.id === listId ? { ...l, likes: (l.likes || 0) + 1 } : l
    );
    saveCustomListsStore(updated);
  };

  const deleteList = (listId) => {
    const updated = lists.filter(l => l.id !== listId);
    saveCustomListsStore(updated);
  };

  return {
    lists,
    createList,
    toggleLikeList,
    deleteList,
  };
}
