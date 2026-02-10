// src/app/components/page/UserList.tsx
"use client"

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { userService, User } from '../../../services/userService'
import { AlertCircle, Users, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'

export function UserList({ refreshKey }: { refreshKey: number }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก GET /users เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userService.listUsers()
      
      // ตรวจสอบว่า data เป็น array หรือไม่
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.warn('Received non-array data:', data)
        setUsers([])
        setError("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง")
      }
    } catch (err: any) {
      const errorMessage = err?.message || "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้"
      setError(errorMessage)
      setUsers([]) // ตั้งค่าเป็น array ว่าง
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshKey])

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-md border bg-white p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUsers}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            ลองใหม่อีกครั้ง
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Empty State
  if (users.length === 0) {
    return (
      <div className="rounded-md border bg-white p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Users className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">ยังไม่มีผู้ใช้งานในระบบ</h3>
            <p className="text-muted-foreground text-sm">
              เริ่มต้นโดยการเพิ่มผู้ใช้งานคนแรกของคุณด้านบน
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Success State with Data
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[200px]">ชื่อ-นามสกุล</TableHead>
            <TableHead>อีเมล</TableHead>
            <TableHead>บทบาท</TableHead>
            <TableHead className="text-right">สถานะ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id || user.email || index}>
<<<<<<< HEAD
              <TableCell className="font-medium">{user.firstName || '-'}</TableCell>
=======
              <TableCell className="font-medium">{user.name || '-'}</TableCell>
>>>>>>> 6950cfc1fe59e028e15fc2fc498457450164e697
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                  {user.role || 'user'}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-green-600 font-medium">
                Active
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
