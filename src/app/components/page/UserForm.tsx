// src/app/components/page/UserForm.tsx
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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { userService } from "../../../services/userService";
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { showSuccessPopup, showWarningPopup } from "@/utils/alertPopup";


interface UserFormValues {
  name: string;
  email: string;
  role: 'sysAdmin';
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
}

export function UserForm({ onSuccess }: { onSuccess: () => void }) {
  const [values, setValues] = useState<UserFormValues>({
    name: '',
    email: '',
    role: 'sysAdmin'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name || values.name.trim().length < 2) {
      newErrors.name = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailRegex.test(values.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!values.role) {
      newErrors.role = "กรุณาเลือกบทบาท";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await userService.createUser(values);

      if (res.status === 200 || res.status === 201) {
        showSuccessPopup(res.message);
        setValues({ name: '', email: '', role: 'sysAdmin' });
        onSuccess();
      } else {
        showWarningPopup(res.message);
      }

      setErrors({});
    } catch (error: any) {
      console.error("Failed to create user", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {submitSuccess && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            เพิ่มผู้ใช้งานสำเร็จแล้ว!
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* ✅ เปลี่ยนจาก bg-white → bg-card เพื่อรองรับ Dark mode */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              ชื่อ-นามสกุล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => {
                setValues({ ...values, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={errors.name ? "border-destructive" : ""}
              placeholder="กรอกชื่อ-นามสกุล"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              อีเมล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => {
                setValues({ ...values, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={errors.email ? "border-destructive" : ""}
              placeholder="example@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <Label>
            บทบาท (Role) <span className="text-destructive">*</span>
          </Label>
          <Select
            value={values.role}
            onValueChange={(val: 'sysAdmin') => {
              setValues({ ...values, role: val });
              if (errors.role) setErrors({ ...errors, role: undefined });
            }}
            disabled
          >
            <SelectTrigger className={errors.role ? "border-destructive" : ""}>
              <SelectValue placeholder="เลือกบทบาท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sysAdmin">System Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.role}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            'เพิ่มผู้ใช้งาน'
          )}
        </Button>
      </form>
    </div>
  );
}
