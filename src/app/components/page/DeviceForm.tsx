// src/app/components/page/DeviceForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { deviceService } from "../../../services/deviceService";
import { showSuccessPopup, showWarningPopup } from "@/utils/alertPopup";

interface DeviceFormValues {
  name: string;
  type: "VMS" | "Sensor" | "ETC" | "";
  serialNumber: string;
  status: "Available" | "Maintenance" | "Retired" | "Assigned";
}

export interface Device {
  id?: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

// ประเภทข้อมูลสำหรับจัดการ Error Message
interface FormErrors {
  name?: string;
  type?: string;
  serialNumber?: string;
  status?: string;
}

export function DeviceForm({
  onSuccess,
  selectedDevice,
  onClearSelected,
}: {
  onSuccess: () => void;
  selectedDevice?: Device | null;
  onClearSelected: () => void;
}) {
  // State สำหรับเก็บข้อมูล และ Error
  const [values, setValues] = useState<DeviceFormValues>({
    name: "",
    type: "",
    serialNumber: "",
    status: "Available",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  if (!selectedDevice) return; // <<< THIS LINE IS CRITICAL

  const statusMap: Record<string, DeviceFormValues["status"]> = {
    AVAILABLE: "Available",
    MAINTENANCE: "Maintenance",
    RETIRED: "Retired",
    ASSIGNED: "Assigned",
  };

  const typeMap: Record<string, DeviceFormValues["type"]> = {
    VMS: "VMS",
    SENSOR: "Sensor",
    ETC: "ETC",
  };

  setValues({
    name: selectedDevice.name ?? "",
    type: typeMap[selectedDevice.type] ?? "",
    serialNumber: selectedDevice.serialNumber ?? "",
    status: statusMap[selectedDevice.status] ?? "Available",
  });
}, [selectedDevice]);


  // ฟังก์ชันตรวจสอบความถูกต้อง (Manual Validation)
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.name || values.name.length < 2) {
      newErrors.name = "ชื่ออุปกรณ์ต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    if (!values.type) {
      newErrors.type = "กรุณาเลือกประเภทอุปกรณ์";
    }

    if (!values.serialNumber || values.serialNumber.length < 3) {
      newErrors.serialNumber = "Serial Number ต้องมีอย่างน้อย 3 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues({
      name: "",
      type: "",
      serialNumber: "",
      status: "Available",
    });
    setErrors({});
    onClearSelected();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      let res;

      if (selectedDevice?.id) {
        // UPDATE
        res = await deviceService.updateDevice(selectedDevice.id, values);
      } else {
        // CREATE
        res = await deviceService.createDevice(values);
      }

      if (res.status === 200 || res.status === 201) {
        showSuccessPopup(res.message);
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save device", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card p-6 rounded-lg border"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อเครื่อง</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="เช่น VMS-001"
            className={errors.name ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Type Field */}
        <div className="space-y-2">
          <Label>ประเภทอุปกรณ์</Label>
          <Select
            value={values.type}
            onValueChange={(val: "VMS" | "Sensor" | "ETC") =>
              setValues({ ...values, type: val })
            }
            disabled={isSubmitting || selectedDevice?.id !== undefined}
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="เลือกประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VMS">VMS</SelectItem>
              <SelectItem value="Sensor">Sensor</SelectItem>
              <SelectItem value="ETC">ETC</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>

        {/* Serial Number Field */}
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={values.serialNumber}
            onChange={(e) =>
              setValues({ ...values, serialNumber: e.target.value })
            }
            placeholder="เช่น SN-123456"
            className={errors.serialNumber ? "border-red-500" : ""}
            disabled={isSubmitting || selectedDevice?.id !== undefined}
          />
          {errors.serialNumber && (
            <p className="text-xs text-red-500">{errors.serialNumber}</p>
          )}
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Label>สถานะ</Label>
          <Select
            value={values.status}
            onValueChange={(
              val: "Available" | "Maintenance" | "Retired" | "Assigned",
            ) => setValues({ ...values, status: val })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {selectedDevice ? "อัปเดตอุปกรณ์" : "เพิ่มอุปกรณ์"}
      </Button>
    </form>
  );
}
