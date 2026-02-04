// src/app/components/UserList.tsx
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
import { userService, User } from '../../../services/userService'

export function UserList({ refreshKey }: { refreshKey: number }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก GET /users เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const data = await userService.listUsers()
        setUsers(data)
        setError(null)
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [refreshKey])

  if (isLoading) return <div className="py-10 text-center">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>

  return (
    <div className="rounded-md border">
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                ไม่พบข้อมูลผู้ใช้งาน
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  Active
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}