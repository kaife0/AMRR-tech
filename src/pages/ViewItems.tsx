import React, { useState } from 'react';
import { useItems } from '../context/ItemContext';
import type { Item } from '../types/item';
import ItemCard from '../components/ItemCard';
import ItemDetailModal from '../components/ItemDetailModal';
import EnquiryForm from '../components/EnquiryForm';
import SuccessToast from '../components/SuccessToast';
import { web3FormsService, type EnquiryFormData } from '../services/web3forms';
import { apiService } from '../services/api';
import './ViewItems.css';

const ViewItems: React.FC = () => {
  const { state, deleteItem } = useItems();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleEnquire = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(false);
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    if (!isSubmittingEnquiry) {
      setIsEnquiryOpen(false);
      setSelectedItem(null);
    }
  };
  const handleDeleteItem = async (item: Item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }
    
    try {
      // Try to delete via API first
      const response = await apiService.deleteItem(item.id);
      
      if (response.success) {
        // Also remove from local state
        deleteItem(item.id);
        setToastMessage(`"${item.name}" has been deleted successfully.`);
        setShowSuccessToast(true);
      } else {
        // If API fails, still remove from local state (for demo purposes)
        deleteItem(item.id);
        setToastMessage(`"${item.name}" has been deleted locally (API unavailable).`);
        setShowSuccessToast(true);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Still remove from local state if API fails
      deleteItem(item.id);
      setToastMessage(`"${item.name}" has been deleted locally (API unavailable).`);
      setShowSuccessToast(true);
    }
  };

  const handleSubmitEnquiry = async (formData: EnquiryFormData) => {
    setIsSubmittingEnquiry(true);
    
    try {
      const response = await web3FormsService.submitEnquiry(formData);
      
      if (response.success) {
        setToastMessage(response.message || 'Your enquiry has been sent successfully! We\'ll get back to you soon.');
        setShowSuccessToast(true);
        setIsEnquiryOpen(false);
        setSelectedItem(null);
      } else {
        setToastMessage(response.error || 'Failed to send enquiry. Please try again.');
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setToastMessage('An unexpected error occurred. Please try again.');
      setShowErrorToast(true);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const handleCloseToast = () => {
    setShowSuccessToast(false);
    setShowErrorToast(false);
    setToastMessage('');
  };

  if (state.loading) {
    return (
      <div className="view-items-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="view-items-container">
        <div className="error-message">
          <p>Error: {state.error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="view-items-container">
      <div className="view-items-header">
        <h1>View Items</h1>
        <p>Browse through our collection of items</p>
      </div>

      {state.items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h2>No items found</h2>
            <p>Start by adding some items to your collection.</p>
          </div>
        </div>
      ) : (        <div className="items-grid">
          {state.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <>
          <ItemDetailModal
            item={selectedItem}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onEnquire={handleEnquire}
          />
          
          <EnquiryForm
            item={selectedItem}
            isOpen={isEnquiryOpen}
            onClose={handleCloseEnquiry}
            onSubmit={handleSubmitEnquiry}
            isSubmitting={isSubmittingEnquiry}
          />
        </>
      )}

      <SuccessToast
        message={toastMessage}
        isVisible={showSuccessToast}
        onClose={handleCloseToast}
      />

      {showErrorToast && (
        <div className="error-toast">
          <div className="error-toast-content">
            <span>{toastMessage}</span>
            <button onClick={handleCloseToast} className="error-toast-close">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItems;
