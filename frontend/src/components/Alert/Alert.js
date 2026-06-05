import React from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose }) => {
  const icons = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    danger: '❌'
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{icons[type]}</div>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="إغلاق">
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
