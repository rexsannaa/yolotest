import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import Button from './Button';

/**
 * Windows 98 風格視窗元件
 * 
 * @param {Object} props - 元件屬性
 * @param {string} props.title - 視窗標題
 * @param {string} props.icon - 標題列圖標
 * @param {boolean} props.isActive - 視窗是否為活動狀態
 * @param {Function} props.onFocus - 當視窗獲得焦點時的回呼函數
 * @param {Function} props.onClose - 當視窗關閉時的回呼函數
 * @param {Object} props.initialPosition - 視窗初始位置 {x, y}
 * @param {Object} props.initialSize - 視窗初始大小 {width, height}
 * @param {boolean} props.resizable - 視窗是否可調整大小
 * @param {boolean} props.minimizable - 視窗是否可最小化
 * @param {boolean} props.maximizable - 視窗是否可最大化
 * @param {React.ReactNode} props.children - 視窗內容
 */
const Window = ({
  title = '視窗',
  icon,
  isActive = true,
  onFocus,
  onClose,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 400, height: 300 },
  resizable = true,
  minimizable = true,
  maximizable = true,
  children,
  ...restProps
}) => {
  // 視窗位置和大小狀態
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState(null);
  
  // 參考點，用於拖曳和調整大小的計算
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);
  
  // 視窗焦點處理
  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };
  
  // 開始拖曳視窗
  const startDrag = (e) => {
    if (isMaximized) return;
    
    e.preventDefault();
    
    // 計算拖曳偏移量
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDragging(true);
    handleFocus();
    
    // 添加全域滑鼠事件監聽
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  };
  
  // 處理視窗拖曳
  const handleDrag = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    
    // 避免視窗被拖出視窗範圍
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };
  
  // 停止拖曳
  const stopDrag = () => {
    setIsDragging(false);
    
    // 移除全域滑鼠事件監聽
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };
  
  // 開始調整視窗大小
  const startResize = (e, direction) => {
    if (isMaximized || !resizable) return;
    
    e.preventDefault();
    
    // 紀錄調整開始時的狀態
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    };
    
    setResizeDirection(direction);
    setIsResizing(true);
    handleFocus();
    
    // 添加全域滑鼠事件監聽
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };
  
  // 處理視窗大小調整
  const handleResize = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.current.x;
    const deltaY = e.clientY - resizeStart.current.y;
    
    const minWidth = 150;  // 最小寬度
    const minHeight = 100; // 最小高度
    
    let newWidth = resizeStart.current.width;
    let newHeight = resizeStart.current.height;
    let newX = resizeStart.current.posX;
    let newY = resizeStart.current.posY;
    
    // 根據調整方向計算新的大小和位置
    switch (resizeDirection) {
      case 'e':  // 右
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        break;
      case 's':  // 下
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        break;
      case 'se': // 右下
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        break;
      case 'w':  // 左
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        break;
      case 'n':  // 上
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      case 'sw': // 左下
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        break;
      case 'ne': // 右上
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      case 'nw': // 左上
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      default:
        break;
    }
    
    // 更新視窗大小和位置
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };
  
  // 停止調整大小
  const stopResize = () => {
    setIsResizing(false);
    setResizeDirection('');
    
    // 移除全域滑鼠事件監聽
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };
  
  // 最大化視窗
  const maximizeWindow = () => {
    if (!maximizable) return;
    
    if (!isMaximized) {
      // 保存當前狀態以便還原
      setPreviousState({
        position: { ...position },
        size: { ...size }
      });
      
      // 設定為最大化狀態
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 30  // 留出任務欄空間
      });
      setIsMaximized(true);
    } else {
      // 還原先前的狀態
      if (previousState) {
        setPosition(previousState.position);
        setSize(previousState.size);
      }
      setIsMaximized(false);
    }
  };
  
  // 視窗大小變化時，調整最大化的視窗大小
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight - 30
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);
  
  // 視窗樣式
  const windowStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: isActive ? 100 : 10
  };
  
  // 視窗類名
  const windowClasses = [
    'win98-window',
    isActive ? 'win98-window--active' : '',
    isMaximized ? 'win98-window--maximized' : '',
    !resizable ? 'win98-window--fixed' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div
      ref={windowRef}
      className={windowClasses}
      style={windowStyle}
      onClick={handleFocus}
      {...restProps}
    >
      {/* 視窗標題列 */}
      <div 
        className={`win98-window-titlebar ${isActive ? 'win98-window-titlebar--active' : ''}`}
        onMouseDown={startDrag}
        onDoubleClick={maximizeWindow}
      >
        {icon && (
          <div className="win98-window-icon">
            <img src={icon} alt="" />
          </div>
        )}
        <div className="win98-window-title">{title}</div>
        <div className="win98-window-controls">
          {minimizable && (
            <button className="win98-window-control win98-window-control--minimize">
              <span></span>
            </button>
          )}
          {maximizable && (
            <button 
              className="win98-window-control win98-window-control--maximize"
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow();
              }}
            >
              <span></span>
            </button>
          )}
          <button 
            className="win98-window-control win98-window-control--close"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
          >
            <span></span>
          </button>
        </div>
      </div>
      
      {/* 視窗內容區 */}
      <div className="win98-window-content">
        {children}
      </div>
      
      {/* 調整大小的控制點 */}
      {resizable && !isMaximized && (
        <>
          <div 
            className="win98-window-resize win98-window-resize--n" 
            onMouseDown={(e) => startResize(e, 'n')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--e" 
            onMouseDown={(e) => startResize(e, 'e')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--s" 
            onMouseDown={(e) => startResize(e, 's')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--w" 
            onMouseDown={(e) => startResize(e, 'w')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--ne" 
            onMouseDown={(e) => startResize(e, 'ne')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--se" 
            onMouseDown={(e) => startResize(e, 'se')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--sw" 
            onMouseDown={(e) => startResize(e, 'sw')}
          ></div>
          <div 
            className="win98-window-resize win98-window-resize--nw" 
            onMouseDown={(e) => startResize(e, 'nw')}
          ></div>
        </>
      )}
    </div>
  );
};

export default Window;