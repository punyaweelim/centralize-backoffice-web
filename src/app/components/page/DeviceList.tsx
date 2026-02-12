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
import { Icon, Pencil, Trash } from 'lucide-react'

export function DeviceList({ refreshKey }: { refreshKey: number }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [device, setDeviceId] = useState<Device>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก GET /devices เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
  // useEffect(() => {
  //   const fetchDevices = async () => {
  //     try {
  //       setIsLoading(true)
  //       const data = await deviceService.listDevices()
  //       console.log('data', data);
        
  //       setDevices(data)
  //       setError(null)
  //     } catch (err) {
  //       setError("ไม่สามารถโหลดข้อมูลอุปกรณ์ได้")
  //       console.error(err)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchDevices()
  // }, [refreshKey])
  // ดึงข้อมูลจาก GET /users เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
    const fetchDevices = async () => {
      try {
        setIsLoading(true)
        const res = await deviceService.listDevices()
        console.log('Response from deviceService.listDevices():', res);
        
        // ตรวจสอบว่า data เป็น array หรือไม่
        if (Array.isArray(res)) {
          setDevices(res)
        setError(null)
        } else {
          console.warn('Received non-array data:', res)
          setDevices([])
          setError("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง")
        }
      } catch (err: any) {
        // const errorMessage = err?.message || "ไม่สามารถโหลดข้อมูลอุปกรณ์ได้"
        // setError(errorMessage)
        setDevices([]) // ตั้งค่าเป็น array ว่าง
        console.error('Error fetching devices:', err)
      } finally {
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      fetchDevices()
    }, [refreshKey])


  const fetchDevicesID = async (id: string) => {
      try {
        setIsLoading(true)
        const data = await deviceService.getDeviceById(id)
        console.log('data', data);
        setDeviceId(data)
        setError(null)
      } catch (err) {
        // setError("ไม่สามารถโหลดข้อมูลอุปกรณ์ได้")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }


    const handleDeleteDevice = async (id: string) => {
      try {
        setIsLoading(true)  
        await deviceService.deleteDevice(id)
        fetchDevices() // รีเฟรชรายการอุปกรณ์หลังจากลบ
      } catch (err) {
        setError("ไม่สามารถลบอุปกรณ์ได้")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

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
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead >การจัดการ</TableHead>
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
                <TableCell className="text-center">
                  <Badge variant={getStatusVariant(device.status)}>
                    {device.status}
                  </Badge>
                </TableCell>
                 <TableCell className="text-center">
                  <div className="flex justify-left gap-2">
                  <a onClick={() => fetchDevicesID(device.id || '')}><Pencil name="pencil" size={16} className="hover:text-blue-700 cursor-pointer" /></a>
                  <a onClick={() => handleDeleteDevice(device.id || '')}><Trash name="trash-2" size={16} className="hover:text-red-700 cursor-pointer" /></a>
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
