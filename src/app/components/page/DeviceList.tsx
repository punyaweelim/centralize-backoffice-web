// src/app/components/page/DeviceList.tsx
"use client"

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "../ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"
import { deviceService, Device } from '../../../services/deviceService'
import { projectService, Project } from '../../../services/projectService'
import { Pencil, Trash, FolderKanban, AlertCircle } from 'lucide-react'
import { showSuccessPopup, showConfirmPopup } from "@/utils/alertPopup"

export function DeviceList({
  refreshKey,
  onEdit,
}: {
  refreshKey: number
  onEdit: (device: Device) => void
}) {
  const [devices, setDevices] = useState<Device[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getProjectName = (projectId: string | null | undefined): string | null => {
    if (!projectId) return null
    const found = projects.find((p) => p.id === projectId)
    return found ? found.name : projectId
  }

  const fetchDevices = async () => {
    try {
      setIsLoading(true)
      const [deviceRes, projectRes] = await Promise.all([
        deviceService.listDevices(),
        projectService.listProjects(),
      ])

      if (Array.isArray(deviceRes)) {
        setDevices(deviceRes)
        setError(null)
      } else {
        setDevices([])
        setError("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง")
      }

      setProjects(projectRes)
    } catch (err: any) {
      setDevices([])
      console.error('Error fetching devices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [refreshKey])

  const handleDeleteDevice = async (id: string) => {
    const res = await showConfirmPopup("คุณแน่ใจหรือว่าต้องการลบอุปกรณ์นี้")
    if (!res.isConfirmed) return

    const deleteRes = await deviceService.deleteDevice(id)
    if (deleteRes.status === 200) {
      showSuccessPopup(deleteRes.message)
      setDevices([])
      fetchDevices()
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VMS':    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Sensor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ETC':    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:       return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // ─── StatusBadge ─────────────────────────────────────────────────────────────
  // ไม่ใช้ asChild เพราะ Badge (span) ไม่ forward ref → Tooltip ไม่ทำงาน
  // ใช้ div wrapper บน TooltipTrigger แทน และใส่ cursor-help ที่ wrapper
  // ─────────────────────────────────────────────────────────────────────────────
  const StatusBadge = ({ device }: { device: Device }) => {
    const status = device.status?.toUpperCase()

    if (status === 'AVAILABLE' || status === 'AVALIABLE') {
      return <Badge variant="default">{device.status}</Badge>
    }

    if (status === 'MAINTENANCE' || status === 'RETIRED') {
      return <Badge variant="destructive">{device.status}</Badge>
    }

    if (status === 'ASSIGNED') {
      const projectName = getProjectName(device.project_id)

      // ASSIGNED + ไม่มี project → badge แดง
      if (!projectName) {
        return (
          <Tooltip>
            <TooltipTrigger>
              <div className="inline-flex cursor-help">
                <Badge className="bg-red-600 hover:bg-red-700 text-white gap-1 pointer-events-none select-none">
                  <AlertCircle className="h-3 w-3" />
                  {device.status}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">ไม่พบโครงการที่ผูกไว้</p>
            </TooltipContent>
          </Tooltip>
        )
      }

      // ASSIGNED + มี project → tooltip ชื่อโครงการ
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-flex cursor-help">
              <Badge variant="secondary" className="gap-1 pointer-events-none select-none">
                <FolderKanban className="h-3 w-3" />
                {device.status}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[220px]">
            <div className="flex items-center gap-1.5 text-xs">
              <FolderKanban className="h-3 w-3 shrink-0" />
              <span>โครงการ: <strong>{projectName}</strong></span>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }

    return <Badge variant="outline">{device.status}</Badge>
  }

  if (isLoading) return <div className="py-10 text-center text-muted-foreground">กำลังโหลดข้อมูล...</div>
  if (error)     return <div className="py-10 text-center text-destructive">{error}</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px]">ชื่ออุปกรณ์</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead>การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                ไม่พบข้อมูลอุปกรณ์
              </TableCell>
            </TableRow>
          ) : (
            devices.map((device) => (
              <TableRow key={device.id || device.serialNumber}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getTypeColor(device.type)}`}>
                    {device.type}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm">{device.serialNumber}</TableCell>
                <TableCell className="text-center">
                  <StatusBadge device={device} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-left gap-2">
                    <Pencil
                      onClick={() => onEdit(device)}
                      size={16}
                      className="hover:text-blue-500 cursor-pointer transition-colors"
                    />
                    <Trash
                      onClick={() => handleDeleteDevice(device.id || '')}
                      size={16}
                      className="hover:text-destructive cursor-pointer transition-colors"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
