// src/app/components/UserPage.tsx
import React, { useState } from 'react'
import { UserForm } from './page/UserForm'
import { UserList } from './page/UserList'
import ErrorBoundary from './ErrorBoundary'

const UserPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // ฟังก์ชันสำหรับ Refresh ข้อมูลใน Table หลังจากสร้าง User ใหม่สำเร็จ
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">จัดการผู้ใช้งาน</h1>
          <p className="text-muted-foreground">เพิ่มและตรวจสอบรายชื่อผู้ใช้งานในระบบของคุณ</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">เพิ่มผู้ใช้งานใหม่</h2>
          <UserForm onSuccess={handleSuccess} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">รายชื่อผู้ใช้งานทั้งหมด</h2>
          <UserList refreshKey={refreshKey} />
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default UserPage
