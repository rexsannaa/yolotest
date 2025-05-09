import React, { useState, useRef, useEffect } from 'react';
import './Window.css';

function Window({ 
  title, 
  children, 
  onClose, 
  onMinimize, 
  onMaximize, 
  isMaximized = false,
  className = ""
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);
  
  // 處理拖動開始
  const handleDragStart = (e) => {
    if (isMaximized) return;
    
    // 計算點擊位置相對於視窗左上角的偏移
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
  };
  
  // 處理拖動
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);
  
  return (
    <div 
      className={`win95-window ${isMaximized ? 'maximized' : ''} ${className}`}
      ref={windowRef}
      style={isMaximized ? {} : { left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div 
        className="win95-window-title-bar"
        onMouseDown={handleDragStart}
      >
        <div className="win95-window-title">{title}</div>
        <div className="win95-window-controls">
          <button 
            className="win95-window-control minimize"
            onClick={onMinimize}
            aria-label="最小化"
          >
            <span>_</span>
          </button>
          <button 
            className="win95-window-control maximize"
            onClick={onMaximize}
            aria-label={isMaximized ? "還原" : "最大化"}
          >
            <span>{isMaximized ? '❐' : '□'}</span>
          </button>
          <button 
            className="win95-window-control close"
            onClick={onClose}
            aria-label="關閉"
          >
            <span>×</span>
          </button>
        </div>
      </div>
      <div className="win95-window-content">
        {children}
      </div>
    </div>
  );
}

export default Window;