import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 移除 Window 的引入
import CameraCapture from '../components/CameraCapture';
import TrainingDemo from '../components/TrainingDemo';
// 移除 './AppWindow.css' 的引入

function AppWindow() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [windowTitle, setWindowTitle] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  
  // 根據appId設置窗口標題
  useEffect(() => {
    switch (appId) {
      case 'vision-app':
        setWindowTitle('機器視覺訓練系統 v1.0');
        break;
      case 'camera':
        setWindowTitle('攝像頭捕獲');
        break;
      default:
        setWindowTitle('未知應用');
    }
  }, [appId]);
  
  // 處理窗口關閉
  const handleClose = () => {
    navigate('/desktop');
  };
  
  // 處理窗口最大化/恢復
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };
  
  // 處理圖像捕獲
  const handleImageCapture = (imageSrc) => {
    const newCapturedImages = [...capturedImages, imageSrc];
    setCapturedImages(newCapturedImages);
    
    // 將圖像保存到localStorage (注意: 在實際應用中，這可能會很快超出存儲限制)
    localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
  };
  
  // 嘗試從localStorage加載已捕獲的圖像
  useEffect(() => {
    const storedImages = localStorage.getItem('capturedImages');
    if (storedImages) {
      try {
        const parsedImages = JSON.parse(storedImages);
        if (Array.isArray(parsedImages)) {
          setCapturedImages(parsedImages);
        }
      } catch (error) {
        console.error('無法解析存儲的圖像:', error);
      }
    }
  }, []);
  
  // 渲染應用內容
  const renderApp = () => {
    switch (appId) {
      case 'vision-app':
        return (
          <TrainingDemo 
            capturedImages={capturedImages} 
            onCaptureImage={() => navigate('/app/camera')}
          />
        );
      case 'camera':
        return (
          <CameraCapture 
            onCapture={handleImageCapture} 
            onBack={() => navigate('/app/vision-app')}
          />
        );
      default:
        return (
          <div className="window" style={{ width: '100%', height: '100%' }}>
            <div className="title-bar">
              <div className="title-bar-text">錯誤</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={handleClose}></button>
              </div>
            </div>
            <div className="window-body">
              <p>找不到應用程序</p>
              <button onClick={handleClose}>返回桌面</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#008080',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: isMaximized ? '100%' : '800px', 
        height: isMaximized ? '100%' : '600px',
        transition: 'width 0.2s, height 0.2s'
      }}>
        {renderApp()}
      </div>
    </div>
  );
}

export default AppWindow;