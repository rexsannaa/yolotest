import React, { useState } from 'react';
import './Toolbar.css';

function Toolbar({ currentTime, username, startMenuItems = [], onLogout }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // 切換開始菜單
  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };
  
  // 處理開始菜單項目點擊
  const handleMenuItemClick = (item) => {
    setIsStartMenuOpen(false);
    
    if (item.action) {
      item.action();
    }
  };
  
  // 渲染開始菜單
  const renderStartMenu = () => {
    if (!isStartMenuOpen) return null;
    
    return (
      <div className="win95-start-menu">
        <div className="win95-start-menu-header">
          <div className="win95-start-menu-logo">
            <div className="logo-grid">
              <div className="logo-square red"></div>
              <div className="logo-square green"></div>
              <div className="logo-square blue"></div>
              <div className="logo-square yellow"></div>
            </div>
            <span>Windows 95</span>
          </div>
        </div>
        <div className="win95-start-menu-items">
          {startMenuItems.map((item, index) => (
            <div 
              key={item.id}
              className="win95-start-menu-item"
              onClick={() => handleMenuItemClick(item)}
            >
              <div className="win95-start-menu-item-icon">
                {/* 此處可添加圖標 */}
              </div>
              <div className="win95-start-menu-item-label">{item.label}</div>
              {item.subitems && item.subitems.length > 0 && (
                <div className="win95-start-menu-item-arrow">►</div>
              )}
            </div>
          ))}
          <div className="win95-start-menu-divider"></div>
          <div 
            className="win95-start-menu-item"
            onClick={onLogout}
          >
            <div className="win95-start-menu-item-icon shutdown-icon"></div>
            <div className="win95-start-menu-item-label">關機...</div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="win95-toolbar">
      <div className="win95-toolbar-left">
        <button 
          className={`win95-start-button ${isStartMenuOpen ? 'active' : ''}`} 
          onClick={toggleStartMenu}
        >
          <div className="win95-logo-small"></div>
          <span>開始</span>
        </button>
        
        {renderStartMenu()}
      </div>
      
      <div className="win95-toolbar-right">
        <div className="win95-toolbar-time">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;