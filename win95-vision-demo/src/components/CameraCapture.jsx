import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
// 移除 './CameraCapture.css' 的引入，使用98.css的樣式

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
    <div className="window" style={{ width: '100%', height: '100%' }}>
      <div className="title-bar">
        <div className="title-bar-text">相機捕獲</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      
      <div className="window-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)', padding: 0 }}>
        <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #888' }}>
          <h3 style={{ margin: 0 }}>相機捕獲</h3>
          <div className="field-row">
            <label htmlFor="camera-select">選擇相機:</label>
            <select id="camera-select">
              <option>預設相機</option>
            </select>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', backgroundColor: '#c0c0c0' }}>
          {error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', color: 'white', fontSize: '24px', fontWeight: 'bold', borderRadius: '50%', marginBottom: '10px' }}>
                !
              </div>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                重試
              </button>
            </div>
          ) : capturedImage ? (
            <div style={{ position: 'relative', width: '640px', height: '480px', border: '2px solid #888', overflow: 'hidden', backgroundColor: 'white' }}>
              <img 
                src={capturedImage} 
                alt="已捕獲的圖像" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '8px', textAlign: 'center' }}>
                已成功拍攝！請選擇保存或重新拍攝。
              </div>
            </div>
          ) : (
            <div className="sunken-panel" style={{ position: 'relative', width: '640px', height: '480px', overflow: 'hidden' }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                onUserMedia={handleUserMedia}
                onUserMediaError={handleError}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!isCameraReady && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', fontSize: '14px' }}>
                  正在啟動相機...
                </div>
              )}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '16px' }}>
          {capturedImage ? (
            <>
              <button onClick={retake}>
                重新拍攝
              </button>
              <button onClick={saveImage}>
                保存圖像
              </button>
            </>
          ) : (
            <>
              <button onClick={goBack}>
                返回
              </button>
              <button
                onClick={captureImage}
                disabled={!isCameraReady}
              >
                拍照
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="status-bar">
        <div className="status-bar-field">
          {isCameraReady ? '相機就緒' : '正在初始化相機...'}
        </div>
        <div className="status-bar-field">
          {capturedImage ? '圖像已捕獲' : '準備拍攝'}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;