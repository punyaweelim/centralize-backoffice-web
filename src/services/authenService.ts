// src/services/authenService.ts
import { apiClient } from '../utils/apiClient';

export const authenService = {
  /**
   * เข้าสู่ระบบด้วย Email และ Password
   * [cite: 840, 847]
   */
  login: async (credentials: object) => {
    return await apiClient.post('auth/login', credentials);
  },

  /**
   * ออกจากระบบโดยการล้าง Session/Token
   * [cite: 864, 892]
   */
  logout: async () => {
    return await apiClient.post('auth/logout', {});
  },

  /**
   * ต่ออายุ Access Token (Renew Access Token)
   */
  refreshToken: async () => {
    return await apiClient.post('auth/refresh-token', {});
  },

  /**
   * ตรวจสอบความถูกต้องของ Access Token ในปัจจุบัน
   * [cite: 883, 886]
   */
  verifyToken: async () => {
    return await apiClient.get('auth/verify');
  }
};