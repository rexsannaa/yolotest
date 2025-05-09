import React, { useState, useEffect } from 'react';
import Window from './Window';

/**
 * Windows 98 style Desktop component
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

  // 每分鐘更新時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };

  const closeStartMenu = () => {
    if (startMenuOpen) {
      setStartMenuOpen(false);
    }
  };

  const handleIconClick = (icon, index) => {
    setSelectedIcon(index);
    if (onIconClick) onIconClick(icon);
    closeStartMenu();
  };

  const handleIconDoubleClick = (icon) => {
    if (onIconClick) onIconClick(icon);
    closeStartMenu();
  };

  const handleDesktopClick = (e) => {
    if (
      e.target.className === 'desktop' ||
      e.target.className.includes('win98-desktop-background')
    ) {
      setSelectedIcon(null);
      closeStartMenu();
    }
  };

  return (
    <div className="win98-app-container" onClick={closeStartMenu}>
      {/* 桌面區域 */}
      <div className="desktop" onClick={handleDesktopClick}>
        <div className="win98-desktop-background"></div>

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

        {/* 開啟的視窗 */}
        {windows.map((window) =>
          activeWindows.includes(window.id) ? (
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
          ) : null
        )}
      </div>

      {/* 工作列 */}
      <div className="taskbar">
        <button
          className={`start-button${startMenuOpen ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
        >
          開始
        </button>

        <div className="taskbar-buttons">
          {windows.map((window) =>
            activeWindows.includes(window.id) ? (
              <button
                key={`taskbar-${window.id}`}
                className={`taskbar-button${activeWindowId === window.id ? ' taskbar-button--active' : ''}`}
                onClick={() => onWindowActivate(window.id)}
              >
                {window.icon && <img src={window.icon} alt="" />}
                <span>{window.title}</span>
              </button>
            ) : null
          )}
        </div>

        <div className="system-tray">
          <div className="system-time">{formattedTime}</div>
        </div>
      </div>

      {/* 開始選單 */}
      {startMenuOpen && (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-header">
            <span>{username}</span>
          </div>
          <div className="start-menu-items">
            <div className="start-menu-item" onClick={() => onIconClick({ id: 'logout' })}>
              <div className="start-menu-item-icon"></div>
              <span>登出...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop;
