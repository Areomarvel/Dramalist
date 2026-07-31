import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DramaDetail from './pages/DramaDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import Upcoming from './pages/Upcoming';
import Navbar from './components/Navbar';
import './App.css';

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
    <>
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drama/:id" element={<DramaDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} /> 
        <Route path="/search" element={<SearchResults />} />
        <Route path="/upcoming" element={<Upcoming />} />
      </Routes>
    </>
  );
}

export default App;
