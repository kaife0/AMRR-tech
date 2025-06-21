import fs from 'fs';
import path from 'path';
import { Item } from '../types/item';

const DATA_FILE = path.join(__dirname, '../../data/items.json');

// Ensure data directory and file exist
const ensureDataFile = (): void => {
  const dataDir = path.dirname(DATA_FILE);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

// Read all items from JSON file
export const getAllItems = (): Item[] => {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const items = JSON.parse(data);
    
    // Convert createdAt strings back to Date objects
    return items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt)
    }));
  } catch (error) {
    console.error('Error reading items:', error);
    return [];
  }
};

// Save all items to JSON file
export const saveAllItems = (items: Item[]): void => {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Error saving items:', error);
    throw new Error('Failed to save items');
  }
};

// Get item by ID
export const getItemById = (id: string): Item | null => {
  const items = getAllItems();
  return items.find(item => item.id === id) || null;
};

// Add new item
export const addItem = (item: Item): void => {
  const items = getAllItems();
  items.push(item);
  saveAllItems(items);
};

// Update existing item
export const updateItem = (id: string, updatedItem: Partial<Item>): Item | null => {
  const items = getAllItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  items[index] = { ...items[index], ...updatedItem };
  saveAllItems(items);
  return items[index];
};

// Delete item
export const deleteItem = (id: string): boolean => {
  const items = getAllItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) {
    return false; // Item not found
  }
  
  saveAllItems(filteredItems);
  return true;
};
