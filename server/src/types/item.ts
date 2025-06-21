export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  coverImage: string;
  additionalImages: string[];
  createdAt: Date;
}

export type ItemType = 
  | 'Shirt' 
  | 'Pant' 
  | 'Shoes' 
  | 'Sports Gear' 
  | 'Accessories' 
  | 'Other';

export interface ItemCreateRequest {
  name: string;
  type: ItemType;
  description: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
