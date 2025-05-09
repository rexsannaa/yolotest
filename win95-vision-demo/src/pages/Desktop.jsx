import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 移除 Win95Desktop 的引入
// 移除 './Desktop.css' 的引入

// 應用程序圖標配置
const appIcons = [
  { 
    id: 'vision-app', 
    name: '機器視覺訓練', 
    icon: 'computer',
    type: 'application'
  },
  { 
    id: 'camera', 
    name: '攝像頭', 
    icon: 'camera',
    type: 'application'
  },
  { 
    id: 'my-computer', 
    name: '我的電腦', 
    icon: 'computer',
    type: 'system'
  },
  { 
    id: 'recycle-bin', 
    name: '資源回收筒', 
    icon: 'recycle-bin',
    type: 'system'
  },
  { 
    id: 'notepad', 
    name: '記事本', 
    icon: 'notepad',
    type: 'system'
  }
];

function Desktop({ onLogout }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('使用者');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  
  // 獲取使用者名稱
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  // 更新時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 處理應用程序啟動
  const handleAppLaunch = (appId) => {
    setShowStartMenu(false); // 點擊應用後關閉開始菜單
    
    if (appId === 'vision-app') {
      navigate('/app/vision-app');
    } else if (appId === 'camera') {
      navigate('/app/camera');
    } else {
      // 在桌面上打開系統應用程序
      if (!openWindows.includes(appId)) {
        setOpenWindows([...openWindows, appId]);
      }
    }
  };
  
  // 關閉桌面窗口
  const handleCloseWindow = (appId) => {
    setOpenWindows(openWindows.filter(id => id !== appId));
  };
  
  // 處理登出
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  // 開始菜單項目
  const startMenuItems = [
    { id: 'programs', label: '程式集' },
    { id: 'documents', label: '文件' },
    { id: 'settings', label: '設定' },
    { id: 'find', label: '搜尋' },
    { id: 'help', label: '說明' },
    { id: 'run', label: '執行...' },
    { id: 'shutdown', label: '關機...', action: handleLogout }
  ];

  // 渲染桌面圖標
  const renderIcons = () => {
    return (
      <div style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 70px)', gap: '20px' }}>
        {appIcons.map(app => (
          <div 
            key={app.id}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '3px',
              textAlign: 'center'
            }}
            onClick={() => handleAppLaunch(app.id)}
          >
            <img 
              src={`/assets/win95-icons/${app.icon}.png`} 
              alt={app.name} 
              style={{ width: '32px', height: '32px' }}
            />
            <span style={{ marginTop: '5px', color: 'white', fontSize: '12px', textShadow: '1px 1px 1px black' }}>
              {app.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // 渲染開啟的系統應用程序窗口
  const renderWindows = () => {
    return openWindows.map(appId => {
      const app = appIcons.find(a => a.id === appId);
      if (!app) return null;

      return (
        <div 
          key={appId} 
          className="window" 
          style={{ 
            position: 'absolute', 
            top: '100px', 
            left: '100px', 
            width: '300px', 
            height: '200px',
            zIndex: 100 
          }}
        >
          <div className="title-bar">
            <div className="title-bar-text">{app.name}</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close" onClick={() => handleCloseWindow(appId)}></button>
            </div>
          </div>
          <div className="window-body">
            <p>這是 {app.name} 的內容。這是一個示範視窗。</p>
          </div>
        </div>
      );
    });
  };

  // 渲染開始菜單
  const renderStartMenu = () => {
    if (!showStartMenu) return null;

    return (
      <div className="window" style={{ 
        position: 'absolute', 
        bottom: '28px', 
        left: '0', 
        width: '200px', 
        zIndex: 1000,
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)'
      }}>
        <div className="title-bar" style={{ backgroundColor: '#000080', padding: '2px 5px' }}>
          <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'white', marginLeft: '5px' }}>{username}</span>
          </div>
        </div>
        <div className="window-body" style={{ padding: '2px 0' }}>
          <ul className="tree-view" style={{ width: '100%' }}>
            {startMenuItems.map(item => (
              <li key={item.id} onClick={item.action || (() => {})}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      backgroundColor: '#008080',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 桌面區域 */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        {/* 桌面圖標 */}
        {renderIcons()}
        
        {/* 系統應用程序窗口 */}
        {renderWindows()}
        
        {/* 開始菜單 */}
        {renderStartMenu()}
      </div>
      
      {/* 任務欄 */}
      <div className="status-bar" style={{ 
        height: '28px', 
        backgroundColor: '#c0c0c0', 
        borderTop: '1px solid #fff',
        display: 'flex',
        padding: 0
      }}>
        <button 
          className={showStartMenu ? 'active' : ''}
          onClick={() => setShowStartMenu(!showStartMenu)}
          style={{ 
            height: '22px', 
            margin: '2px 2px 2px 2px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          <img 
            src="/assets/win95-icons/windows-logo.png" 
            alt="Start" 
            style={{ width: '16px', height: '16px', marginRight: '4px' }}
          />
          開始
        </button>
        
        <div style={{ flex: 1 }}></div>
        
        <div className="status-bar-field">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default Desktop;