// src/app/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { Progress } from "./ui/progress";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      // ถ้าไม่มี token เลย = ไม่ได้ login
      if (!accessToken || !refreshToken) {
        console.log('No tokens found');
        setIsAuthorized(false);
        return;
      }

      // ถ้ามี token = ถือว่า authorized (จะตรวจสอบจริงๆ เมื่อเรียก API)
      // API middleware จะ handle 401 และ refresh token ให้อัตโนมัติ
      console.log('Tokens found, assuming authorized');
      setIsAuthorized(true);
    };

    checkAuth();
  }, [location.pathname]);

  // ระหว่างที่รอการตรวจสอบ
  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-background">
        <div className="space-y-4 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
          <Progress value={60} className="w-[300px] h-2" />
        </div>
      </div>
    );
  }

  // ถ้าไม่มี token = redirect ไป login
  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ถ้ามี token = แสดงหน้า (การตรวจสอบจริงๆ จะเกิดเมื่อเรียก API)
  return <>{children}</>;
};

export default ProtectedRoute;
