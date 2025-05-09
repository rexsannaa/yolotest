import React, { useState, useEffect } from 'react';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  // Simulate boot sequence
  useEffect(() => {
    if (isBooting) {
      const timer = setInterval(() => {
        setBootProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsBooting(false), 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(timer);
    }
  }, [isBooting]);

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username.trim()) {
      onLogin(username);
    } else {
      alert('請輸入使用者名稱');
    }
  };

  // Render boot screen
  if (isBooting) {
    return (
      <div className="boot-screen">
        <div className="boot-content">
          <div className="boot-logo">
            Windows<span style={{ fontWeight: 'normal', marginLeft: '4px' }}>98</span>
          </div>
          
          <div className="boot-progress">
            <div 
              className="boot-progress-fill"
              style={{ width: `${bootProgress}%` }}
            ></div>
          </div>
          
          <div>正在啟動 Windows 98...</div>
        </div>
      </div>
    );
  }

  // Render login screen
  return (
    <div className="login-screen">
      <div className="login-container window">
        <div className="window-title">Windows 登入</div>
        <div className="window-body">
          <div className="login-header">
            請輸入使用者資訊以開始使用 Windows
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="username">使用者名稱:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="login-field">
              <label htmlFor="password">密碼:</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="（選填 - 可留空）"
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ minWidth: '40px' }}
                >
                  {showPassword ? "隱藏" : "顯示"}
                </button>
              </div>
            </div>
            
            <div className="login-actions">
              <button type="submit">登入</button>
              <button type="button" onClick={() => window.location.reload()}>重新啟動</button>
            </div>
          </form>
          
          <div style={{ marginTop: '16px', fontSize: '11px', color: '#444' }}>
            提示: 此為教學展示用途，輸入任意名稱即可登入。
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;