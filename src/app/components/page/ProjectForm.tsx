// src/app/components/page/ProjectForm.tsx
import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { projectService } from "../../../services/projectService";
import { showSuccessPopup, showWarningPopup } from "@/utils/alertPopup";

interface ProjectFormValues {
  name: string;
  description: string;
  code: string;
  locationX: string;
  locationY: string;
  status: 'Active' | 'On Hold' | 'Completed';
}

// ประเภทข้อมูลสำหรับจัดการ Error Message
interface FormErrors {
  name?: string;
  description?: string;
  code?: string;
  locationX?: string;
  locationY?: string;
}

export function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
  // State สำหรับเก็บข้อมูล และ Error
  const [values, setValues] = useState<ProjectFormValues>({
    name: '',
    description: '',
    code: '',
    locationX: '',
    locationY: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ฟังก์ชันตรวจสอบความถูกต้อง (Manual Validation)
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.name || values.name.length < 3) {
      newErrors.name = "ชื่อโครงการต้องมีอย่างน้อย 3 ตัวอักษร";
    }
    
    if (!values.description || values.description.length < 10) {
      newErrors.description = "คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร";
    }

    if (!values.code || values.code.length < 2) {
      newErrors.code = "รหัสโครงการต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    // ตรวจสอบพิกัด
    const lat = parseFloat(values.locationX);
    const lng = parseFloat(values.locationY);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.locationX = "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90";
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.locationY = "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        setIsSubmitting(true);
        console.log('value', values);
        
        const res = await projectService.createProject(values);
         if (res.status === 201) {
                showSuccessPopup(res.message);
                 setValues({ 
          name: '', 
          description: '', 
          code: '', 
          locationX: '', 
          locationY: '', 
          status: 'Active' 
        });
                onSuccess();
              }
       
        // setErrors({});
        // onSuccess();
      } catch (error) {
        console.error("Failed to create project", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อโครงการ</Label>
          <Input 
            id="name"
            value={values.name}
            onChange={(e) => setValues({...values, name: e.target.value})}
            placeholder="เช่น โครงการทางหลวงสายเอเชีย"
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code">รหัสโครงการ</Label>
          <Input 
            id="code"
            value={values.code}
            onChange={(e) => setValues({...values, code: e.target.value})}
            placeholder="เช่น PRJ-2024-001"
            className={errors.code ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียดโครงการ</Label>
        <Textarea 
          id="description"
          value={values.description}
          onChange={(e) => setValues({...values, description: e.target.value})}
          placeholder="อธิบายรายละเอียดของโครงการ..."
          className={errors.description ? "border-red-500" : ""}
          disabled={isSubmitting}
          rows={3}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location X (Latitude) */}
        <div className="space-y-2">
          <Label htmlFor="locationX">ละติจูด (Latitude)</Label>
          <Input 
            id="locationX"
            type="number"
            step="0.000001"
            value={values.locationX}
            onChange={(e) => setValues({...values, locationX: e.target.value})}
            placeholder="13.7563"
            className={errors.locationX ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.locationX && <p className="text-xs text-red-500">{errors.locationX}</p>}
        </div>

        {/* Location Y (Longitude) */}
        <div className="space-y-2">
          <Label htmlFor="locationY">ลองจิจูด (Longitude)</Label>
          <Input 
            id="locationY"
            type="number"
            step="0.000001"
            value={values.locationY}
            onChange={(e) => setValues({...values, locationY: e.target.value})}
            placeholder="100.5018"
            className={errors.locationY ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.locationY && <p className="text-xs text-red-500">{errors.locationY}</p>}
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label>สถานะ</Label>
          <Select 
            value={values.status} 
            onValueChange={(val: 'Active' | 'On Hold' | 'Completed') => setValues({...values, status: val})}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มโครงการ'}
      </Button>
    </form>
  );
}
