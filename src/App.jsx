import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DramaDetail from './pages/DramaDetail';
import MovieDetail from './pages/MovieDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import Upcoming from './pages/Upcoming';
import Forum from './pages/Forum';
import Watchlist from './pages/Watchlist';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import CustomLists from './pages/CustomLists';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
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
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lists" element={<CustomLists />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <BackToTop />
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
