import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Win95Desktop from '../components/Win95UI/Desktop';
import './Desktop.css';

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
    { id: 'programs', label: '程式集', subitems: [] },
    { id: 'documents', label: '文件', subitems: [] },
    { id: 'settings', label: '設定', subitems: [] },
    { id: 'find', label: '搜尋', subitems: [] },
    { id: 'help', label: '說明', subitems: [] },
    { id: 'run', label: '執行...', subitems: [] },
    { id: 'shutdown', label: '關機...', action: handleLogout }
  ];
  
  return (
    <Win95Desktop
      username={username}
      currentTime={currentTime}
      appIcons={appIcons}
      startMenuItems={startMenuItems}
      openWindows={openWindows}
      onAppLaunch={handleAppLaunch}
      onCloseWindow={handleCloseWindow}
      onLogout={handleLogout}
    />
  );
}

export default Desktop;