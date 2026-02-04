// src/services/userService.ts
import { apiClient } from '../utils/apiClient';

// export const userService = {
//   /**
//    * สร้าง User ใหม่ในระบบ
//    * [cite: 721, 727]
//    */
//   create: async (userData: object) => {
//     return await apiClient.post('/create', userData);
//   },

//   /**
//    * ดึงรายการ User ทั้งหมด
//    * [cite: 733, 782]
//    */
//   list: async () => {
//     return await apiClient.get('/list');
//   }
// };

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  // ดึงรายการ User ทั้งหมด [cite: 715, 718]
  async listUsers(): Promise<User[]> {
    const response = await apiClient.get('users/list');
    return response.data;
  },

  // สร้าง User ใหม่ [cite: 704, 706]
  async createUser(userData: User): Promise<User> {
    const response = await apiClient.post('users/create', userData);
    return response.data;
  }
};