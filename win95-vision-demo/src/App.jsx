import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Desktop from './pages/Desktop';
import AppWindow from './pages/AppWindow';
import './App.css'; // 如果您想要添加App級別的樣式

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 檢查本地存儲中的登入狀態
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // 處理登入
  const handleLogin = (username) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    setIsLoggedIn(true);
  };

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="win95-app">
        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/desktop" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/desktop" 
            element={isLoggedIn ? <Desktop onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/app/:appId" 
            element={isLoggedIn ? <AppWindow /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;