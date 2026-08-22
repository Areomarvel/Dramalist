import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import DramaDetail from './pages/DramaDetail';
import MovieDetail from './pages/MovieDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import FilteredResults from './pages/FilteredResults';
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

function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const prevLocationKey = useRef(location.key);

  // Show loading screen on route changes
  useEffect(() => {
    if (location.key !== prevLocationKey.current) {
      prevLocationKey.current = location.key;
      setIsLoading(true);
    }
  }, [location.key]);

  return (
    <>
      {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drama/:id" element={<DramaDetail />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/filtered" element={<FilteredResults />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lists" element={<CustomLists />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AuthModal />
      <Footer />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
