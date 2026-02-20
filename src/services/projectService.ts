// src/services/projectService.ts
import { authApi } from "@/utils/apiInstance";
import { successMessage } from "./deviceService";

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

export interface ProjectFormData {
  name: string;
  description: string;
  code: string;
  locationX: string;
  locationY: string;
  status: string;
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
      locationY: user.longitude || 'Unknown',
      status: user.status || 'Unknown',
      assignedUsers: user.members || [],
      assignedDevices: user?.devices || [],
    })); 
    return mapData;
  },

  // สร้าง Project ใหม่
  async createProject(projectData: ProjectFormData): Promise<successMessage> {
    const rawData = {
      name: projectData.name,
      description: projectData.description, 
      code: projectData.code,
      latitude: projectData.locationY,
      longitude: projectData.locationX,
      status: projectData.status,
    }
    const response = await authApi.post('management/projects', rawData);
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

  // กำหนดผู้ใช้ให้กับโครงการ (assign และ unassign)
  async assignUsers(projectId: string, newUserIds: string[], currentUserIds: string[] = []): Promise<void> {
    // หาผู้ใช้ที่ต้อง assign (เพิ่มเข้ามาใหม่)
    const usersToAdd = newUserIds.filter(id => !currentUserIds.includes(id));
    
    // หาผู้ใช้ที่ต้อง unassign (ถูกลบออก)
    const usersToRemove = currentUserIds.filter(id => !newUserIds.includes(id));

    // PATCH: เพิ่มผู้ใช้ใหม่
    if (usersToAdd.length > 0) {
      await authApi.patch(`management/projects/${projectId}/members`, {
        usersId: usersToAdd
      });
    }

    // DELETE: ลบผู้ใช้ที่ uncheck
    if (usersToRemove.length > 0) {
      await authApi.delete(`management/projects/${projectId}/members`, {
        data: { usersId: usersToRemove }
      });
    }
  },

  // กำหนดอุปกรณ์ให้กับโครงการ (assign และ unassign)
  async assignDevices(projectId: string, newDeviceIds: string[], currentDeviceIds: string[] = []): Promise<void> {
    // หาอุปกรณ์ที่ต้อง assign (เพิ่มเข้ามาใหม่)
    const devicesToAdd = newDeviceIds.filter(id => !currentDeviceIds.includes(id));
    
    // หาอุปกรณ์ที่ต้อง unassign (ถูกลบออก)
    const devicesToRemove = currentDeviceIds.filter(id => !newDeviceIds.includes(id));

    // PATCH: เพิ่มอุปกรณ์ใหม่
    if (devicesToAdd.length > 0) {
      await authApi.patch(`management/projects/${projectId}/devices`, {
        devicesId: devicesToAdd
      });
    }

    // DELETE: ลบอุปกรณ์ที่ uncheck
    if (devicesToRemove.length > 0) {
      await authApi.delete(`management/projects/${projectId}/devices`, {
        data: { devicesId: devicesToRemove }
      });
    }
  }
};
