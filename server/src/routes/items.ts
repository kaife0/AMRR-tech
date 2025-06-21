import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllItems, addItem, getItemById, updateItem, deleteItem } from '../utils/database';
import { Item, ApiResponse } from '../types/item';

// Get all items
export const getItems = (req: Request, res: Response): void => {
  try {
    const items = getAllItems();
    res.json({
      success: true,
      data: items,
      message: 'Items retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items'
    });
  }
};

// Get single item by ID
export const getItem = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const item = getItemById(id);
    
    if (!item) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: item,
      message: 'Item retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve item'
    });
  }
};

// Create new item
export const createItem = (req: Request, res: Response): void => {
  try {
    const { name, type, description } = req.body;
    
    // Validate required fields
    if (!name || !type || !description) {
      res.status(400).json({
        success: false,
        error: 'Name, type, and description are required'
      });
      return;
    }
    
    // Handle file uploads
    const files = req.files as any;
    const coverImage = files?.coverImage?.[0];
    const additionalImages = files?.additionalImages || [];
    
    if (!coverImage) {
      res.status(400).json({
        success: false,
        error: 'Cover image is required'
      });
      return;
    }
    
    // Create new item
    const newItem: Item = {
      id: uuidv4(),
      name: name.trim(),
      type,
      description: description.trim(),
      coverImage: `/uploads/${coverImage.filename}`,
      additionalImages: additionalImages.map((file: any) => `/uploads/${file.filename}`),
      createdAt: new Date()
    };
    
    addItem(newItem);
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create item'
    });
  }
};

// Update existing item
export const updateItemController = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;
    
    const existingItem = getItemById(id);
    if (!existingItem) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    // Handle file uploads for update
    const files = req.files as any;
    let updateData: Partial<Item> = {};
    
    if (name) updateData.name = name.trim();
    if (type) updateData.type = type;
    if (description) updateData.description = description.trim();
    
    if (files?.coverImage?.[0]) {
      updateData.coverImage = `/uploads/${files.coverImage[0].filename}`;
    }
    
    if (files?.additionalImages) {
      updateData.additionalImages = files.additionalImages.map((file: any) => `/uploads/${file.filename}`);
    }
    
    const updatedItem = updateItem(id, updateData);
    
    if (!updatedItem) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update item'
    });
  }
};

// Delete item
export const deleteItemController = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    
    const deleted = deleteItem(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Item not found'
      });
      return;
    }
    
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'    });
  }
};
