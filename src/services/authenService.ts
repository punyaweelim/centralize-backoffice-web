// src/services/authenService.ts
import { apiClient } from '../utils/apiClient';

export const authenService = {
  /**
   * เข้าสู่ระบบด้วย Email และ Password
   */
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // ตรวจสอบว่ามี tokens ใน response
      const accessToken = response.access_token || response.accessToken;
      const refreshToken = response.refresh_token || response.refreshToken;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid login response from server');
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error?.message || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
    }
  },

  /**
   * ออกจากระบบโดยการล้าง Session/Token
   */
  logout: async () => {
    try {
      // เรียก logout API (ถ้ามี) เพื่อ invalidate refresh token ที่ server
      await apiClient.post('/auth/logout', {}).catch(() => {
        // ถ้า API ล้มเหลว ก็ยังต้อง clear local tokens
        console.log('Logout API failed, but clearing local tokens anyway');
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      apiClient.clearTokens();
    }
  },

  /**
   * ต่อายุ Access Token (Renew Access Token)
   * หมายเหตุ: ฟังก์ชันนี้ถูกเรียกโดย apiClient.ts อัตโนมัติเมื่อได้ 401
   * แต่สามารถเรียกใช้งานด้วยตนเองได้ถ้าต้องการ
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh-token', { 
        refreshToken 
      });

      const newAccessToken = response.access_token || response.accessToken;
      const newRefreshToken = response.refresh_token || response.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Invalid token response from server');
      }

      apiClient.setTokens(newAccessToken, newRefreshToken);
      return response;
    } catch (error: any) {
      console.error('Refresh token error:', error);
      apiClient.clearTokens();
      throw new Error(error?.message || 'Session expired. Please login again.');
    }
  },

  /**
   * ตรวจสอบว่ามี valid tokens หรือไม่ (ตรวจสอบแบบ local only)
   * ไม่ได้เรียก API เพราะการตรวจสอบจริงๆ จะเกิดเมื่อเรียก API ใดๆ
   */
  hasValidTokens: (): boolean => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
  },

  /**
   * ดึง current user จาก API
   * ใช้เป็นการทดสอบว่า token ยังใช้งานได้หรือไม่
   * ถ้า token หมดอายุ apiClient จะ refresh อัตโนมัติ
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data || response;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};
