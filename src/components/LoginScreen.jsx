import React, { useState, useEffect } from 'react';
import Button from './Win98UI/Button';
import '../components/Win98UI/styles.css';

/**
 * Windows 98 風格登入畫面元件
 * 
 * @param {Object} props - 元件屬性
 * @param {Function} props.onLogin - 登入成功後的回調函數
 * @param {boolean} props.showLogo - 是否顯示 Windows 標誌
 */
const LoginScreen = ({
  onLogin,
  showLogo = true
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);

  // 模擬開機進度
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

  // 處理登入提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 簡單登入檢查 - 在實際應用中應該有更完善的驗證
    if (username.trim()) {
      // 儲存使用者名稱到 localStorage
      localStorage.setItem('win98_username', username);
      
      // 調用登入回調
      if (onLogin) {
        onLogin(username);
      }
    } else {
      alert('請輸入使用者名稱');
    }
  };

  // 渲染啟動畫面
  if (isBooting) {
    return (
      <div className="win98-boot-screen">
        <div className="win98-boot-content">
          <div className="win98-boot-logo">
            <div className="win98-boot-windows-logo"></div>
            <span className="win98-boot-windows-text">Windows<span className="win98-boot-windows-version">98</span></span>
          </div>
          
          <div className="win98-boot-progress-bar">
            <div 
              className="win98-boot-progress-fill"
              style={{ width: `${bootProgress}%` }}
            ></div>
          </div>
          
          <div className="win98-boot-message">
            正在啟動 Windows 98...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="win98-login-screen">
      <div className="win98-login-container">
        {showLogo && (
          <div className="win98-login-logo">
            <div className="win98-windows-logo"></div>
            <div className="win98-windows-text">
              Windows<span className="win98-windows-version">98</span>
            </div>
          </div>
        )}
        
        <div className="win98-login-box">
          <div className="win98-login-header">
            <div className="win98-login-title">
              請輸入使用者資訊以開始使用 Windows
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="win98-login-form">
            <div className="win98-login-field">
              <label htmlFor="username" className="win98-login-label">使用者名稱:</label>
              <input
                id="username"
                type="text"
                className="win98-login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="win98-login-field">
              <label htmlFor="password" className="win98-login-label">密碼:</label>
              <div className="win98-login-password-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="win98-login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="（選填 - 可留空）"
                />
                <Button 
                  type="button" 
                  size="small" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="win98-login-show-password"
                >
                  {showPassword ? "隱藏" : "顯示"}
                </Button>
              </div>
            </div>
            
            <div className="win98-login-actions">
              <Button type="submit">登入</Button>
              <Button type="button" onClick={() => window.location.reload()}>重新啟動</Button>
            </div>
          </form>
          
          <div className="win98-login-footer">
            <p className="win98-login-footnote">
              提示: 此為教學展示用途，輸入任意名稱即可登入。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 添加 CSS 樣式
const styles = `
  /* 登入畫面樣式 */
  .win98-login-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #008080;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
  }
  
  .win98-login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .win98-login-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .win98-windows-logo {
    width: 150px;
    height: 150px;
    background-color: #ff0000;
    position: relative;
    transform: perspective(500px) rotateY(20deg);
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    gap: 8px;
    padding: 8px;
  }
  
  .win98-windows-logo::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 50%;
    background-color: #00ff00;
  }
  
  .win98-windows-logo::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 50%;
    background-color: #0000ff;
  }
  
  .win98-windows-text {
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-top: 10px;
  }
  
  .win98-windows-version {
    font-size: 24px;
    font-weight: normal;
    margin-left: 4px;
  }
  
  .win98-login-box {
    background-color: #c0c0c0;
    border: 2px solid #dfdfdf;
    box-shadow: 
      inset -1px -1px 0 0 #000,
      inset 1px 1px 0 0 #fff,
      inset -2px -2px 0 0 #808080,
      inset 2px 2px 0 0 #dfdfdf,
      2px 2px 4px rgba(0, 0, 0, 0.5);
    padding: 16px;
    width: 400px;
  }
  
  .win98-login-header {
    margin-bottom: 16px;
  }
  
  .win98-login-title {
    font-size: 14px;
    font-weight: bold;
  }
  
  .win98-login-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .win98-login-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .win98-login-label {
    font-size: 12px;
  }
  
  .win98-login-input {
    padding: 4px;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    font-size: 12px;
    border: 1px solid #808080;
    box-shadow: 
      inset -1px -1px 0 0 #fff,
      inset 1px 1px 0 0 #000;
  }
  
  .win98-login-password-container {
    display: flex;
    gap: 4px;
  }
  
  .win98-login-password-container .win98-login-input {
    flex: 1;
  }
  
  .win98-login-show-password {
    min-width: 40px !important;
  }
  
  .win98-login-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
  
  .win98-login-footer {
    margin-top: 16px;
    font-size: 11px;
    color: #444;
  }
  
  .win98-login-footnote {
    margin: 0;
  }
  
  /* 啟動畫面樣式 */
  .win98-boot-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
  }
  
  .win98-boot-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  .win98-boot-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .win98-boot-windows-logo {
    width: 200px;
    height: 200px;
    background-color: #000;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .win98-boot-windows-logo::before {
    content: '';
    width: 140px;
    height: 140px;
    background: linear-gradient(
      to bottom right,
      #ff0000 0%, #ff0000 25%,
      #00ff00 25%, #00ff00 50%,
      #0000ff 50%, #0000ff 75%,
      #ffff00 75%, #ffff00 100%
    );
    transform: rotate(45deg);
    border: 2px solid #000;
  }
  
  .win98-boot-windows-text {
    font-size: 36px;
    font-weight: bold;
    color: #fff;
    margin-top: 20px;
  }
  
  .win98-boot-windows-version {
    font-size: 28px;
    font-weight: normal;
    margin-left: 4px;
  }
  
  .win98-boot-progress-bar {
    width: 300px;
    height: 20px;
    background-color: #000;
    border: 2px solid #fff;
    overflow: hidden;
  }
  
  .win98-boot-progress-fill {
    height: 100%;
    background-color: #fff;
    transition: width 0.2s ease-out;
  }
  
  .win98-boot-message {
    color: #fff;
    font-size: 14px;
  }
`;

// 將樣式添加到文檔中
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoginScreen;