import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Application entry point
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);