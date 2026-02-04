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
  async verifyToken() {
    // 1. ดึง access_token ที่เก็บไว้ (ตัวอย่างจาก localStorage)
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error("No token found");
    }

    // 2. ส่ง request ไปที่ /verify?token=...
    // การใช้ Query String ใน URL จะเริ่มหลังเครื่องหมาย ? [cite: 464]
    try {
      const response = await apiClient.get(`/verify?token=${accessToken}`);
      return response.data;
    } catch (error) {
      console.error("Verification failed", error);
      throw error;
    }
  }
};