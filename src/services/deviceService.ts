// src/services/deviceService.ts
import { sysApi } from "@/utils/apiInstance";

export interface Device {
  id?: string;
  project_id?: string | null;   // <<< เพิ่ม field นี้
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

export interface successMessage {
  message: string;
  status: number;
}

export interface EditDeviceData {
  id?: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

export const deviceService = {
  // ดึงรายการ Device ทั้งหมด
  async listDevices(): Promise<Device[]> {
    const response = await sysApi.get("management/devices");
    const mapData = response.data.map((device: any) => ({
      id: device.id || undefined,
      project_id: device.project_id ?? null,   // <<< map project_id ด้วย
      name: device.model_name || '',
      type: device.device_type || '',
      serialNumber: device.serial_number || '',
      status: device.status || 'Unknown',
    }));
    return mapData;
  },

  async getDeviceById(id: string): Promise<Device> {
    const response = await sysApi.get(`management/devices/${id}`);
    return response.data;
  },

  // สร้าง Device ใหม่
  async createDevice(deviceData: Device): Promise<successMessage> {
    const rawData = {
      modelName: deviceData.name.toUpperCase(),
      deviceType: deviceData.type,
      serialNumber: deviceData.serialNumber.toUpperCase(),
      status: deviceData.status.toUpperCase(),
      ipAddress: "",
    };
    const response = await sysApi.post("management/devices/create", rawData);
    return response.data;
  },

  // อัปเดต Device
  async updateDevice(id: string, deviceData: Device): Promise<successMessage> {
    const rawData = {
      modelName: deviceData.name.toUpperCase(),
      status: deviceData.status.toUpperCase(),
      ipAddress: "",
    };
    const response = await sysApi.patch(`management/devices/${id}`, rawData);
    return response.data;
  },

  // ลบ Device
  async deleteDevice(id: string): Promise<successMessage> {
    const response = await sysApi.delete(`management/devices/${id}`, {});
    return response.data;
  },
};
