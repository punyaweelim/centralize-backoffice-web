// src/app/components/ProjectPage.tsx
import React, { useState } from 'react'
import { ProjectForm } from './page/ProjectForm'
import { ProjectList } from './page/ProjectList'

const ProjectPage = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // ฟังก์ชันสำหรับ Refresh ข้อมูลใน Table หลังจากสร้าง Project ใหม่สำเร็จ
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">จัดการโครงการ</h1>
        <p className="text-muted-foreground">เพิ่มและตรวจสอบรายการโครงการในระบบของคุณ</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">เพิ่มโครงการใหม่</h2>
        <ProjectForm onSuccess={handleSuccess} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">รายการโครงการทั้งหมด</h2>
        <ProjectList refreshKey={refreshKey} />
      </div>
    </div>
  )
}

export default ProjectPage
