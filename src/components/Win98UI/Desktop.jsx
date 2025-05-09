import React, { useState, useEffect } from 'react';
import Window from './Window';

/**
 * Windows 98 style Desktop component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.icons - Desktop icons list
 * @param {Array} props.windows - Windows configuration
 * @param {Function} props.onIconClick - Icon click handler
 * @param {Array} props.activeWindows - List of active window IDs
 * @param {string} props.activeWindowId - Currently active window ID
 * @param {Function} props.onWindowActivate - Window activation handler
 * @param {Function} props.onWindowClose - Window close handler
 * @param {string} props.username - Username to display in start menu
 */
const Desktop = ({
  icons = [],
  windows = [],
  onIconClick,
  activeWindows = [],
  activeWindowId,
  onWindowActivate,
  onWindowClose,
  username = '使用者'
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedIcon, setSelectedIcon] = useState(null);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
  
  // Toggle start menu
  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };
  
  // Close start menu when clicking elsewhere
  const closeStartMenu = () => {
    if (startMenuOpen) {
      setStartMenuOpen(false);
    }
  };

  // Handle desktop icon click
  const handleIconClick = (icon, index) => {
    // Select the icon (visual feedback)
    setSelectedIcon(index);
    
    // Handle icon action
    if (onIconClick) {
      onIconClick(icon);
    }
    
    // Close start menu if open
    closeStartMenu();
  };
  
  // Handle desktop icon double click (same as click for this demo)
  const handleIconDoubleClick = (icon) => {
    if (onIconClick) {
      onIconClick(icon);
    }
    closeStartMenu();
  };
  
  // Handle desktop click (clear selection)
  const handleDesktopClick = (e) => {
    // Only clear if clicking directly on the desktop
    if (e.target.className === 'desktop' || e.target.className.includes('desktop-background')) {
      setSelectedIcon(null);
      closeStartMenu();
    }
  };

  return (
    <div className="win98-app-container" onClick={closeStartMenu}>
      {/* Desktop background with icons */}
      <div className="desktop" onClick={handleDesktopClick}>
        <div className="desktop-background"></div>
        <div className="desktop-icons">
          {icons.map((icon, index) => (
            <div 
              key={`desktop-icon-${index}`}
              className={`desktop-icon ${selectedIcon === index ? 'desktop-icon-selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleIconClick(icon, index);
              }}
              onDoubleClick={() => handleIconDoubleClick(icon)}
            >
              <img src={icon.icon} alt="" />
              <div className="icon-label">{icon.label}</div>
            </div>
          ))}
        </div>
        
        {/* Render all active windows */}
        {windows.map((window) => (
          activeWindows.includes(window.id) && (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              icon={window.icon}
              isActive={activeWindowId === window.id}
              onActivate={() => onWindowActivate(window.id)}
              onClose={() => onWindowClose(window.id)}
              initialPosition={window.position}
              initialSize={window.size}
              resizable={window.resizable}
              minimizable={window.minimizable}
              maximizable={window.maximizable}
            >
              {window.content}
            </Window>
          )
        ))}
      </div>
      
      {/* Taskbar */}
      <div className="taskbar">
        {/* Start button */}
        <button 
          className={`start-button${startMenuOpen ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
        >
          <div className="start-logo"></div>
          開始
        </button>
        
        {/* Taskbar buttons */}
        <div className="taskbar-buttons">
          {windows.map((window) => (
            activeWindows.includes(window.id) && (
              <button
                key={`taskbar-${window.id}`}
                className={`taskbar-button${activeWindowId === window.id ? ' taskbar-button--active' : ''}`}
                onClick={() => onWindowActivate(window.id)}
              >
                {window.icon && (
                  <img src={window.icon} alt="" />
                )}
                <span>{window.title}</span>
              </button>
            )
          ))}
        </div>
        
        {/* System tray */}
        <div className="system-tray">
          <div className="system-time">{formattedTime}</div>
        </div>
      </div>
      
      {/* Start menu */}
      {startMenuOpen && (
        <div 
          className="start-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="start-menu-header">
            <div className="start-menu-windows-logo"></div>
            <span>{username}</span>
          </div>
          
          <div className="start-menu-items">
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/programs.png)' }}></div>
              <span>程式集</span>
              <div className="start-menu-item-arrow"></div>
            </div>
            
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/documents.png)' }}></div>
              <span>文件</span>
              <div className="start-menu-item-arrow"></div>
            </div>
            
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/settings.png)' }}></div>
              <span>設定</span>
              <div className="start-menu-item-arrow"></div>
            </div>
            
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/find.png)' }}></div>
              <span>尋找</span>
              <div className="start-menu-item-arrow"></div>
            </div>
            
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/help.png)' }}></div>
              <span>說明</span>
            </div>
            
            <div className="start-menu-item">
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/run.png)' }}></div>
              <span>執行...</span>
            </div>
            
            <div className="start-menu-separator"></div>
            
            <div className="start-menu-item" onClick={() => onIconClick({ id: 'logout' })}>
              <div className="start-menu-item-icon" style={{ backgroundImage: 'url(/icons/shutdown.png)' }}></div>
              <span>登出...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop;