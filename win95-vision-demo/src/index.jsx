import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 如果您想要添加全局樣式

// 使用React 18的createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);