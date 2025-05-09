import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Win98UI/Desktop';
import Window from './components/Win98UI/Window';
import TrainingDemo from './components/TrainingDemo';
import 'bootstrap/dist/css/bootstrap.min.css';
import '98.css/dist/98.css';
import './App.css';

// App-specific styles
const App = () => {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activeWindows, setActiveWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  // Check if already logged in
  useEffect(() => {
    const savedUsername = localStorage.getItem('win98_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login
  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('win98_username', user);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('win98_username');
    setUsername('');
    setIsLoggedIn(false);
    setActiveWindows([]);
  };

  // Handle icon click
  const handleIconClick = (icon) => {
    switch (icon.id) {
      case 'vision-trainer':
        openWindow('trainer');
        break;
      case 'my-computer':
        openWindow('my-computer');
        break;
      case 'recyclebin':
        openWindow('recyclebin');
        break;
      case 'help':
        openWindow('help');
        break;
      case 'text-note':
        openWindow('text-note');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };
  

  // Open window
  const openWindow = (id) => {
    if (!activeWindows.includes(id)) {
      setActiveWindows([...activeWindows, id]);
    }
    setActiveWindowId(id);
  };

  // Close window
  const closeWindow = (id) => {
    setActiveWindows(activeWindows.filter(windowId => windowId !== id));
    if (activeWindowId === id) {
      setActiveWindowId(activeWindows.length > 1 ? activeWindows[activeWindows.length - 2] : null);
    }
  };

  // Desktop icons
  const desktopIcons = [
    {
      id: 'vision-trainer',
      icon: '/icons/vision-app.png',
      label: '機器視覺訓練'
    },
    {
      id: 'my-computer',
      icon: '/icons/my-computer.png',
      label: '我的電腦'
    },
    {
      id: 'recyclebin',
      icon: '/icons/recycle-bin.png',
      label: '資源回收筒'
    },
    {
      id: 'help',
      icon: '/icons/help.png',
      label: '說明'
    },
    {
      id: 'logout',
      icon: '/icons/logout.png',
      label: '登出'
    },
    {
      id: 'text-note',
      icon: '/icons/notepad.png',
      label: '碩士報名表'
    }
    
  ];

  // Window configurations
  const windows = [
    {
      id: 'trainer',
      title: '機器視覺訓練',
      icon: '/icons/vision-app.png',
      content: <TrainingDemo onClose={() => closeWindow('trainer')} />,
      position: { x: 100, y: 100 },
      size: { width: 700, height: 500 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'my-computer',
      title: '我的電腦',
      icon: '/icons/my-computer.png',
      content: (
        <div className="window-content">
          <h3>我的電腦</h3>
          <p>這是一個簡化的Windows 98界面模擬，用於展示機器視覺訓練系統。</p>
          <p>請點擊桌面上的「機器視覺訓練」圖標來開始體驗。</p>
        </div>
      ),
      position: { x: 150, y: 120 },
      size: { width: 400, height: 300 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'recyclebin',
      title: '資源回收筒',
      icon: '/icons/recycle-bin.png',
      content: (
        <div className="window-content">
          <div className="text-center my-4">
            <p>資源回收筒是空的</p>
            <button className="btn" onClick={() => closeWindow('recyclebin')}>關閉</button>
          </div>
        </div>
      ),
      position: { x: 200, y: 150 },
      size: { width: 350, height: 250 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'help',
      title: '說明',
      icon: '/icons/help.png',
      content: (
        <div className="window-content">
          <h3>Windows 98 風格機器視覺演示系統</h3>
          
          <div className="help-section">
            <h4>使用說明：</h4>
            <p>本系統模擬了Windows 98的經典界面，並提供了一個簡化的機器視覺訓練流程展示。</p>
          </div>
          
          <div className="help-section">
            <h4>功能介紹：</h4>
            <ul>
              <li>雙擊「機器視覺訓練」圖標開始體驗</li>
              <li>使用相機拍攝樣本圖像</li>
              <li>觀看資料增強效果</li>
              <li>模擬訓練過程</li>
            </ul>
          </div>
          
          <div className="help-section">
            <h4>操作技巧：</h4>
            <ul>
              <li>窗口可以拖動、調整大小</li>
              <li>任務欄顯示打開的窗口</li>
              <li>點擊開始菜單可以查看系統選項</li>
            </ul>
          </div>
          
          <div className="text-center mt-4">
            <button className="btn" onClick={() => closeWindow('help')}>關閉說明</button>
          </div>
        </div>
      ),
      position: { x: 250, y: 180 },
      size: { width: 450, height: 350 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'text-note',
      title: '碩士報名表',
      icon: '/icons/notepad.png',
      content: (
        <div className="window-content">
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'Courier New',
            fontSize: '12px'
          }}>
    {`歡迎來到先進智慧製造中心。
我們致力於智慧製造研究與技術開發。
有興趣的同學歡迎
找王聖禾教授共同學習研究。`}
          </pre>
        </div>
      ),
      position: { x: 300, y: 200 },
      size: { width: 400, height: 300 },
      resizable: false,
      minimizable: true,
      maximizable: false
    }
    
  ];
  
  return (
    <div className="screen-container">
      <div className="scaled-wrapper">
        <div className="win98-app">
          {!isLoggedIn ? (
            <LoginScreen onLogin={handleLogin} />
          ) : (
            <Desktop
              username={username}
              icons={desktopIcons}
              windows={windows}
              onIconClick={handleIconClick}
              activeWindows={activeWindows}
              activeWindowId={activeWindowId}
              onWindowActivate={setActiveWindowId}
              onWindowClose={closeWindow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;