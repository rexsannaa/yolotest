import React from 'react';
import './Button.css';

function Button({ 
  children, 
  onClick, 
  className = "", 
  disabled = false, 
  type = "button",
  primary = false
}) {
  return (
    <button
      type={type}
      className={`win95-button ${primary ? 'primary-button' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;