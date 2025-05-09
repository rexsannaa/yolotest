import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Window from '../components/Win95UI/Window';
import CameraCapture from '../components/CameraCapture';
import TrainingDemo from '../components/TrainingDemo';
import './AppWindow.css';

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
  
  // 渲染應用內容
  const renderAppContent = () => {
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
        return <div className="app-not-found">找不到應用程序</div>;
    }
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
  
  return (
    <div className="app-window-container">
      <Window
        title={windowTitle}
        isMaximized={isMaximized}
        onClose={handleClose}
        onMinimize={() => {}}
        onMaximize={handleMaximize}
        className={`app-window ${isMaximized ? 'maximized' : ''}`}
      >
        <div className="app-content">
          {renderAppContent()}
        </div>
      </Window>
    </div>
  );
}

export default AppWindow;