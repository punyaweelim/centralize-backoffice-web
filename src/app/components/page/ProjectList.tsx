// src/app/components/page/ProjectList.tsx
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
import { Card, CardContent } from "../ui/card"
import { projectService, Project } from '../../../services/projectService'
import { MapPin } from 'lucide-react'

export function ProjectList({ refreshKey }: { refreshKey: number }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ดึงข้อมูลจาก GET /projects เมื่อโหลดหน้าหรือเมื่อมีการแจ้ง refresh
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await projectService.listProjects()
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

  if (isLoading) return <div className="py-10 text-center">กำลังโหลดข้อมูล...</div>
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      {/* Card View for Projects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id || project.code} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
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

              {project.assignedUsers && project.assignedUsers.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    ผู้ใช้: {project.assignedUsers.length} คน
                  </p>
                </div>
              )}

              {project.assignedDevices && project.assignedDevices.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    อุปกรณ์: {project.assignedDevices.length} เครื่อง
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          ไม่พบข้อมูลโครงการ
        </div>
      )}

      {/* Table View (Optional - can be toggled) */}
      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ชื่อโครงการ</TableHead>
              <TableHead>รหัส</TableHead>
              <TableHead>ตำแหน่ง</TableHead>
              <TableHead className="text-right">สถานะ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  ไม่พบข้อมูลโครงการ
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id || project.code}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{project.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{project.code}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {parseFloat(project.locationX).toFixed(4)}, {parseFloat(project.locationY).toFixed(4)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
