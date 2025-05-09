import React, { useState, useEffect, useRef } from 'react';
import CameraCapture from './CameraCapture';

/**
 * Machine Vision Training Demo Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Close callback function
 */
const TrainingDemo = ({ onClose }) => {
  // State management
  const [stage, setStage] = useState('intro'); // intro, capture, preprocess, augment, train, complete
  const [capturedImages, setCapturedImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [currentAugmentation, setCurrentAugmentation] = useState(null);
  const canvasRef = useRef(null);
  const augmentationCanvasRef = useRef(null);
  const trainIntervalRef = useRef(null);
  const augmentationTimeoutRef = useRef(null);
  
  // Simulated augmentation types
  const augmentationTypes = [
    { name: '原始圖像', function: (ctx, canvas) => {} },
    { name: '水平翻轉', function: (ctx, canvas) => {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
    }},
    { name: '旋轉', function: (ctx, canvas) => {
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(Math.PI/6); // 30 degrees
      ctx.translate(-canvas.width/2, -canvas.height/2);
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
    }},
    { name: '亮度調整', function: (ctx, canvas) => {
      ctx.filter = 'brightness(120%)';
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    }},
    { name: '對比度調整', function: (ctx, canvas) => {
      ctx.filter = 'contrast(120%)';
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    }},
    { name: '模糊效果', function: (ctx, canvas) => {
      ctx.filter = 'blur(2px)';
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    }}
  ];

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (trainIntervalRef.current) {
        clearInterval(trainIntervalRef.current);
      }
      if (augmentationTimeoutRef.current) {
        clearTimeout(augmentationTimeoutRef.current);
      }
    };
  }, []);

  // Handle photo capture
  const handleCapture = (imageData) => {
    setCapturedImages([...capturedImages, imageData]);
    setShowCamera(false);
    
    // If at least 3 photos are taken, automatically proceed to preprocessing
    if (capturedImages.length >= 2) {
      setStage('preprocess');
    }
  };

  // Handle camera cancel
  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  // Start capture
  const startCapture = () => {
    setShowCamera(true);
  };

  // Start preprocessing
  const startPreprocessing = () => {
    setStage('preprocess');
    
    // Simulate brief preprocessing
    setTimeout(() => {
      setStage('augment');
      simulateAugmentation();
    }, 2000);
  };

  // Simulate data augmentation process
  const simulateAugmentation = () => {
    let currentIndex = 0;
    
    const showNextAugmentation = () => {
      if (currentIndex < augmentationTypes.length) {
        setCurrentAugmentation(augmentationTypes[currentIndex]);
        currentIndex++;
        
        // Schedule next augmentation display
        augmentationTimeoutRef.current = setTimeout(showNextAugmentation, 1500);
      } else {
        // After augmentation demo, proceed to training
        setStage('train');
        startTraining();
      }
    };
    
    showNextAugmentation();
  };

  // Start training
  const startTraining = () => {
    setTrainProgress(0);
    
    // Simulate gradually increasing training progress
    trainIntervalRef.current = setInterval(() => {
      setTrainProgress(prev => {
        const increment = Math.random() * 5; // Random increment
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(trainIntervalRef.current);
          setTrainProgress(100);
          
          // Slight delay to show 100% completion
          setTimeout(() => {
            setStage('complete');
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  // Restart the entire process
  const restart = () => {
    setCapturedImages([]);
    setStage('intro');
    setTrainProgress(0);
    setCurrentAugmentation(null);
    
    if (trainIntervalRef.current) {
      clearInterval(trainIntervalRef.current);
    }
    if (augmentationTimeoutRef.current) {
      clearTimeout(augmentationTimeoutRef.current);
    }
  };

  // Render different stage content
  const renderStageContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="training-intro">
            <h3>歡迎使用機器視覺訓練模擬系統</h3>
            <p>本系統將引導您完成一個簡化的機器視覺模型訓練流程模擬：</p>
            <ol>
              <li>拍攝或上傳樣本圖像</li>
              <li>查看圖像預處理</li>
              <li>體驗資料增強效果</li>
              <li>觀看模擬訓練進程</li>
            </ol>
            <p>請開始拍攝至少3張樣本圖像。</p>
            <div className="training-actions">
              <button onClick={startCapture}>開始拍攝</button>
            </div>
          </div>
        );
        
      case 'capture':
        return (
          <div className="training-capture">
            <h3>樣本圖像收集</h3>
            <p>已拍攝: {capturedImages.length} 張圖像</p>
            
            {capturedImages.length > 0 && (
              <div className="training-thumbnails">
                {capturedImages.map((img, index) => (
                  <div key={index} className="training-thumbnail">
                    <img src={img} alt={`樣本 ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="training-actions">
              <button onClick={startCapture}>拍攝更多</button>
              {capturedImages.length >= 1 && (
                <button onClick={startPreprocessing}>繼續</button>
              )}
            </div>
          </div>
        );
        
      case 'preprocess':
        return (
          <div className="training-preprocess">
            <h3>圖像預處理中...</h3>
            <div className="progress">
              <div className="progress-bar" style={{ width: '100%' }}></div>
            </div>
            <p>正在進行圖像標準化處理，請稍候...</p>
          </div>
        );
        
      case 'augment':
        return (
          <div className="training-augment">
            <h3>資料增強展示</h3>
            <p>資料增強可以創建多樣的訓練樣本，提升模型性能</p>
            
            <div className="training-augment-display">
              <div className="training-augment-original">
                <h4>原始圖像</h4>
                {capturedImages.length > 0 && (
                  <img 
                    src={capturedImages[0]} 
                    alt="原始圖像" 
                    className="training-augment-image"
                  />
                )}
              </div>
              
              <div className="training-augment-result">
                <h4>增強效果: {currentAugmentation?.name || '準備中...'}</h4>
                <canvas 
                  ref={augmentationCanvasRef}
                  width="300"
                  height="225"
                  className="training-augment-canvas"
                />
              </div>
            </div>
          </div>
        );
        
      case 'train':
        return (
          <div className="training-train">
            <h3>模型訓練進度</h3>
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{ width: `${trainProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.floor(trainProgress)}%
            </div>
            
            <div className="training-stats">
              <div className="training-stat">
                <span>迭代次數:</span>
                <span>{Math.floor(trainProgress / 10)}</span>
              </div>
              <div className="training-stat">
                <span>損失值:</span>
                <span>{(1 - (trainProgress / 100) * 0.8).toFixed(4)}</span>
              </div>
              <div className="training-stat">
                <span>準確率:</span>
                <span>{((trainProgress / 100) * 85 + 10).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="training-log">
              <div className="training-log-title">訓練日誌:</div>
              <div className="training-log-content">
                {trainProgress >= 10 && <div>[INFO] 批次 1/10 完成 - 損失: 0.8952 - 準確率: 35.24%</div>}
                {trainProgress >= 20 && <div>[INFO] 批次 2/10 完成 - 損失: 0.7621 - 準確率: 42.18%</div>}
                {trainProgress >= 30 && <div>[INFO] 批次 3/10 完成 - 損失: 0.6543 - 準確率: 51.32%</div>}
                {trainProgress >= 40 && <div>[INFO] 批次 4/10 完成 - 損失: 0.5872 - 準確率: 59.75%</div>}
                {trainProgress >= 50 && <div>[INFO] 批次 5/10 完成 - 損失: 0.4991 - 準確率: 66.43%</div>}
                {trainProgress >= 60 && <div>[INFO] 批次 6/10 完成 - 損失: 0.4125 - 準確率: 72.89%</div>}
                {trainProgress >= 70 && <div>[INFO] 批次 7/10 完成 - 損失: 0.3542 - 準確率: 78.21%</div>}
                {trainProgress >= 80 && <div>[INFO] 批次 8/10 完成 - 損失: 0.2934 - 準確率: 83.57%</div>}
                {trainProgress >= 90 && <div>[INFO] 批次 9/10 完成 - 損失: 0.2451 - 準確率: 87.94%</div>}
                {trainProgress >= 99 && <div>[INFO] 批次 10/10 完成 - 損失: 0.2011 - 準確率: 91.32%</div>}
                {trainProgress >= 100 && <div>[INFO] 訓練完成!</div>}
              </div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="training-complete">
            <h3>恭喜！模型訓練完成</h3>
            <div className="training-complete-icon"></div>
            <p>您的機器視覺模型已成功訓練完成，最終模型效能：</p>
            
            <div className="training-results">
              <div className="training-result">
                <span>準確率:</span>
                <span>91.32%</span>
              </div>
              <div className="training-result">
                <span>損失值:</span>
                <span>0.2011</span>
              </div>
              <div className="training-result">
                <span>F1分數:</span>
                <span>0.8956</span>
              </div>
            </div>
            
            <div className="training-actions">
              <button onClick={restart}>重新開始</button>
              <button onClick={onClose}>關閉</button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Sidebar to show current stage
  const renderSidebar = () => {
    const stages = [
      { id: 'intro', name: '介紹' },
      { id: 'capture', name: '拍攝樣本' },
      { id: 'preprocess', name: '預處理' },
      { id: 'augment', name: '資料增強' },
      { id: 'train', name: '模型訓練' },
      { id: 'complete', name: '完成' }
    ];
    
    return (
      <div className="training-sidebar">
        <div className="training-sidebar-title">訓練階段</div>
        <div className="training-sidebar-stages">
          {stages.map((s) => (
            <div 
              key={s.id}
              className={`training-sidebar-stage ${stage === s.id ? 'training-sidebar-stage--active' : ''}`}
            >
              <div className="training-sidebar-stage-bullet"></div>
              <div className="training-sidebar-stage-name">{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // When taking photos, update stage
  useEffect(() => {
    if (capturedImages.length > 0 && stage === 'intro') {
      setStage('capture');
    }
  }, [capturedImages, stage]);

  // When augmentation stage changes, update augmentation effect display
  useEffect(() => {
    if (stage === 'augment' && currentAugmentation && capturedImages.length > 0) {
      const canvas = augmentationCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const img = new Image();
        img.onload = () => {
          // Reset transformations
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw original image first
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Apply augmentation effect
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Specific augmentation effect implementation
          if (currentAugmentation.name === '水平翻轉') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          } else if (currentAugmentation.name === '旋轉') {
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(Math.PI/6);
            ctx.translate(-canvas.width/2, -canvas.height/2);
          } else if (currentAugmentation.name === '亮度調整') {
            ctx.filter = 'brightness(120%)';
          } else if (currentAugmentation.name === '對比度調整') {
            ctx.filter = 'contrast(120%)';
          } else if (currentAugmentation.name === '模糊效果') {
            ctx.filter = 'blur(2px)';
          }
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        };
        img.src = capturedImages[0];
      }
    }
  }, [currentAugmentation, capturedImages, stage]);

  return (
    <div className="training-demo">
      {/* Main content area */}
      <div className="training-content">
        {/* Sidebar */}
        {renderSidebar()}
        
        {/* Main area */}
        <div className="training-main">
          {renderStageContent()}
        </div>
      </div>
      
      {/* Camera component */}
      {showCamera && (
        <div className="camera-overlay">
          <div className="camera-container-wrapper">
            <CameraCapture
              onCapture={handleCapture}
              onCancel={handleCameraCancel}
              width={400}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default TrainingDemo;