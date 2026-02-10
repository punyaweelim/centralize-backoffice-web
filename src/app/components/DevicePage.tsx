// src/app/components/DevicePage.tsx
import React, { useState } from 'react'
import { DeviceForm } from './page/DeviceForm'
import { DeviceList } from './page/DeviceList'

const DevicePage = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // ฟังก์ชันสำหรับ Refresh ข้อมูลใน Table หลังจากสร้าง Device ใหม่สำเร็จ
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">จัดการอุปกรณ์</h1>
        <p className="text-muted-foreground">เพิ่มและตรวจสอบรายการอุปกรณ์ในระบบของคุณ</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">เพิ่มอุปกรณ์ใหม่</h2>
        <DeviceForm onSuccess={handleSuccess} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">รายการอุปกรณ์ทั้งหมด</h2>
        <DeviceList refreshKey={refreshKey} />
      </div>
    </div>
  )
}

export default DevicePage
