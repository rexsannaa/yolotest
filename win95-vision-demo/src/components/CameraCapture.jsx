import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import './CameraCapture.css';

function CameraCapture({ onCapture, onBack }) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  
  // 處理相機就緒
  const handleUserMedia = () => {
    setIsCameraReady(true);
    setError(null);
  };
  
  // 處理相機錯誤
  const handleError = (err) => {
    console.error('相機存取錯誤:', err);
    setError('無法存取相機。請確保您已授予相機存取權限並重試。');
  };
  
  // 拍照
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);
  
  // 重新拍攝
  const retake = () => {
    setCapturedImage(null);
  };
  
  // 保存圖片
  const saveImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };
  
  // 返回上一頁
  const goBack = () => {
    if (onBack) {
      onBack();
    }
  };
  
  return (
    <div className="camera-capture-container">
      <div className="camera-header">
        <h2>相機捕獲</h2>
        <div className="camera-select-container">
          <label htmlFor="camera-select">選擇相機:</label>
          <select id="camera-select" className="win95-select">
            <option>預設相機</option>
          </select>
        </div>
      </div>
      
      <div className="camera-content">
        {error ? (
          <div className="camera-error">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <button 
              className="win95-button" 
              onClick={() => window.location.reload()}
            >
              重試
            </button>
          </div>
        ) : capturedImage ? (
          <div className="captured-image-container">
            <img 
              src={capturedImage} 
              alt="已捕獲的圖像" 
              className="captured-image" 
            />
            <div className="capture-info">
              已成功拍攝！請選擇保存或重新拍攝。
            </div>
          </div>
        ) : (
          <div className="webcam-container">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              onUserMedia={handleUserMedia}
              onUserMediaError={handleError}
              className="webcam"
            />
            {!isCameraReady && (
              <div className="loading-camera">
                正在啟動相機...
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="camera-controls">
        {capturedImage ? (
          <>
            <button className="win95-button" onClick={retake}>
              重新拍攝
            </button>
            <button 
              className="win95-button primary-button" 
              onClick={saveImage}
            >
              保存圖像
            </button>
          </>
        ) : (
          <>
            <button className="win95-button" onClick={goBack}>
              返回
            </button>
            <button 
              className="win95-button primary-button" 
              onClick={captureImage}
              disabled={!isCameraReady}
            >
              拍照
            </button>
          </>
        )}
      </div>
      
      <div className="camera-status-bar">
        <div className="status-item">
          {isCameraReady ? '相機就緒' : '正在初始化相機...'}
        </div>
        <div className="status-item">
          {capturedImage ? '圖像已捕獲' : '準備拍攝'}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;