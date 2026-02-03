// src/services/userService.ts
import { apiClient } from '../utils/apiClient';

export const userService = {
  /**
   * สร้าง User ใหม่ในระบบ
   * [cite: 721, 727]
   */
  create: async (userData: object) => {
    return await apiClient.post('/create', userData);
  },

  /**
   * ดึงรายการ User ทั้งหมด
   * [cite: 733, 782]
   */
  list: async () => {
    return await apiClient.get('/list');
  }
};