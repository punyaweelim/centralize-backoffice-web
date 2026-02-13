// src/services/deviceService.ts
import { sysApi } from "@/utils/apiInstance";

export interface Device {
  id?: string;
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
      name: device.model_name || '',
      type: device.device_type || '',
      serialNumber: device.serial_number || '',
      status: device.status || 'Unknown'
    }));  
    return mapData;
  },

  async getDeviceById(id: string): Promise<Device> {
    const response = await sysApi.get(`management/devices/${id}`);
    // const mapData = response.data.map((device: any) => ({
    //   id: device.id || undefined,
    //   name: device.model_name || '',
    //   type: device.device_type || '',
    //   serialNumber: device.serial_number || '',
    //   status: device.status || 'Unknown'
    // }));  
    return response.data;
  },

  // สร้าง Device ใหม่
  async createDevice(deviceData: Device): Promise<successMessage> {
    const rawData = {
      model_name: deviceData.name.toUpperCase(),
      device_type: deviceData.type,
      serial_number: deviceData.serialNumber.toUpperCase(),
      status: deviceData.status.toUpperCase(),
      ip_address: "",
    }
    const response = await sysApi.post("management/devices/create", rawData);
    return response.data;
  },

  // อัปเดต Device
  async updateDevice(id: string, deviceData: Device): Promise<successMessage> {
    const rawData = {
      model_name: deviceData.name.toUpperCase(),
      status: deviceData.status.toUpperCase(),
      ip_address: "",
    }
    const response = await sysApi.patch(`management/devices/${id}`, rawData);
    return response.data;
  },

  // ลบ Device
  async deleteDevice(id: string): Promise<successMessage> {
    const response = await sysApi.delete(`management/devices/${id}`, {});
    return response.data;
  },
};

// // src/services/deviceService.ts
// import { apiClient } from '../utils/apiClient';

// export interface Device {
//   id?: string;
//   name: string;
//   type: string;
//   serialNumber: string;
//   status: string;
// }

// export const deviceService = {
//   // ดึงรายการ Device ทั้งหมด
//   async listDevices(): Promise<Device[]> {
//     const response = await apiClient.get('devices/list');
//     return response.data;
//   },

//   // สร้าง Device ใหม่
//   async createDevice(deviceData: Device): Promise<Device> {
//     const response = await apiClient.post('devices/create', deviceData);
//     return response.data;
//   },

//   // อัปเดต Device
//   async updateDevice(id: string, deviceData: Device): Promise<Device> {
//     const response = await apiClient.post(`devices/update/${id}`, deviceData);
//     return response.data;
//   },

//   // ลบ Device
//   async deleteDevice(id: string): Promise<void> {
//     await apiClient.post(`devices/delete/${id}`, {});
//   }
// };
