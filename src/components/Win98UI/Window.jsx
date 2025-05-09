import React, { useState, useRef, useEffect } from 'react';

/**
 * Windows 98 style Window component
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Window ID
 * @param {string} props.title - Window title
 * @param {string} props.icon - Title bar icon
 * @param {boolean} props.isActive - Whether window is active
 * @param {Function} props.onActivate - Callback when window is activated
 * @param {Function} props.onClose - Callback when window is closed
 * @param {Object} props.initialPosition - Initial window position {x, y}
 * @param {Object} props.initialSize - Initial window size {width, height}
 * @param {boolean} props.resizable - Whether window is resizable
 * @param {boolean} props.minimizable - Whether window can be minimized
 * @param {boolean} props.maximizable - Whether window can be maximized
 * @param {React.ReactNode} props.children - Window content
 */
const Window = ({
  id,
  title = 'Window',
  icon,
  isActive = true,
  onActivate,
  onClose,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 400, height: 300 },
  resizable = true,
  minimizable = true,
  maximizable = true,
  children
}) => {
  // Window position and size state
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState(null);
  
  // Reference points for drag and resize calculations
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);
  
  // Handle window activation
  const handleActivate = () => {
    if (onActivate && !isActive) {
      onActivate();
    }
  };
  
  // Start dragging window
  const startDrag = (e) => {
    if (isMaximized) return;
    
    e.preventDefault();
    
    // Calculate drag offset
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDragging(true);
    handleActivate();
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  };
  
  // Handle window dragging
  const handleDrag = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    
    // Prevent dragging window out of viewport
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height - 28; // Account for taskbar
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };
  
  // Stop dragging
  const stopDrag = () => {
    setIsDragging(false);
    
    // Remove global mouse event listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  };
  
  // Start resizing window
  const startResize = (e, direction) => {
    if (isMaximized || !resizable) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Record state at start of resize
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
    handleActivate();
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };
  
  // Handle window resizing
  const handleResize = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.current.x;
    const deltaY = e.clientY - resizeStart.current.y;
    
    const minWidth = 200;  // Minimum width
    const minHeight = 150; // Minimum height
    
    let newWidth = resizeStart.current.width;
    let newHeight = resizeStart.current.height;
    let newX = resizeStart.current.posX;
    let newY = resizeStart.current.posY;
    
    // Calculate new size and position based on resize direction
    switch (resizeDirection) {
      case 'e':  // Right
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        break;
      case 's':  // Bottom
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        break;
      case 'se': // Bottom-right
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        break;
      case 'w':  // Left
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        break;
      case 'n':  // Top
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      case 'sw': // Bottom-left
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        break;
      case 'ne': // Top-right
        newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      case 'nw': // Top-left
        newWidth = Math.max(minWidth, resizeStart.current.width - deltaX);
        newHeight = Math.max(minHeight, resizeStart.current.height - deltaY);
        newX = resizeStart.current.posX + resizeStart.current.width - newWidth;
        newY = resizeStart.current.posY + resizeStart.current.height - newHeight;
        break;
      default:
        break;
    }
    
    // Constrain to viewport
    const maxX = window.innerWidth - newWidth;
    const maxY = window.innerHeight - newHeight - 28; // Account for taskbar
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Update window size and position
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };
  
  // Stop resizing
  const stopResize = () => {
    setIsResizing(false);
    setResizeDirection('');
    
    // Remove global mouse event listeners
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };
  
  // Maximize window
  const maximizeWindow = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!maximizable) return;
    
    if (!isMaximized) {
      // Save current state for later restoration
      setPreviousState({
        position: { ...position },
        size: { ...size }
      });
      
      // Set to maximized state
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 28  // Account for taskbar
      });
      setIsMaximized(true);
    } else {
      // Restore previous state
      if (previousState) {
        setPosition(previousState.position);
        setSize(previousState.size);
      }
      setIsMaximized(false);
    }
  };
  
  // When window size changes, adjust maximized window size
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight - 28
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);
  
  // Window style
  const windowStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: isActive ? 100 : 10
  };
  
  return (
    <div
      ref={windowRef}
      className={`window${isActive ? ' window-active' : ''}`}
      style={windowStyle}
      onClick={handleActivate}
    >
      {/* Window title bar */}
      <div 
        className="title-bar"
        onMouseDown={startDrag}
        onDoubleClick={maximizeWindow}
      >
        <div className="title-bar-text">
          {icon && (
            <img 
              src={icon} 
              alt="" 
              style={{ width: '16px', height: '16px', marginRight: '4px', verticalAlign: 'text-bottom' }}
            />
          )}
          {title}
        </div>
        <div className="title-bar-controls">
          {minimizable && (
            <button aria-label="Minimize"></button>
          )}
          {maximizable && (
            <button 
              aria-label="Maximize"
              onClick={maximizeWindow}
            ></button>
          )}
          <button 
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
          ></button>
        </div>
      </div>
      
      {/* Window content */}
      <div className="window-body" style={{ position: 'relative', height: 'calc(100% - 28px)', overflow: 'auto' }}>
        {children}
      </div>
      
      {/* Resize handles */}
      {resizable && !isMaximized && (
        <>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', cursor: 'n-resize' }} 
            onMouseDown={(e) => startResize(e, 'n')}
          ></div>
          <div 
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '4px', cursor: 'e-resize' }} 
            onMouseDown={(e) => startResize(e, 'e')}
          ></div>
          <div 
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', cursor: 's-resize' }} 
            onMouseDown={(e) => startResize(e, 's')}
          ></div>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', cursor: 'w-resize' }} 
            onMouseDown={(e) => startResize(e, 'w')}
          ></div>
          <div 
            style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', cursor: 'ne-resize' }} 
            onMouseDown={(e) => startResize(e, 'ne')}
          ></div>
          <div 
            style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', cursor: 'se-resize' }} 
            onMouseDown={(e) => startResize(e, 'se')}
          ></div>
          <div 
            style={{ position: 'absolute', bottom: 0, left: 0, width: '8px', height: '8px', cursor: 'sw-resize' }} 
            onMouseDown={(e) => startResize(e, 'sw')}
          ></div>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', cursor: 'nw-resize' }} 
            onMouseDown={(e) => startResize(e, 'nw')}
          ></div>
        </>
      )}
    </div>
  );
};

export default Window;