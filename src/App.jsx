import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DramaDetail from './pages/DramaDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import Upcoming from './pages/Upcoming';
import Forum from './pages/Forum';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [prevLocation, setPrevLocation] = useState(location.key);

  // Show loading screen on route changes
  useEffect(() => {
    if (location.key !== prevLocation) {
      setIsLoading(true);
      setPrevLocation(location.key);
    }
  }, [location.key]);

  return (
    <>
      {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drama/:id" element={<DramaDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/forum" element={<Forum />} />
      </Routes>
    </>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
  );
}

export default App;
