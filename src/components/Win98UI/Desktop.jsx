import React, { useState, useEffect } from 'react';
import './styles.css';
import Icon from './Icon';
import Window from './Window';

/**
 * Windows 98 風格桌面元件
 * 
 * @param {Object} props - 元件屬性
 * @param {Array} props.icons - 桌面圖標列表
 * @param {Array} props.windows - 窗口列表
 * @param {Function} props.onIconClick - 圖標點擊處理函數
 * @param {string} props.username - 使用者名稱，顯示在開始選單
 */
const Desktop = ({
  icons = [],
  windows = [],
  onIconClick,
  username = '使用者',
  children
}) => {
  const [activeWindows, setActiveWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 更新時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 每分鐘更新一次
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化時間為 HH:MM
  const formattedTime = currentTime.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
  
  // 設置窗口為活動狀態
  const activateWindow = (id) => {
    setActiveWindowId(id);
    setActiveWindows(prev => {
      // 將指定 id 窗口移動到陣列的末尾（最上層）
      const filtered = prev.filter(windowId => windowId !== id);
      return [...filtered, id];
    });
  };
  
  // 關閉窗口
  // 關閉窗口
    const closeWindow = (id) => {
        setActiveWindows(prev => prev.filter(windowId => windowId !== id));
        
        // 如果關閉的是當前活動窗口
        if (activeWindowId === id) {
        const newActiveWindows = activeWindows.filter(windowId => windowId !== id);
        if (newActiveWindows.length > 0) {
            // 還有其他窗口，將最上層窗口設為活動窗口
            setActiveWindowId(newActiveWindows[newActiveWindows.length - 1]);
        } else {
            // 沒有其他窗口了，設為 null
            setActiveWindowId(null);
        }
        }
    };
  
  // 切換開始選單
  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };
  
  // 關閉開始選單（當點擊桌面其他區域時）
  const closeStartMenu = () => {
    if (startMenuOpen) {
      setStartMenuOpen(false);
    }
  };

  return (
    <div className="win98-desktop" onClick={closeStartMenu}>
      {/* 桌面背景和圖標 */}
      <div className="win98-desktop-background">
        <div className="win98-desktop-icons">
          {icons.map((icon, index) => (
            <Icon
              key={`desktop-icon-${index}`}
              icon={icon.icon}
              label={icon.label}
              onClick={() => {
                onIconClick && onIconClick(icon);
                closeStartMenu();
              }}
            />
          ))}
        </div>
        
        {/* 渲染所有開啟的窗口 */}
        {windows.map((window) => (
          activeWindows.includes(window.id) && (
            <Window
              key={window.id}
              title={window.title}
              icon={window.icon}
              isActive={activeWindowId === window.id}
              onFocus={() => activateWindow(window.id)}
              onClose={() => closeWindow(window.id)}
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
        
        {/* 其他動態窗口 */}
        {children}
      </div>
      
      {/* 任務欄 */}
      <div className="win98-taskbar">
        {/* 開始按鈕 */}
        <button 
          className={`win98-start-button ${startMenuOpen ? 'win98-start-button--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleStartMenu();
          }}
        >
          <div className="win98-start-logo"></div>
          開始
        </button>
        
        {/* 任務欄按鈕 */}
        <div className="win98-taskbar-buttons">
          {windows.map((window) => (
            activeWindows.includes(window.id) && (
              <button
                key={`taskbar-${window.id}`}
                className={`win98-taskbar-button ${activeWindowId === window.id ? 'win98-taskbar-button--active' : ''}`}
                onClick={() => activateWindow(window.id)}
              >
                {window.icon && (
                  <span className="win98-taskbar-button-icon">
                    <img src={window.icon} alt="" />
                  </span>
                )}
                <span className="win98-taskbar-button-text">{window.title}</span>
              </button>
            )
          ))}
        </div>
        
        {/* 系統托盤 */}
        <div className="win98-system-tray">
          <div className="win98-system-time">{formattedTime}</div>
        </div>
      </div>
      
      {/* 開始選單 */}
      {startMenuOpen && (
        <div 
          className="win98-start-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="win98-start-menu-header">
            <div className="win98-start-menu-windows-logo"></div>
            <span className="win98-start-menu-username">{username}</span>
          </div>
          
          <div className="win98-start-menu-items">
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--programs"></div>
              <span>程式集</span>
              <div className="win98-start-menu-item-arrow"></div>
            </div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--documents"></div>
              <span>文件</span>
              <div className="win98-start-menu-item-arrow"></div>
            </div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--settings"></div>
              <span>設定</span>
              <div className="win98-start-menu-item-arrow"></div>
            </div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--find"></div>
              <span>尋找</span>
              <div className="win98-start-menu-item-arrow"></div>
            </div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--help"></div>
              <span>說明</span>
            </div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--run"></div>
              <span>執行...</span>
            </div>
            
            <div className="win98-start-menu-separator"></div>
            
            <div className="win98-start-menu-item">
              <div className="win98-start-menu-item-icon win98-start-menu-item-icon--shutdown"></div>
              <span>關機...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop;