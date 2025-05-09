import React from 'react';
import './styles.css';

/**
 * Windows 98 風格圖標元件
 * 
 * @param {Object} props - 元件屬性
 * @param {string} props.icon - 圖標圖像源 (CSS 類名或圖像URL)
 * @param {string} props.label - 圖標下方顯示的文字標籤
 * @param {string} props.className - 額外的CSS類名
 * @param {Function} props.onClick - 點擊處理函數
 * @param {boolean} props.selected - 是否被選中
 * @param {string} props.size - 圖標大小 ('small', 'medium', 'large')
 */
const Icon = ({
  icon,
  label,
  className = '',
  onClick,
  selected = false,
  size = 'medium',
  ...restProps
}) => {
  const iconClasses = [
    'win98-icon',
    `win98-icon--${size}`,
    selected ? 'win98-icon--selected' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const isImageUrl = typeof icon === 'string' && (
    icon.endsWith('.png') || 
    icon.endsWith('.ico') || 
    icon.endsWith('.jpg') || 
    icon.endsWith('.gif') || 
    icon.startsWith('data:image')
  );

  return (
    <div 
      className={iconClasses}
      onClick={handleClick}
      {...restProps}
    >
      <div className="win98-icon-image">
        {isImageUrl ? (
          <img src={icon} alt={label || ''} />
        ) : (
          <div className={`win98-icon-image-custom ${icon}`}></div>
        )}
      </div>
      {label && (
        <div className="win98-icon-label">
          {label}
        </div>
      )}
    </div>
  );
};

export default Icon;