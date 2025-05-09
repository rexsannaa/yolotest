import React from 'react';
import './styles.css';

/**
 * Windows 98 style button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.active - Whether button is in active/pressed state
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.size - Button size (small, medium, large)
 */
const Button = ({
  className = '',
  disabled = false,
  active = false,
  type = 'button',
  onClick,
  children,
  size = 'medium',
  ...restProps
}) => {
  const buttonClasses = [
    'win98-button',
    active ? 'win98-button--active' : '',
    `win98-button--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;