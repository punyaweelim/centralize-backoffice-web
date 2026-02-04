import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { userService } from "../../../services/userService";

interface UserFormValues {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// ประเภทข้อมูลสำหรับจัดการ Error Message
interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
}

export function UserForm({ onSuccess }: { onSuccess: () => void }) {
  // State สำหรับเก็บข้อมูล และ Error
  const [values, setValues] = useState<UserFormValues>({
    name: '',
    email: '',
    role: 'user'
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // ฟังก์ชันตรวจสอบความถูกต้อง (Manual Validation)
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.name || values.name.length < 2) {
      newErrors.name = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailRegex.test(values.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        await userService.createUser(values); // เชื่อมต่อกับ Resource Creation Endpoint [cite: 706]
        setValues({ name: '', email: '', role: 'user' });
        onSuccess();
      } catch (error) {
        console.error("Failed to create user", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อ-นามสกุล</Label>
          <Input 
            id="name"
            value={values.name}
            onChange={(e) => setValues({...values, name: e.target.value})}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input 
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues({...values, email: e.target.value})}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      {/* Role Field */}
      <div className="space-y-2">
        <Label>บทบาท (Role)</Label>
        <Select 
          value={values.role} 
          onValueChange={(val: 'admin' | 'user') => setValues({...values, role: val})}
        >
          <SelectTrigger>
            <SelectValue placeholder="เลือกบทบาท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        เพิ่มผู้ใช้งาน
      </Button>
    </form>
  );
}