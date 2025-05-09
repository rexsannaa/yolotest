import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 應用程式啟動入口點
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染主應用程式
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);