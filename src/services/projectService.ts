// src/services/projectService.ts
import { apiClient } from '../utils/apiClient';

export interface Project {
  id?: string;
  name: string;
  description: string;
  code: string;
  locationX: string;
  locationY: string;
  status: string;
  assignedUsers?: string[];
  assignedDevices?: string[];
}

export const projectService = {
  // ดึงรายการ Project ทั้งหมด
  async listProjects(): Promise<Project[]> {
    const response = await apiClient.get('projects/list');
    return response.data;
  },

  // สร้าง Project ใหม่
  async createProject(projectData: Project): Promise<Project> {
    const response = await apiClient.post('projects/create', projectData);
    return response.data;
  },

  // อัปเดต Project
  async updateProject(id: string, projectData: Project): Promise<Project> {
    const response = await apiClient.post(`projects/update/${id}`, projectData);
    return response.data;
  },

  // ลบ Project
  async deleteProject(id: string): Promise<void> {
    await apiClient.post(`projects/delete/${id}`, {});
  },

  // กำหนดผู้ใช้ให้กับโครงการ
  async assignUsers(projectId: string, userIds: string[]): Promise<void> {
    await apiClient.post(`projects/${projectId}/assign-users`, { userIds });
  },

  // กำหนดอุปกรณ์ให้กับโครงการ
  async assignDevices(projectId: string, deviceIds: string[]): Promise<void> {
    await apiClient.post(`projects/${projectId}/assign-devices`, { deviceIds });
  }
};
