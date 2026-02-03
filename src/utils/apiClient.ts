// src/utils/apiClient.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
  // ฟังก์ชันสำหรับเก็บ Token
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  // ฟังก์ชันสำหรับล้าง Token เมื่อ Logout
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async request(endpoint: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem('access_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    // กรณี Access Token หมดอายุ (401)
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // พยายามดึง Access Token ใหม่โดยใช้ Refresh Token
        try {
          const refreshRes = await fetch(`${BASE_URL}/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const { accessToken: newAccess, refreshToken: newRefresh } = await refreshRes.json();
            this.setTokens(newAccess, newRefresh); // เก็บ Token ใหม่
            
            // ส่ง Request เดิมซ้ำอีกครั้งด้วย Token ใหม่
            return fetch(`${BASE_URL}${endpoint}`, {
              ...options,
              headers: { ...headers, Authorization: `Bearer ${newAccess}` }
            }).then(res => res.json());
          }
        } catch (err) {
          this.clearTokens();
          window.location.assign('/login');
        }
      }
    }

    return response.json();
  },

  get: (url: string) => apiClient.request(url, { method: 'GET' }),
  post: (url: string, data: any) => apiClient.request(url, { method: 'POST', body: JSON.stringify(data) }),
};