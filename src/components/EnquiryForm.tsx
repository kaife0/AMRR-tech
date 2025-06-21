import React, { useState } from 'react';
import { X, Mail, Phone, User, MessageSquare } from 'lucide-react';
import type { Item } from '../types/item';
import type { EnquiryFormData } from '../services/web3forms';
import './EnquiryForm.css';

interface EnquiryFormProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EnquiryFormData) => Promise<void>;
  isSubmitting: boolean;
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ 
  item, 
  isOpen, 
  onClose, 
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in learning more about ${item.name}. Could you please provide more details?`
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const enquiryData: EnquiryFormData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      itemName: item.name,
      itemId: item.id,
      message: formData.message.trim()
    };

    await onSubmit(enquiryData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="enquiry-backdrop" onClick={handleBackdropClick}>
      <div className="enquiry-modal">
        <div className="enquiry-header">
          <h2>Enquire About {item.name}</h2>
          <button 
            className="enquiry-close-button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close enquiry form"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="enquiry-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <User size={16} />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail size={16} />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              placeholder="Enter your phone number (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              <MessageSquare size={16} />
              Message *
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`form-textarea ${errors.message ? 'error' : ''}`}
              placeholder="Tell us about your interest in this item"
              rows={4}
              disabled={isSubmitting}
              required
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Send Enquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;
