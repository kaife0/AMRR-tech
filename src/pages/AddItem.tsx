import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { useItems } from '../context/ItemContext';
import type { ItemFormData } from '../types/item';
import { ITEM_TYPES } from '../types/item';
import SuccessToast from '../components/SuccessToast';
import { fileToBase64, filesToBase64, isValidImageFile, generateId } from '../utils/fileUtils';
import { apiService } from '../services/api';
import './AddItem.css';

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useItems();
  
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    type: 'Other',
    description: '',
    coverImage: null,
    additionalImages: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setErrors(prev => ({ ...prev, coverImage: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, coverImage: 'File size must be less than 5MB' }));
      return;
    }

    setFormData(prev => ({ ...prev, coverImage: file }));
    
    try {
      const preview = await fileToBase64(file);
      setCoverImagePreview(preview);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
    
    if (errors.coverImage) {
      setErrors(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.additionalImages.length + files.length > 5) {
      setErrors(prev => ({ ...prev, additionalImages: 'Maximum 5 additional images allowed' }));
      return;
    }

    const validFiles = files.filter(file => {
      if (!isValidImageFile(file)) {
        setErrors(prev => ({ ...prev, additionalImages: 'All files must be valid images (JPEG, PNG, GIF, WebP)' }));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, additionalImages: 'Each file must be less than 5MB' }));
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) return;

    setFormData(prev => ({ 
      ...prev, 
      additionalImages: [...prev.additionalImages, ...validFiles] 
    }));

    try {
      const newPreviews = await filesToBase64(validFiles);
      setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error generating previews:', error);
    }

    if (errors.additionalImages) {
      setErrors(prev => ({ ...prev, additionalImages: '' }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null }));
    setCoverImagePreview('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Item description is required';
    }

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Try to use API first
      const apiResponse = await apiService.createItem(formData);
      
      if (apiResponse.success && apiResponse.data) {
        // API success - add to context
        addItem(apiResponse.data);
      } else {
        // API failed - use local storage fallback
        const coverImageBase64 = formData.coverImage ? await fileToBase64(formData.coverImage) : '';
        const additionalImagesBase64 = await filesToBase64(formData.additionalImages);

        const newItem = {
          id: generateId(),
          name: formData.name.trim(),
          type: formData.type,
          description: formData.description.trim(),
          coverImage: coverImageBase64,
          additionalImages: additionalImagesBase64,
          createdAt: new Date()
        };

        addItem(newItem);
      }
      
      // Reset form
      setFormData({
        name: '',
        type: 'Other',
        description: '',
        coverImage: null,
        additionalImages: []
      });
      setCoverImagePreview('');
      setAdditionalImagePreviews([]);
      
      setShowSuccessToast(true);
      
      // Redirect to view items after a short delay
      setTimeout(() => {
        navigate('/view-items');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding item:', error);
      setErrors({ submit: 'An error occurred while adding the item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseToast = () => {
    setShowSuccessToast(false);
  };

  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <h1>Add New Item</h1>
        <p>Fill in the details below to add a new item to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Item Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter item name"
            maxLength={100}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Item Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="form-input"
          >
            {ITEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Item Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Describe your item in detail"
            rows={4}
            maxLength={500}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
          <span className="character-count">
            {formData.description.length}/500 characters
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Cover Image *
          </label>
          <div className="image-upload-container">
            {!coverImagePreview ? (
              <label htmlFor="coverImage" className="image-upload-area">
                <Upload size={32} />
                <span>Click to upload cover image</span>
                <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
              </label>
            ) : (
              <div className="image-preview-container">
                <img src={coverImagePreview} alt="Cover preview" className="image-preview" />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="remove-image-button"
                  aria-label="Remove cover image"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <input
              type="file"
              id="coverImage"
              onChange={handleCoverImageChange}
              accept="image/*"
              className="hidden-input"
            />
          </div>
          {errors.coverImage && <span className="error-text">{errors.coverImage}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Additional Images
            <span className="optional-label">(Optional - Max 5 images)</span>
          </label>
          <div className="additional-images-container">
            <div className="additional-images-grid">
              {additionalImagePreviews.map((preview, index) => (
                <div key={index} className="additional-image-container">
                  <img src={preview} alt={`Additional ${index + 1}`} className="additional-image" />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="remove-additional-image-button"
                    aria-label={`Remove additional image ${index + 1}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {formData.additionalImages.length < 5 && (
                <label htmlFor="additionalImages" className="add-more-images-button">
                  <Plus size={24} />
                  <span>Add Image</span>
                </label>
              )}
            </div>
            
            <input
              type="file"
              id="additionalImages"
              onChange={handleAdditionalImagesChange}
              accept="image/*"
              multiple
              className="hidden-input"
            />
          </div>
          {errors.additionalImages && <span className="error-text">{errors.additionalImages}</span>}
        </div>

        {errors.submit && (
          <div className="form-error">
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/view-items')}
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
            {isSubmitting ? 'Adding Item...' : 'Add Item'}
          </button>
        </div>
      </form>

      <SuccessToast
        message="Item successfully added! Redirecting to view items..."
        isVisible={showSuccessToast}
        onClose={handleCloseToast}
        duration={4000}
      />
    </div>
  );
};

export default AddItem;
