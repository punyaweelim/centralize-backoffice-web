// src/app/components/page/ProjectList.tsx
"use client"

import React, { useEffect, useState } from 'react'
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { projectService, Project } from '../../../services/projectService'
import { userService, User } from '../../../services/userService'
import { deviceService, Device } from '../../../services/deviceService'
import { MapPin, UserPlus, HardDrive } from 'lucide-react'
import { showSuccessPopup, showWarningPopup } from '@/utils/alertPopup'

export function ProjectList({ refreshKey }: { refreshKey: number }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeviceModal, setShowDeviceModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([])

  // ดึงข้อมูลโครงการ
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await projectService.listProjects()
        console.log('Response from projectService.listProjects():', data)
        setProjects(data)
        setError(null)
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลโครงการได้")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [refreshKey])

  // ดึงข้อมูลผู้ใช้งานและอุปกรณ์
  useEffect(() => {
    const fetchUsersAndDevices = async () => {
      try {
        const [usersData, devicesData] = await Promise.all([
          userService.listUsers(),
          deviceService.listDevices()
        ])
        setUsers(usersData)
        setDevices(devicesData)
      } catch (err) {
        console.error('Error fetching users/devices:', err)
      }
    }

    fetchUsersAndDevices()
  }, [])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default'
      case 'On Hold':
        return 'secondary'
      case 'Completed':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // เปิด Modal เพิ่มผู้ใช้งาน
  const handleOpenUserModal = (project: Project) => {
    setSelectedProject(project)
    setSelectedUserIds(project.assignedUsers || [])
    setShowUserModal(true)
  }

  // เปิด Modal เพิ่มอุปกรณ์
  const handleOpenDeviceModal = (project: Project) => {
    setSelectedProject(project)
    setSelectedDeviceIds(project.assignedDevices || [])
    setShowDeviceModal(true)
  }

  // Toggle User Selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Toggle Device Selection
  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDeviceIds(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    )
  }

  // Submit เพิ่มผู้ใช้งาน
  const handleSubmitUsers = async () => {
    if (!selectedProject?.id) return

    try {
      const currentUserIds = selectedProject.assignedUsers || []
      await projectService.assignUsers(selectedProject.id, selectedUserIds, currentUserIds)
      showSuccessPopup('บันทึกผู้ใช้งานสำเร็จ')
      setShowUserModal(false)

      // Refresh project list
      const updatedProjects = await projectService.listProjects()
      setProjects(updatedProjects)
    } catch (error) {
      console.error('Error assigning users:', error)
      showWarningPopup('ไม่สามารถบันทึกผู้ใช้งานได้')
    }
  }

  // Submit เพิ่มอุปกรณ์
  const handleSubmitDevices = async () => {
    if (!selectedProject?.id) return

    try {
      const currentDeviceIds = selectedProject.assignedDevices || []
      await projectService.assignDevices(selectedProject.id, selectedDeviceIds, currentDeviceIds)
      showSuccessPopup('บันทึกอุปกรณ์สำเร็จ')
      setShowDeviceModal(false)

      // Refresh project list
      const updatedProjects = await projectService.listProjects()
      setProjects(updatedProjects)
    } catch (error) {
      console.error('Error assigning devices:', error)
      showWarningPopup('ไม่สามารถบันทึกอุปกรณ์ได้')
    }
  }

  if (isLoading) return <div className="py-10 text-center">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>

  return (
    <>
      <div className="space-y-4">
        {/* Card View for Projects */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id || project.code} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{project.code}</p>
                  </div>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{project.locationX}, {project.locationY}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      ผู้ใช้: {project.assignedUsers?.length || 0} คน
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      อุปกรณ์: {project.assignedDevices?.length || 0} เครื่อง
                    </p>
                  </div>
                </div>

                {/* ปุ่มเพิ่มผู้ใช้งานและอุปกรณ์ */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenUserModal(project)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    เพิ่มผู้ใช้
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDeviceModal(project)}
                  >
                    <HardDrive className="h-4 w-4 mr-1" />
                    เพิ่มอุปกรณ์
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            ไม่พบข้อมูลโครงการ
          </div>
        )}
      </div>

      {/* Modal เพิ่มผู้ใช้งาน */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มผู้ใช้งานในโครงการ</DialogTitle>
            <DialogDescription>
              {selectedProject?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                ไม่พบผู้ใช้งานในระบบ
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <Checkbox
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmitUsers}>
              บันทึก ({selectedUserIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal เพิ่มอุปกรณ์ */}
      <Dialog open={showDeviceModal} onOpenChange={setShowDeviceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มอุปกรณ์ในโครงการ</DialogTitle>
            <DialogDescription>
              {selectedProject?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
            {devices.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">
                ไม่พบอุปกรณ์ในระบบ
              </p>
            ) : (
              devices.map((device) => {
                if (device.status == 'AVAILABLE') {
                  return (
                    <div
                      key={device.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleDeviceSelection(device.id || '')}
                    >
                      <Checkbox
                        checked={selectedDeviceIds.includes(device.id || '')}
                        onCheckedChange={() => toggleDeviceSelection(device.id || '')}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.type} - {device.serialNumber}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  )
                }
                if (device.status == 'ASSIGNED') {
                  return (
                    <div
                      key={device.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleDeviceSelection(device.id || '')}
                    >
                      <Checkbox
                        checked={selectedDeviceIds.includes(device.id || '')}
                        onCheckedChange={() => toggleDeviceSelection(device.id || '')}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.type} - {device.serialNumber}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  )
                }
              }
              ))

            }
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeviceModal(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmitDevices}>
              บันทึก ({selectedDeviceIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
