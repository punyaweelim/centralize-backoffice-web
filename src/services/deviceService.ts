// src/services/deviceService.ts
import { apiClient } from '../utils/apiClient';

export interface Device {
  id?: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

export const deviceService = {
  // ดึงรายการ Device ทั้งหมด
  async listDevices(): Promise<Device[]> {
    const response = await apiClient.get('devices/list');
    return response.data;
  },

  // สร้าง Device ใหม่
  async createDevice(deviceData: Device): Promise<Device> {
    const response = await apiClient.post('devices/create', deviceData);
    return response.data;
  },

  // อัปเดต Device
  async updateDevice(id: string, deviceData: Device): Promise<Device> {
    const response = await apiClient.post(`devices/update/${id}`, deviceData);
    return response.data;
  },

  // ลบ Device
  async deleteDevice(id: string): Promise<void> {
    await apiClient.post(`devices/delete/${id}`, {});
  }
};
