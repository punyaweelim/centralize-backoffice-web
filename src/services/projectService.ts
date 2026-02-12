// src/services/projectService.ts
// import { apiClient } from '../utils/apiClient';
import { authApi } from "@/utils/apiInstance";


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
    const response = await authApi.get("management/projects");
     const mapData = response.data.data.map((user: any) => ({
      id: user.id || undefined,
      name: user.name || '',
      description: user.description || '',
      code: user.code || 'Unknown',
      locationX: user.latitude || 'Unknown',
      locationY: user.longitude  || 'Unknown',
      status: user.status || 'Unknown',
      assignedUsers: user.members || [],
      assignedDevices: user?.devices || [],
    })); 
    return mapData;
  },

  // สร้าง Project ใหม่
  async createProject(projectData: Project): Promise<Project> {
    const response = await authApi.post('projects/create', projectData);
    return response.data;
  },

  // อัปเดต Project
  async updateProject(id: string, projectData: Project): Promise<Project> {
    const response = await authApi.post(`projects/update/${id}`, projectData);
    return response.data;
  },

  // ลบ Project
  async deleteProject(id: string): Promise<void> {
    await authApi.post(`projects/delete/${id}`, {});
  },

  // กำหนดผู้ใช้ให้กับโครงการ
  async assignUsers(projectId: string, userIds: string[]): Promise<void> {
    await authApi.post(`projects/${projectId}/assign-users`, { userIds });
  },

  // กำหนดอุปกรณ์ให้กับโครงการ
  async assignDevices(projectId: string, deviceIds: string[]): Promise<void> {
    await authApi.post(`projects/${projectId}/assign-devices`, { deviceIds });
  }
};
