import React, { useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import type { Item } from '../types/item';
import ImageCarousel from './ImageCarousel';
import './ItemDetailModal.css';

interface ItemDetailModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (item: Item) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onEnquire 
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allImages = [item.coverImage, ...item.additionalImages];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEnquireClick = () => {
    onEnquire(item);
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{item.name}</h2>
          <button 
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-image-section">
            <ImageCarousel images={allImages} itemName={item.name} />
          </div>

          <div className="modal-details-section">
            <div className="item-type-display">
              <span className="item-type-label">Category:</span>
              <span className="item-type-value">{item.type}</span>
            </div>

            <div className="item-description-section">
              <h3>Description</h3>
              <p className="item-description-full">{item.description}</p>
            </div>

            <div className="item-meta">
              <span className="item-created-date">
                Added on: {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <button 
              className="enquire-button"
              onClick={handleEnquireClick}
            >
              <Mail size={20} />
              Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
