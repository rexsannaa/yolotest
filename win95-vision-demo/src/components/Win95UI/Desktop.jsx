import React, { useState } from 'react';
import Toolbar from './Toolbar';
import Window from './Window';
import './Desktop.css';

function Desktop({ 
  username, 
  currentTime, 
  appIcons = [], 
  startMenuItems = [], 
  openWindows = [],
  onAppLaunch,
  onCloseWindow,
  onLogout
}) {
  const [activeWindow, setActiveWindow] = useState(null);
  
  // 處理圖標雙擊
  const handleIconDoubleClick = (app) => {
    if (onAppLaunch) {
      onAppLaunch(app.id);
    }
  };
  
  // 處理窗口點擊 (將窗口置於頂層)
  const handleWindowClick = (windowId) => {
    setActiveWindow(windowId);
  };
  
  // 渲染桌面圖標
  const renderIcons = () => {
    return (
      <div className="win95-desktop-icons">
        {appIcons.map((app) => (
          <div 
            key={app.id}
            className="win95-desktop-icon"
            onDoubleClick={() => handleIconDoubleClick(app)}
          >
            <div className={`win95-icon ${app.icon}`}></div>
            <div className="win95-icon-label">{app.name}</div>
          </div>
        ))}
      </div>
    );
  };
  
  // 渲染開啟的窗口
  const renderWindows = () => {
    // 模擬一些基本系統窗口內容
    const windowContent = {
      'my-computer': (
        <div className="system-window-content">
          <div className="folder-view">
            <div className="folder-title">我的電腦</div>
            <div className="folder-items">
              <div className="folder-item">
                <div className="folder-icon disk-icon"></div>
                <div className="folder-item-name">本機硬碟 (C:)</div>
              </div>
              <div className="folder-item">
                <div className="folder-icon cd-icon"></div>
                <div className="folder-item-name">CD-ROM 光碟機 (D:)</div>
              </div>
              <div className="folder-item">
                <div className="folder-icon network-icon"></div>
                <div className="folder-item-name">網路芳鄰</div>
              </div>
            </div>
          </div>
        </div>
      ),
      'recycle-bin': (
        <div className="system-window-content">
          <div className="empty-message">資源回收桶是空的</div>
        </div>
      ),
      'notepad': (
        <div className="system-window-content">
          <textarea className="notepad-content" placeholder="請輸入文字..."></textarea>
        </div>
      )
    };
    
    return openWindows.map((windowId) => (
      <Window
        key={windowId}
        title={appIcons.find(app => app.id === windowId)?.name || windowId}
        onClose={() => onCloseWindow(windowId)}
        onMinimize={() => {}}
        onMaximize={() => {}}
        className={activeWindow === windowId ? 'active-window' : ''}
        onClick={() => handleWindowClick(windowId)}
      >
        {windowContent[windowId] || <div>找不到窗口內容</div>}
      </Window>
    ));
  };
  
  return (
    <div className="win95-desktop">
      {renderIcons()}
      {renderWindows()}
      <Toolbar 
        currentTime={currentTime}
        username={username}
        startMenuItems={startMenuItems}
        onLogout={onLogout}
      />
    </div>
  );
}

export default Desktop;