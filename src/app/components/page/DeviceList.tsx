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
import { deviceService, Device } from '../../../services/deviceService'

export function DeviceList({ refreshKey }: { refreshKey: number }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก GET /devices เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true)
        const data = await deviceService.listDevices()
        setDevices(data)
        setError(null)
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลอุปกรณ์ได้")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [refreshKey])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default'
      case 'Inactive':
        return 'secondary'
      case 'Maintenance':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VMS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Sensor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ETC':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (isLoading) return <div className="py-10 text-center">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px]">ชื่ออุปกรณ์</TableHead>
            <TableHead>ประเภท</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead className="text-right">สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
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
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(device.status)}>
                    {device.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
