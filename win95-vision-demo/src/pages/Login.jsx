import React, { useState } from 'react';
import LoginScreen from '../components/LoginScreen';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('請輸入使用者名稱');
      return;
    }
    
    // 模擬登入過程
    setIsLoading(true);
    setError('');
    
    // 簡單延遲模擬登入過程
    setTimeout(() => {
      setIsLoading(false);
      // 因為這是演示，所以不做實際驗證
      onLogin(username);
    }, 1000);
  };
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="login-container">
      <div className="win95-login-screen">
        <div className="win95-login-header">
          <div className="win95-logo">Windows 95</div>
          <div className="win95-time">{currentTime}</div>
        </div>
        
        <LoginScreen 
          username={username}
          password={password}
          error={error}
          isLoading={isLoading}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
        />
        
        <div className="win95-login-footer">
          <div className="win95-login-buttons">
            <button 
              className="win95-button" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
            <button className="win95-button">關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;