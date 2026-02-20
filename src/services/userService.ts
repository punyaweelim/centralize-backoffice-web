// src/services/userService.ts
import { extend } from "leaflet";
import { apiClient } from "../utils/apiClient";
import { authApi } from "@/utils/apiInstance";
import { successMessage } from "./deviceService";

export interface User {
  // createdAt: string;
  email: string;
  name: string;
  id: string;
  status: boolean;
  // lastLogin: string;
  // lastName: string;
  role: string;
  // updatedAt: string;
}

export interface createUser {
  name: string;
  email: string;
  role: string;
}

export const userService = {
  // ดึงรายการ User ทั้งหมด
  async listUsers(): Promise<User[]> {
    try {
      const response = await authApi.get("management/users");

      console.log("Response from API:", response.data);

       const mapData = response.data.data.map((user: any) => ({
      id: user.id || '',
      email: user.email || undefined,
      name: user.firstName + ' ' + user.lastName || '',
      role: user.role || '',
      status: user.status || 'Unknown'
    }));  

      // ตรวจสอบว่า response มี data หรือไม่
      // if (!response) {
      //   console.warn("Empty response from API");
      //   return [];
      // }

      // ตรวจสอบว่า response.data เป็น array หรือไม่
      // if (Array.isArray(response.data)) {
        // console.log("Response data is an array:", response.data);
        
        return mapData
      // }

      // กรณี response เป็น array โดยตรง
      // if (Array.isArray(response)) {
      //   return response.data;
      // }

      // console.warn("Unexpected response format:", response);
      // return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // สร้าง User ใหม่
  async createUser(userData: createUser): Promise<successMessage> {
    try {
      const response = await authApi.post("management/users", userData);

      // ตรวจสอบว่ามี data ใน response หรือไม่
      if (response.data) {
        return response.data;
      }

      // กรณี response เป็น object โดยตรง
      // if (response.email) {
      //   return response;
      // }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
};
