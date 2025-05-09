import React from 'react';
import './LoginScreen.css';

function LoginScreen({ 
  username, 
  password, 
  error, 
  isLoading, 
  onUsernameChange, 
  onPasswordChange, 
  onSubmit 
}) {
  return (
    <div className="login-screen">
      <div className="login-form-container">
        <div className="login-logo">
          <div className="windows-logo">
            <div className="logo-grid">
              <div className="logo-square red"></div>
              <div className="logo-square green"></div>
              <div className="logo-square blue"></div>
              <div className="logo-square yellow"></div>
            </div>
          </div>
          <div className="login-title">
            <h1>Windows 95</h1>
            <h2>機器視覺訓練系統</h2>
          </div>
        </div>
        
        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">使用者名稱：</label>
            <input
              type="text"
              id="username"
              className="win95-input"
              value={username}
              onChange={onUsernameChange}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密碼：</label>
            <input
              type="password"
              id="password"
              className="win95-input"
              value={password}
              onChange={onPasswordChange}
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="（任意密碼都可以）"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            <div className="login-info">
              <p className="login-instruction">
                請輸入使用者名稱以登入系統<br />
                （這是演示系統，任何使用者名稱都可以登入）
              </p>
            </div>
          </div>
        </form>
      </div>
      
      <div className="login-screen-footer">
        <div className="system-info">
          <p>演示版本 1.0</p>
          <p>© 2025 Windows 95 風格機器視覺訓練系統</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;