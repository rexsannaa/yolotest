import React, { useState } from 'react';
// 移除 './TrainingDemo.css' 的引入，使用98.css的樣式

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
          <div className="window-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>訓練圖像 ({capturedImages.length})</h3>
              <button onClick={onCaptureImage}>
                捕獲新圖像
              </button>
            </div>
            
            {capturedImages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #888' }}>
                <p>尚未捕獲圖像。點擊上方按鈕以捕獲新圖像。</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', background: 'white', padding: '16px', border: '1px solid #888' }}>
                {capturedImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative', border: '1px solid #888', overflow: 'hidden' }}>
                    <img src={img} alt={`捕獲 ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '4px', fontSize: '12px', textAlign: 'center' }}>
                      圖像 {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'augment':
        return (
          <div className="window-body">
            <h3>資料增強選項</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '16px' }}>
              {augmentations.map(aug => (
                <div key={aug.id} style={{ padding: '4px' }}>
                  <label className="field-row">
                    <input
                      type="checkbox"
                      checked={aug.enabled}
                      onChange={() => handleAugmentationToggle(aug.id)}
                    />
                    {aug.name}
                  </label>
                </div>
              ))}
            </div>
            
            <h3>預覽增強效果</h3>
            {capturedImages.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', background: 'white', padding: '16px', border: '1px solid #888' }}>
                {augmentations
                  .filter(aug => aug.enabled)
                  .map(aug => (
                    <div key={aug.id} style={{ position: 'relative', border: '1px solid #888', overflow: 'hidden' }}>
                      <img 
                        src={capturedImages[0]} 
                        alt={`${aug.name} 增強`}
                        className={`filter-${aug.id}`}
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '4px', fontSize: '12px', textAlign: 'center' }}>
                        {aug.name}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', background: 'white', border: '1px solid #888' }}>
                <p>尚未捕獲圖像。請先捕獲一些圖像以預覽增強效果。</p>
              </div>
            )}
          </div>
        );
        
      case 'train':
        return (
          <div className="window-body">
            <h3>選擇訓練模型</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {modelOptions.map(model => (
                <div 
                  key={model.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '8px', 
                    border: '1px solid #888', 
                    cursor: 'pointer', 
                    backgroundColor: selectedModel === model.id ? '#000080' : 'white',
                    color: selectedModel === model.id ? 'white' : 'black'
                  }}
                  onClick={() => handleModelSelect(model.id)}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{model.name}</div>
                  <div style={{ fontSize: '12px' }}>{model.description}</div>
                </div>
              ))}
            </div>
            
            <h3>訓練設置</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div className="field-row">
                <label>批次大小：</label>
                <select>
                  <option>4</option>
                  <option>8</option>
                  <option selected>16</option>
                  <option>32</option>
                </select>
              </div>
              <div className="field-row">
                <label>學習率：</label>
                <select>
                  <option>0.001</option>
                  <option selected>0.01</option>
                  <option>0.1</option>
                </select>
              </div>
              <div className="field-row">
                <label>迭代次數：</label>
                <select>
                  <option>50</option>
                  <option selected>100</option>
                  <option>200</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <button 
                style={{ fontWeight: 'bold' }}
                onClick={startTraining}
                disabled={isTraining || capturedImages.length === 0}
              >
                {isTraining ? '訓練中...' : '開始訓練'}
              </button>
            </div>
            
            {isTraining && (
              <div style={{ marginBottom: '16px' }}>
                <h4>訓練進度</h4>
                <div className="sunken-panel" style={{ width: '100%', height: '24px', position: 'relative' }}>
                  <div 
                    style={{ 
                      width: `${trainingProgress}%`, 
                      height: '100%', 
                      backgroundColor: '#000080',
                      position: 'absolute',
                      top: 0,
                      left: 0 
                    }}
                  ></div>
                </div>
                <div style={{ textAlign: 'center' }}>{Math.floor(trainingProgress)}%</div>
              </div>
            )}
            
            {trainingResult && (
              <div style={{ border: '1px solid #888', padding: '16px', backgroundColor: 'white' }}>
                <h4>訓練結果</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>準確率：</span>
                    <span style={{ fontWeight: 'bold' }}>{trainingResult.accuracy}%</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>損失值：</span>
                    <span style={{ fontWeight: 'bold' }}>{trainingResult.loss}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>精確度：</span>
                    <span style={{ fontWeight: 'bold' }}>{trainingResult.precision}%</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>召回率：</span>
                    <span style={{ fontWeight: 'bold' }}>{trainingResult.recall}%</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>訓練時間：</span>
                    <span style={{ fontWeight: 'bold' }}>{trainingResult.timeElapsed}</span>
                  </div>
                </div>
                
                <div style={{ height: '200px', position: 'relative', border: '1px solid #888', marginTop: '16px', backgroundColor: 'white' }}>
                  <div className="chart-placeholder" style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', top: '30%', left: 0, width: '100%', height: '2px', backgroundColor: '#00ff00' }}></div>
                    <div style={{ position: 'absolute', top: '70%', left: 0, width: '100%', height: '2px', backgroundColor: '#ff0000' }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '8px', backgroundColor: '#00ff00' }}></div>
                        <div style={{ fontSize: '12px' }}>準確率</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '16px', height: '8px', backgroundColor: '#ff0000' }}></div>
                        <div style={{ fontSize: '12px' }}>損失值</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <div className="window-body">未知選項卡</div>;
    }
  };
  
  return (
    <div className="window" style={{ width: '100%', height: '100%' }}>
      <div className="title-bar">
        <div className="title-bar-text">機器視覺訓練</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      
      <div className="window-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)', padding: 0 }}>
        <menu role="tablist" style={{ marginBottom: '0' }}>
          <button 
            aria-selected={activeTab === 'images'} 
            onClick={() => setActiveTab('images')}
          >
            圖像庫
          </button>
          <button 
            aria-selected={activeTab === 'augment'} 
            onClick={() => setActiveTab('augment')}
          >
            資料增強
          </button>
          <button 
            aria-selected={activeTab === 'train'} 
            onClick={() => setActiveTab('train')}
          >
            訓練模型
          </button>
        </menu>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderTabContent()}
        </div>
      </div>
      
      <div className="status-bar">
        <div className="status-bar-field">
          模型: {modelOptions.find(m => m.id === selectedModel)?.name || '未選擇'}
        </div>
        <div className="status-bar-field">
          圖像: {capturedImages.length}
        </div>
        <div className="status-bar-field">
          增強: {augmentations.filter(a => a.enabled).length}/{augmentations.length}
        </div>
      </div>
    </div>
  );
}

export default TrainingDemo;