import { useState, useEffect } from 'react';

const STORAGE_KEY = 'adw_user_profile';

const DEFAULT_PROFILE = {
  name: 'Drama Explorer',
  bio: 'Passionate fan of K-dramas, C-dramas & anime. Always looking for the next emotional roller coaster!',
  avatar: '🎭',
  favoriteGenres: ['Romance', 'Historical', 'Mystery'],
  joinedDate: '2024-01-15',
};

export function getUserProfileStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfileStore(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('adw_profile_change'));
}

export function useUserProfile() {
  const [profile, setProfile] = useState(getUserProfileStore());

  useEffect(() => {
    const handleChange = () => setProfile(getUserProfileStore());
    window.addEventListener('adw_profile_change', handleChange);
    return () => window.removeEventListener('adw_profile_change', handleChange);
  }, []);

  const updateProfile = (fields) => {
    const updated = { ...profile, ...fields };
    saveUserProfileStore(updated);
  };

  return {
    profile,
    updateProfile,
  };
}
