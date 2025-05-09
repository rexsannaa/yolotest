import React, { useState } from 'react';
import './TrainingDemo.css';

// 模擬資料增強方法
const augmentationMethods = [
  { id: 'rotation', name: '旋轉', enabled: true },
  { id: 'flip', name: '翻轉', enabled: true },
  { id: 'brightness', name: '亮度調整', enabled: true },
  { id: 'noise', name: '雜訊添加', enabled: false },
  { id: 'zoom', name: '縮放', enabled: false },
  { id: 'blur', name: '模糊', enabled: false }
];

// 模擬訓練模型
const modelOptions = [
  { id: 'yolov8', name: 'YOLOv8', description: '快速、準確的目標檢測模型' },
  { id: 'faster-rcnn', name: 'Faster R-CNN', description: '高精度的兩階段檢測器' },
  { id: 'ssd', name: 'SSD', description: '單發多框檢測器' }
];

function TrainingDemo({ capturedImages, onCaptureImage }) {
  const [activeTab, setActiveTab] = useState('images');
  const [augmentations, setAugmentations] = useState(augmentationMethods);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].id);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingResult, setTrainingResult] = useState(null);
  
  // 處理資料增強開關
  const handleAugmentationToggle = (id) => {
    setAugmentations(augmentations.map(aug => 
      aug.id === id ? { ...aug, enabled: !aug.enabled } : aug
    ));
  };
  
  // 處理模型選擇
  const handleModelSelect = (id) => {
    setSelectedModel(id);
  };
  
  // 開始模擬訓練
  const startTraining = () => {
    if (capturedImages.length === 0) {
      alert('請先捕獲一些圖像！');
      return;
    }
    
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingResult(null);
    
    // 模擬訓練進度
    const trainingInterval = setInterval(() => {
      setTrainingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(trainingInterval);
          setIsTraining(false);
          // 模擬訓練結果
          setTrainingResult({
            accuracy: (80 + Math.random() * 15).toFixed(2),
            loss: (0.1 + Math.random() * 0.3).toFixed(3),
            precision: (75 + Math.random() * 20).toFixed(2),
            recall: (70 + Math.random() * 25).toFixed(2),
            epochs: 100,
            timeElapsed: `${Math.floor(Math.random() * 10) + 1}分鐘`
          });
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  // 渲染選項卡內容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'images':
        return (
          <div className="tab-content images-tab">
            <div className="tab-header">
              <h3>訓練圖像 ({capturedImages.length})</h3>
              <button className="win95-button" onClick={onCaptureImage}>
                捕獲新圖像
              </button>
            </div>
            
            {capturedImages.length === 0 ? (
              <div className="no-images">
                <p>尚未捕獲圖像。點擊上方按鈕以捕獲新圖像。</p>
              </div>
            ) : (
              <div className="image-grid">
                {capturedImages.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={img} alt={`捕獲 ${index + 1}`} />
                    <div className="image-number">圖像 {index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'augment':
        return (
          <div className="tab-content augment-tab">
            <h3>資料增強選項</h3>
            <div className="augmentation-options">
              {augmentations.map(aug => (
                <div key={aug.id} className="augmentation-option">
                  <label className="win95-checkbox">
                    <input
                      type="checkbox"
                      checked={aug.enabled}
                      onChange={() => handleAugmentationToggle(aug.id)}
                    />
                    <span className="checkmark"></span>
                    {aug.name}
                  </label>
                </div>
              ))}
            </div>
            
            <h3>預覽增強效果</h3>
            {capturedImages.length > 0 ? (
              <div className="augmentation-preview">
                {augmentations
                  .filter(aug => aug.enabled)
                  .map(aug => (
                    <div key={aug.id} className="augmented-image">
                      <img 
                        src={capturedImages[0]} 
                        alt={`${aug.name} 增強`}
                        className={`filter-${aug.id}`}
                      />
                      <div className="augmentation-name">{aug.name}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-images">
                <p>尚未捕獲圖像。請先捕獲一些圖像以預覽增強效果。</p>
              </div>
            )}
          </div>
        );
        
      case 'train':
        return (
          <div className="tab-content train-tab">
            <h3>選擇訓練模型</h3>
            <div className="model-selection">
              {modelOptions.map(model => (
                <div 
                  key={model.id} 
                  className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div className="model-name">{model.name}</div>
                  <div className="model-description">{model.description}</div>
                </div>
              ))}
            </div>
            
            <h3>訓練設置</h3>
            <div className="training-settings">
              <div className="setting-item">
                <label>批次大小：</label>
                <select className="win95-select">
                  <option>4</option>
                  <option>8</option>
                  <option selected>16</option>
                  <option>32</option>
                </select>
              </div>
              <div className="setting-item">
                <label>學習率：</label>
                <select className="win95-select">
                  <option>0.001</option>
                  <option selected>0.01</option>
                  <option>0.1</option>
                </select>
              </div>
              <div className="setting-item">
                <label>迭代次數：</label>
                <select className="win95-select">
                  <option>50</option>
                  <option selected>100</option>
                  <option>200</option>
                </select>
              </div>
            </div>
            
            <div className="training-actions">
              <button 
                className="win95-button primary-button" 
                onClick={startTraining}
                disabled={isTraining || capturedImages.length === 0}
              >
                {isTraining ? '訓練中...' : '開始訓練'}
              </button>
            </div>
            
            {isTraining && (
              <div className="training-progress-container">
                <h4>訓練進度</h4>
                <div className="win95-progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{Math.floor(trainingProgress)}%</div>
              </div>
            )}
            
            {trainingResult && (
              <div className="training-results">
                <h4>訓練結果</h4>
                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">準確率：</span>
                    <span className="result-value">{trainingResult.accuracy}%</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">損失值：</span>
                    <span className="result-value">{trainingResult.loss}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">精確度：</span>
                    <span className="result-value">{trainingResult.precision}%</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">召回率：</span>
                    <span className="result-value">{trainingResult.recall}%</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">訓練時間：</span>
                    <span className="result-value">{trainingResult.timeElapsed}</span>
                  </div>
                </div>
                
                <div className="training-chart">
                  {/* 在這裡我們可以實現一個簡單的模擬圖表或者使用一個靜態圖片 */}
                  <div className="chart-placeholder">
                    <div className="chart-line accuracy-line"></div>
                    <div className="chart-line loss-line"></div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <div className="legend-color accuracy-color"></div>
                        <div className="legend-text">準確率</div>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color loss-color"></div>
                        <div className="legend-text">損失值</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <div>未知選項卡</div>;
    }
  };
  
  return (
    <div className="training-demo-container">
      <div className="win95-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            圖像庫
          </button>
          <button 
            className={`tab-button ${activeTab === 'augment' ? 'active' : ''}`}
            onClick={() => setActiveTab('augment')}
          >
            資料增強
          </button>
          <button 
            className={`tab-button ${activeTab === 'train' ? 'active' : ''}`}
            onClick={() => setActiveTab('train')}
          >
            訓練模型
          </button>
        </div>
        
        <div className="tab-content-container">
          {renderTabContent()}
        </div>
      </div>
      
      <div className="status-bar">
        <div className="status-item">
          模型: {modelOptions.find(m => m.id === selectedModel)?.name || '未選擇'}
        </div>
        <div className="status-item">
          圖像: {capturedImages.length}
        </div>
        <div className="status-item">
          增強: {augmentations.filter(a => a.enabled).length}/{augmentations.length}
        </div>
      </div>
    </div>
  );
}

export default TrainingDemo;