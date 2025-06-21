import type { Item, ItemFormData } from '../types/item';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to convert relative image paths to full URLs
const processItemImages = (item: Item): Item => {
  return {
    ...item,
    coverImage: item.coverImage.startsWith('http') 
      ? item.coverImage 
      : `${SERVER_BASE_URL}${item.coverImage}`,
    additionalImages: item.additionalImages.map(img => 
      img.startsWith('http') ? img : `${SERVER_BASE_URL}${img}`
    )
  };
};

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      return {
        success: false,
        error: 'Upload failed',
      };
    }
  }
  // Get all items
  async getItems(): Promise<ApiResponse<Item[]>> {
    const response = await this.request<Item[]>('/items');
    if (response.success && response.data) {
      response.data = response.data.map(processItemImages);
    }
    return response;
  }

  // Get single item
  async getItem(id: string): Promise<ApiResponse<Item>> {
    const response = await this.request<Item>(`/items/${id}`);
    if (response.success && response.data) {
      response.data = processItemImages(response.data);
    }
    return response;
  }
  // Create new item
  async createItem(itemData: ItemFormData): Promise<ApiResponse<Item>> {
    const formData = new FormData();
    
    formData.append('name', itemData.name);
    formData.append('type', itemData.type);
    formData.append('description', itemData.description);
    
    if (itemData.coverImage) {
      formData.append('coverImage', itemData.coverImage);
    }
    
    itemData.additionalImages.forEach((file) => {
      formData.append('additionalImages', file);
    });

    const response = await this.uploadRequest<Item>('/items', formData);
    if (response.success && response.data) {
      response.data = processItemImages(response.data);
    }
    return response;
  }

  // Update item
  async updateItem(id: string, itemData: Partial<ItemFormData>): Promise<ApiResponse<Item>> {
    const formData = new FormData();
    
    if (itemData.name) formData.append('name', itemData.name);
    if (itemData.type) formData.append('type', itemData.type);
    if (itemData.description) formData.append('description', itemData.description);
    
    if (itemData.coverImage) {
      formData.append('coverImage', itemData.coverImage);
    }
    
    if (itemData.additionalImages) {
      itemData.additionalImages.forEach((file) => {
        formData.append('additionalImages', file);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update request failed:', error);
      return {
        success: false,
        error: 'Update failed',
      };
    }
  }
  // Delete item
  async deleteItem(id: string): Promise<ApiResponse> {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Test server connection
  async testConnection(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
