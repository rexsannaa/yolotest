import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

/**
 * Camera capture component with Windows 98 styling
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onCapture - Callback when photo is captured
 * @param {Function} props.onCancel - Callback when capture is cancelled
 * @param {number} props.width - Camera container width
 * @param {number} props.height - Camera container height
 */
const CameraCapture = ({
  onCapture,
  onCancel,
  width = 640,
  height = 480
}) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('pending'); // 'pending', 'granted', 'denied'

  // Handle camera errors
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission('granted');
      } catch (err) {
        console.error('Camera permission error:', err);
        setCameraPermission('denied');
        setError('無法啟動相機，請確認您已授予相機存取權限。');
      }
    };

    checkPermissions();
  }, []);

  // Capture photo
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  // Confirm captured image
  const confirmImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };

  // Retake photo
  const retakeImage = () => {
    setCapturedImage(null);
  };

  // Cancel capture
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Retry camera permission
  const retryCamera = () => {
    setCameraPermission('pending');
    setError(null);
  };

  return (
    <div className="camera-capture">
      <div 
        className="camera-container window"
        style={{ width: `${width}px`, height: `${height}px`, overflow: 'hidden' }}
      >
        <div className="title-bar">
          <div className="title-bar-text">相機</div>
        </div>
        <div className="window-body" style={{ padding: 0, height: 'calc(100% - 28px)', background: '#000' }}>
          {/* Camera preview */}
          {!capturedImage && cameraPermission === 'granted' && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: width,
                height: height - 28,
                facingMode: "user"
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          
          {/* Captured photo */}
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="已拍攝的照片" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          )}
          
          {/* Error message */}
          {error && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'white', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <p>{error}</p>
              <button onClick={retryCamera}>重試</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="camera-controls">
        {!capturedImage && cameraPermission === 'granted' && (
          <>
            <button onClick={captureImage}>拍照</button>
            <button onClick={handleCancel}>取消</button>
          </>
        )}
        
        {capturedImage && (
          <>
            <button onClick={confirmImage}>使用此照片</button>
            <button onClick={retakeImage}>重新拍攝</button>
            <button onClick={handleCancel}>取消</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;