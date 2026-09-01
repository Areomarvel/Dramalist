import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'midnight-blue',
    name: '🌊 Midnight Blue (Default)',
    description: 'Deep navy with cool blue accents inspired by DramaInfo',
    preview: { bg: '#081426', card: '#12243d', accent: '#5fb6f8', accent2: '#9cc6ff' }
  },
  {
    id: 'black-white',
    name: '🖤 OLED Black & White',
    description: 'Sleek dark OLED black with crisp white high contrast accents',
    preview: { bg: '#000000', card: '#171717', accent: '#ffffff', accent2: '#e5e5e5' }
  },
  {
    id: 'cherry-blossom',
    name: '🌸 Cherry Blossom & Rose Gold',
    description: 'Deep plum charcoal with rose pink and warm peach coral',
    preview: { bg: '#130e18', card: '#251b30', accent: '#f43f5e', accent2: '#fb923c' }
  },
  {
    id: 'sapphire-gold',
    name: '💎 Midnight Sapphire & Gold',
    description: 'Deep navy slate with cyan blue and amber gold accents',
    preview: { bg: '#0a0f1d', card: '#131c31', accent: '#38bdf8', accent2: '#fbbf24' }
  },
  {
    id: 'amethyst-violet',
    name: '💜 Royal Amethyst & Magenta',
    description: 'Rich royal purple with electric violet and neon pink',
    preview: { bg: '#0d0b18', card: '#19142b', accent: '#8b5cf6', accent2: '#ec4899' }
  },
  {
    id: 'emerald-jade',
    name: '🌿 Emerald Jade & Mint',
    description: 'Deep forest dark with mint emerald and warm amber',
    preview: { bg: '#09130e', card: '#11241b', accent: '#10b981', accent2: '#f59e0b' }
  },
  {
    id: 'sunset-amber',
    name: '🔥 Sunset Amber & Crimson',
    description: 'Obsidian dark with fiery amber orange and deep red',
    preview: { bg: '#160b0b', card: '#271212', accent: '#f97316', accent2: '#ef4444' }
  },
  {
    id: 'light-monochrome',
    name: '☀️ Minimalist Light Mode',
    description: 'Clean crisp white background with bold dark accents',
    preview: { bg: '#ffffff', card: '#f8fafc', accent: '#0f172a', accent2: '#475569' }
  }
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem('dramainfo_theme');
    return savedTheme || 'midnight-blue';
  });

  const setTheme = (newThemeId) => {
    setThemeState(newThemeId);
    localStorage.setItem('dramainfo_theme', newThemeId);
    document.documentElement.setAttribute('data-theme', newThemeId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
