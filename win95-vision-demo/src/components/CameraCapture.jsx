import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './CameraCapture.css';

function CameraCapture({ onCapture, onBack }) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 獲取可用攝像頭列表
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        } else {
          setErrorMessage('未檢測到攝像頭設備');
        }
      } catch (error) {
        console.error('無法獲取攝像頭列表:', error);
        setErrorMessage('無法訪問攝像頭設備');
      }
    };
    
    getCameras();
  }, []);

  // 處理攝像頭切換
  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
    setIsCameraReady(false);
    setCapturedImage(null);
  };

  // 處理攝像頭就緒
  const handleCameraReady = () => {
    setIsCameraReady(true);
    setErrorMessage('');
  };

  // 處理攝像頭錯誤
  const handleCameraError = (error) => {
    console.error('攝像頭錯誤:', error);
    setErrorMessage('無法啟動攝像頭。請確保已授予權限並且攝像頭未被其他程序使用。');
    setIsCameraReady(false);
  };

  // 捕獲圖像
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  // 重新拍攝
  const retake = () => {
    setCapturedImage(null);
  };

  // 保存圖像
  const saveImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      // 返回上一個頁面或清除捕獲的圖像
      setCapturedImage(null);
    }
  };

  // 視頻預設
  const videoConstraints = {
    deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
    width: 640,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="camera-capture-container">
      <div className="camera-header">
        <button className="win95-button" onClick={onBack}>
          返回
        </button>
        <h2>攝像頭捕獲</h2>
        <div className="camera-select-container">
          <label>選擇攝像頭:</label>
          <select 
            className="win95-select"
            value={selectedCamera}
            onChange={handleCameraChange}
            disabled={cameras.length === 0}
          >
            {cameras.length === 0 && (
              <option value="">無可用攝像頭</option>
            )}
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                攝像頭 {index + 1} {camera.label ? `(${camera.label})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="camera-content">
        {errorMessage ? (
          <div className="camera-error">
            <div className="error-icon">!</div>
            <p>{errorMessage}</p>
          </div>
        ) : capturedImage ? (
          <div className="captured-image-container">
            <img
              src={capturedImage}
              alt="已捕獲圖像"
              className="captured-image"
            />
            <div className="capture-info">
              <p>圖像已捕獲！</p>
            </div>
          </div>
        ) : (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleCameraReady}
              onUserMediaError={handleCameraError}
              className="webcam"
            />
            {!isCameraReady && (
              <div className="loading-camera">
                <p>正在啟動攝像頭...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="camera-controls">
        {capturedImage ? (
          <>
            <button 
              className="win95-button" 
              onClick={retake}
            >
              重新拍攝
            </button>
            <button 
              className="win95-button primary-button" 
              onClick={saveImage}
            >
              使用此圖像
            </button>
          </>
        ) : (
          <button 
            className="win95-button primary-button" 
            onClick={capture}
            disabled={!isCameraReady}
          >
            拍照
          </button>
        )}
      </div>

      <div className="camera-status-bar">
        <div className="status-item">
          {isCameraReady ? '攝像頭已就緒' : '等待攝像頭...'}
        </div>
        <div className="status-item">
          分辨率: 640 x 480
        </div>
        <div className="status-item">
          格式: JPEG
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;