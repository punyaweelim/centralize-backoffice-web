// src/services/userService.ts
import { apiClient } from '../utils/apiClient';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const userService = {
  // ดึงรายการ User ทั้งหมด
  async listUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users/list');
      
      // ตรวจสอบว่า response มี data หรือไม่
      if (!response) {
        console.warn('Empty response from API');
        return [];
      }

      // ตรวจสอบว่า response.data เป็น array หรือไม่
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // กรณี response เป็น array โดยตรง
      if (Array.isArray(response)) {
        return response;
      }

      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // สร้าง User ใหม่
  async createUser(userData: User): Promise<User> {
    try {
      const response = await apiClient.post('/users/create', userData);
      
      // ตรวจสอบว่ามี data ใน response หรือไม่
      if (response.data) {
        return response.data;
      }
      
      // กรณี response เป็น object โดยตรง
      if (response.email) {
        return response;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};
