import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Item } from '../types/item';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
  onDelete?: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal when delete is clicked
    if (onDelete) {
      onDelete(item);
    }
  };

  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-image-container">
        <img 
          src={item.coverImage} 
          alt={item.name}
          className="item-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        <div className="item-type-badge">
          {item.type}
        </div>
        {onDelete && (
          <button 
            className="delete-button"
            onClick={handleDeleteClick}
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <div className="item-content">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description
          }
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
