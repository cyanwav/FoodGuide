import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App: React.FC = () => {
  useEffect(() => {

    const clearLocalStorage = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', clearLocalStorage);

    return () => {
      window.removeEventListener('beforeunload', clearLocalStorage);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
