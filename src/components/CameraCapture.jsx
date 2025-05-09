import React, { useState, useRef, useEffect } from 'react';
import Button from './Win98UI/Button';
import '../components/Win98UI/styles.css';

/**
 * Windows 98 風格相機拍照元件
 * 
 * @param {Object} props - 元件屬性
 * @param {Function} props.onCapture - 拍照完成後的回調函數，接收拍攝圖像的 base64 數據
 * @param {Function} props.onCancel - 取消拍照的回調函數
 * @param {number} props.width - 相機視窗寬度
 * @param {number} props.height - 相機視窗高度
 */
const CameraCapture = ({
  onCapture,
  onCancel,
  width = 640,
  height = 480
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('pending'); // 'pending', 'granted', 'denied'

  // 當元件載入時啟動相機
  useEffect(() => {
    startCamera();
    
    // 元件卸載時清理資源
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 啟動相機函數
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: width },
          height: { ideal: height }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setCameraReady(true);
      setCameraPermission('granted');
      setError(null);
    } catch (err) {
      console.error('相機啟動失敗:', err);
      setError('無法啟動相機，請確認您已授予相機存取權限。');
      setCameraPermission('denied');
      setCameraReady(false);
    }
  };

  // 拍照函數
  const captureImage = () => {
    if (!cameraReady) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      
      // 設定 canvas 大小與視訊源相同
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 繪製當前視訊幀到 canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 獲取圖像數據
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  // 確認使用拍攝的圖像
  const confirmImage = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };

  // 重新拍照
  const retakeImage = () => {
    setCapturedImage(null);
  };

  // 取消拍照
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // 重試啟動相機
  const retryCamera = () => {
    startCamera();
  };

  return (
    <div className="win98-camera-capture">
      <div className="win98-camera-container" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* 相機預覽 */}
        {!capturedImage && cameraReady && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onCanPlay={() => setCameraReady(true)}
          />
        )}
        
        {/* 拍攝的照片 */}
        {capturedImage && (
          <img 
            src={capturedImage} 
            alt="已拍攝的照片" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        )}
        
        {/* 錯誤訊息顯示 */}
        {error && (
          <div className="win98-error-message" style={{ padding: '20px', textAlign: 'center' }}>
            <p>{error}</p>
            <Button onClick={retryCamera}>重試</Button>
          </div>
        )}
        
        {/* 隱藏的 canvas 用於處理圖像 */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      {/* 操作按鈕 */}
      <div className="win98-camera-controls" style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {!capturedImage && cameraReady && (
          <>
            <Button onClick={captureImage}>拍照</Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        )}
        
        {capturedImage && (
          <>
            <Button onClick={confirmImage}>使用此照片</Button>
            <Button onClick={retakeImage}>重新拍攝</Button>
            <Button onClick={handleCancel}>取消</Button>
          </>
        )}
      </div>
    </div>
  );
};

// 添加 CSS 樣式
const styles = `
  .win98-camera-capture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .win98-camera-container {
    background-color: #000;
    border: 2px solid #c0c0c0;
    box-shadow: 
      inset -1px -1px 0 0 #000,
      inset 1px 1px 0 0 #fff,
      inset -2px -2px 0 0 #808080,
      inset 2px 2px 0 0 #dfdfdf;
    overflow: hidden;
    position: relative;
  }
  
  .win98-error-message {
    color: #000;
    background-color: #c0c0c0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }
`;

// 使用 useEffect 管理樣式
const CameraCaptureWithStyles = (props) => {
    useEffect(() => {
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
      
      return () => {
        if (document.head.contains(styleSheet)) {
          document.head.removeChild(styleSheet);
        }
      };
    }, []);
  
    return <CameraCapture {...props} />;
  };
  
  export default CameraCaptureWithStyles;