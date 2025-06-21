import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './SuccessToast.css';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast-content">
        <CheckCircle className="toast-icon" size={24} />
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close-button"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
