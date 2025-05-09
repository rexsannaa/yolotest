import React, { useState, useEffect, useRef } from 'react';
import Button from './Win98UI/Button';
import CameraCapture from './CameraCapture';
import './Win98UI/styles.css';

/**
 * Windows 98 風格機器視覺訓練模擬元件
 * 
 * @param {Object} props - 元件屬性
 * @param {Function} props.onClose - 關閉元件時的回調函數
 */
const TrainingDemo = ({ onClose }) => {
  // 狀態管理
  const [stage, setStage] = useState('intro'); // intro, capture, preprocess, augment, train, complete
  const [capturedImages, setCapturedImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [currentAugmentation, setCurrentAugmentation] = useState(null);
  const canvasRef = useRef(null);
  const augmentationCanvasRef = useRef(null);
  const trainIntervalRef = useRef(null);
  const augmentationTimeoutRef = useRef(null);
  
  // 模擬的增強類型
  const augmentationTypes = [
    { name: '原始圖像', function: (ctx, canvas) => {} },
    { name: '水平翻轉', function: (ctx, canvas) => {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(new Image(), 0, 0, canvas.width, canvas.height);
    }},
    { name: '旋轉', function: (ctx, canvas) => {
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(Math.PI/6); // 30度
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

  // 清理函數，防止記憶體洩漏
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

  // 處理照片拍攝
  const handleCapture = (imageData) => {
    setCapturedImages([...capturedImages, imageData]);
    setShowCamera(false);
    
    // 如果已拍攝至少3張照片，自動進入預處理階段
    if (capturedImages.length >= 2) {
      setStage('preprocess');
    }
  };

  // 處理相機取消
  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  // 開始拍照
  const startCapture = () => {
    setShowCamera(true);
  };

  // 開始預處理
  const startPreprocessing = () => {
    setStage('preprocess');
    
    // 模擬短暫的預處理過程
    setTimeout(() => {
      setStage('augment');
      simulateAugmentation();
    }, 2000);
  };

  // 模擬資料增強過程
  const simulateAugmentation = () => {
    let currentIndex = 0;
    
    const showNextAugmentation = () => {
      if (currentIndex < augmentationTypes.length) {
        setCurrentAugmentation(augmentationTypes[currentIndex]);
        currentIndex++;
        
        // 定時顯示下一個增強效果
        augmentationTimeoutRef.current = setTimeout(showNextAugmentation, 1500);
      } else {
        // 增強展示完成後，進入訓練階段
        setStage('train');
        startTraining();
      }
    };
    
    showNextAugmentation();
  };

  // 開始訓練
  const startTraining = () => {
    setTrainProgress(0);
    
    // 模擬逐漸增加的訓練進度
    trainIntervalRef.current = setInterval(() => {
      setTrainProgress(prev => {
        const increment = Math.random() * 5; // 隨機增量
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(trainIntervalRef.current);
          setTrainProgress(100);
          
          // 延遲一下，顯示100%完成
          setTimeout(() => {
            setStage('complete');
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  // 重新開始整個流程
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

  // 渲染不同階段的內容
  const renderStageContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="win98-training-intro">
            <h3>歡迎使用機器視覺訓練模擬系統</h3>
            <p>本系統將引導您完成一個簡化的機器視覺模型訓練流程模擬：</p>
            <ol>
              <li>拍攝或上傳樣本圖像</li>
              <li>查看圖像預處理</li>
              <li>體驗資料增強效果</li>
              <li>觀看模擬訓練進程</li>
            </ol>
            <p>請開始拍攝至少3張樣本圖像。</p>
            <div className="win98-training-actions">
              <Button onClick={startCapture}>開始拍攝</Button>
            </div>
          </div>
        );
        
      case 'capture':
        return (
          <div className="win98-training-capture">
            <h3>樣本圖像收集</h3>
            <p>已拍攝: {capturedImages.length} 張圖像</p>
            
            {capturedImages.length > 0 && (
              <div className="win98-training-thumbnails">
                {capturedImages.map((img, index) => (
                  <div key={index} className="win98-training-thumbnail">
                    <img src={img} alt={`樣本 ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
            
            <div className="win98-training-actions">
              <Button onClick={startCapture}>拍攝更多</Button>
              {capturedImages.length >= 1 && (
                <Button onClick={startPreprocessing}>繼續</Button>
              )}
            </div>
          </div>
        );
        
      case 'preprocess':
        return (
          <div className="win98-training-preprocess">
            <h3>圖像預處理中...</h3>
            <div className="win98-progress">
              <div className="win98-progress-bar">
                <div className="win98-progress-bar-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
            <p>正在進行圖像標準化處理，請稍候...</p>
          </div>
        );
        
      case 'augment':
        return (
          <div className="win98-training-augment">
            <h3>資料增強展示</h3>
            <p>資料增強可以創建多樣的訓練樣本，提升模型性能</p>
            
            <div className="win98-training-augment-display">
              <div className="win98-training-augment-original">
                <h4>原始圖像</h4>
                {capturedImages.length > 0 && (
                  <img 
                    src={capturedImages[0]} 
                    alt="原始圖像" 
                    className="win98-training-augment-image"
                  />
                )}
              </div>
              
              <div className="win98-training-augment-result">
                <h4>增強效果: {currentAugmentation?.name || '準備中...'}</h4>
                <canvas 
                  ref={augmentationCanvasRef}
                  width="300"
                  height="225"
                  className="win98-training-augment-canvas"
                />
              </div>
            </div>
          </div>
        );
        
      case 'train':
        return (
          <div className="win98-training-train">
            <h3>模型訓練進度</h3>
            <div className="win98-progress">
              <div className="win98-progress-bar">
                <div 
                  className="win98-progress-bar-fill" 
                  style={{ width: `${trainProgress}%` }}
                ></div>
              </div>
              <div className="win98-progress-text">
                {Math.floor(trainProgress)}%
              </div>
            </div>
            
            <div className="win98-training-stats">
              <div className="win98-training-stat">
                <span>迭代次數:</span>
                <span>{Math.floor(trainProgress / 10)}</span>
              </div>
              <div className="win98-training-stat">
                <span>損失值:</span>
                <span>{(1 - (trainProgress / 100) * 0.8).toFixed(4)}</span>
              </div>
              <div className="win98-training-stat">
                <span>準確率:</span>
                <span>{((trainProgress / 100) * 85 + 10).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="win98-training-log">
              <div className="win98-training-log-title">訓練日誌:</div>
              <div className="win98-training-log-content">
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
          <div className="win98-training-complete">
            <h3>恭喜！模型訓練完成</h3>
            <div className="win98-training-complete-icon"></div>
            <p>您的機器視覺模型已成功訓練完成，最終模型效能：</p>
            
            <div className="win98-training-results">
              <div className="win98-training-result">
                <span>準確率:</span>
                <span>91.32%</span>
              </div>
              <div className="win98-training-result">
                <span>損失值:</span>
                <span>0.2011</span>
              </div>
              <div className="win98-training-result">
                <span>F1分數:</span>
                <span>0.8956</span>
              </div>
            </div>
            
            <div className="win98-training-actions">
              <Button onClick={restart}>重新開始</Button>
              <Button onClick={onClose}>關閉</Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // 側邊欄顯示當前階段
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
      <div className="win98-training-sidebar">
        <div className="win98-training-sidebar-title">訓練階段</div>
        <div className="win98-training-sidebar-stages">
          {stages.map((s) => (
            <div 
              key={s.id}
              className={`win98-training-sidebar-stage ${stage === s.id ? 'win98-training-sidebar-stage--active' : ''}`}
            >
              <div className="win98-training-sidebar-stage-bullet"></div>
              <div className="win98-training-sidebar-stage-name">{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 當拍攝照片時，更新階段
  useEffect(() => {
    if (capturedImages.length > 0 && stage === 'intro') {
      setStage('capture');
    }
  }, [capturedImages, stage]);

  // 當資料增強階段變更時，更新增強效果顯示
  useEffect(() => {
    if (stage === 'augment' && currentAugmentation && capturedImages.length > 0) {
      const canvas = augmentationCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const img = new Image();
        img.onload = () => {
          // 重置變換
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 先繪製原始圖像
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // 應用增強效果
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 特定增強效果實現
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
    <div className="win98-training-demo">
      {/* 主內容區域 */}
      <div className="win98-training-content">
        {/* 側邊欄 */}
        {renderSidebar()}
        
        {/* 主要區域 */}
        <div className="win98-training-main">
          {renderStageContent()}
        </div>
      </div>
      
      {/* 相機元件 */}
      {showCamera && (
        <div className="win98-training-camera-overlay">
          <div className="win98-training-camera-container">
            <h3>拍攝樣本圖像</h3>
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

// 添加 CSS 樣式
const styles = `
  /* 基本佈局 */
  .win98-training-demo {
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    font-size: 12px;
    color: #000;
    background-color: #c0c0c0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  
  .win98-training-content {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* 側邊欄樣式 */
  .win98-training-sidebar {
    width: 150px;
    height: 100%;
    background-color: #c0c0c0;
    border-right: 1px solid #808080;
    display: flex;
    flex-direction: column;
    padding: 8px;
    box-sizing: border-box;
  }
  
  .win98-training-sidebar-title {
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 4px;
    border-bottom: 1px solid #808080;
  }
  
  .win98-training-sidebar-stages {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .win98-training-sidebar-stage {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .win98-training-sidebar-stage-bullet {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #808080;
    border: 1px solid #000;
  }
  
  .win98-training-sidebar-stage--active .win98-training-sidebar-stage-bullet {
    background-color: #000080;
  }
  
  .win98-training-sidebar-stage--active .win98-training-sidebar-stage-name {
    font-weight: bold;
    color: #000080;
  }
  
  /* 主要內容區域 */
  .win98-training-main {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
  
  /* 介紹頁面 */
  .win98-training-intro h3,
  .win98-training-capture h3,
  .win98-training-preprocess h3,
  .win98-training-augment h3,
  .win98-training-train h3,
  .win98-training-complete h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
  
  .win98-training-intro ol {
    margin-left: 20px;
    margin-bottom: 16px;
  }
  
  .win98-training-intro li {
    margin-bottom: 8px;
  }
  
  /* 按鈕容器 */
  .win98-training-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  
  /* 拍攝階段 */
  .win98-training-thumbnails {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  
  .win98-training-thumbnail {
    width: 120px;
    height: 90px;
    border: 1px solid #000;
    padding: 2px;
    background-color: #fff;
    box-shadow: 
      inset -1px -1px 0 0 #000,
      inset 1px 1px 0 0 #fff;
  }
  
  .win98-training-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 預處理階段 */
  .win98-progress {
    width: 100%;
    margin: 16px 0;
  }
  
  .win98-progress-bar {
    height: 20px;
    background-color: #fff;
    border: 1px solid #808080;
    box-shadow: 
      inset -1px -1px 0 0 #fff,
      inset 1px 1px 0 0 #000;
    overflow: hidden;
  }
  
  .win98-progress-bar-fill {
    height: 100%;
    background-color: #000080;
    transition: width 0.3s linear;
  }
  
  .win98-progress-text {
    text-align: center;
    margin-top: 4px;
    font-weight: bold;
  }
  
  /* 資料增強階段 */
  .win98-training-augment-display {
    display: flex;
    gap: 16px;
    margin-top: 16px;
  }
  
  .win98-training-augment-original,
  .win98-training-augment-result {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .win98-training-augment-image,
  .win98-training-augment-canvas {
    width: 300px;
    height: 225px;
    border: 1px solid #000;
    background-color: #fff;
    object-fit: contain;
  }
  
  .win98-training-augment h4 {
    margin-bottom: 8px;
    font-size: 12px;
    text-align: center;
  }
  
  /* 訓練階段 */
  .win98-training-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    border: 1px solid #808080;
    padding: 8px;
    background-color: #f0f0f0;
  }
  
  .win98-training-stat {
    display: flex;
    justify-content: space-between;
  }
  
  .win98-training-log {
    margin-top: 16px;
    border: 1px solid #808080;
    height: 150px;
    overflow-y: auto;
    background-color: #000;
    color: #00ff00;
    font-family: 'Courier New', monospace;
  }
  
  .win98-training-log-title {
    background-color: #c0c0c0;
    color: #000;
    padding: 4px;
    font-weight: bold;
    border-bottom: 1px solid #808080;
  }
  
  .win98-training-log-content {
    padding: 4px;
    font-size: 11px;
  }
  
  .win98-training-log-content div {
    margin-bottom: 4px;
  }
  
  /* 完成階段 */
  .win98-training-complete {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .win98-training-complete-icon {
    width: 64px;
    height: 64px;
    background-color: #00aa00;
    border-radius: 50%;
    margin: 16px 0;
    position: relative;
  }
  
  .win98-training-complete-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 15px;
    border-left: 5px solid #fff;
    border-bottom: 5px solid #fff;
    transform: translate(-50%, -60%) rotate(-45deg);
  }
  
  .win98-training-results {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px 0;
    border: 1px solid #808080;
    padding: 16px;
    width: 80%;
    background-color: #f0f0f0;
  }
  
  .win98-training-result {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }
  
  /* 相機覆蓋層 */
  .win98-training-camera-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .win98-training-camera-container {
    background-color: #c0c0c0;
    border: 2px solid #dfdfdf;
    box-shadow: 
      inset -1px -1px 0 0 #000,
      inset 1px 1px 0 0 #fff,
      inset -2px -2px 0 0 #808080,
      inset 2px 2px 0 0 #dfdfdf;
    padding: 16px;
    border-radius: 0;
  }
  
  .win98-training-camera-container h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
    text-align: center;
  }
`;

// 將樣式添加到文檔中
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TrainingDemo;