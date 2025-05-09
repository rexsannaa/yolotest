import React from 'react';
// 刪除 import './LoginScreen.css'; 行

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
    <div className="window" style={{width: '400px', margin: '100px auto'}}>
      <div className="title-bar">
        <div className="title-bar-text">Windows 98 登入</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      
      <div className="window-body">
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <img src="/assets/win95-icons/computer.png" alt="Logo" style={{width: '64px', height: '64px'}} />
          <h3>機器視覺訓練系統</h3>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="field-row" style={{marginBottom: '10px'}}>
            <label htmlFor="username">使用者名稱：</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={onUsernameChange}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="field-row" style={{marginBottom: '10px'}}>
            <label htmlFor="password">密碼：</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={onPasswordChange}
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="（任意密碼都可以）"
            />
          </div>
          
          {error && <div className="status-bar-field" style={{color: 'red'}}>{error}</div>}
          
          <div style={{marginTop: '20px', textAlign: 'center'}}>
            <p className="status-bar-field">
              請輸入使用者名稱以登入系統
              <br />
              （這是演示系統，任何使用者名稱都可以登入）
            </p>
          </div>
          
          <div className="field-row" style={{justifyContent: 'center', marginTop: '20px'}}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? '登入中...' : '登入'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="status-bar">
        <div className="status-bar-field">演示版本 1.0</div>
        <div className="status-bar-field">© 2025 Windows 98 風格機器視覺訓練系統</div>
      </div>
    </div>
  );
}

export default LoginScreen;