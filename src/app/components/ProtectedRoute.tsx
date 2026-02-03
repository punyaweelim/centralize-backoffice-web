// src/app/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authenService } from '../../services/authenService';
import { apiClient } from '../../utils/apiClient';
import { Progress } from "./ui/progress";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // เรียก API Verify เพื่อตรวจสอบว่า Token ยังใช้งานได้จริงหรือไม่ [cite: 857, 858]
        await authenService.verifyToken();
        setIsAuthorized(true);
      } catch (error) {
        // หาก Verify ไม่ผ่าน apiClient ของเราจะพยายาม Refresh Token ให้อัตโนมัติ
        // หากยังล้มเหลวอีก จะถือว่าไม่ได้รับอนุญาต
        setIsAuthorized(false);
        apiClient.clearTokens();
      }
    };

    checkAuth();
  }, [location.pathname]);

  // ระหว่างที่รอการตรวจสอบ (Loading State)
  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-sm text-muted-foreground">Checking authentication...</p>
        <Progress value={60} className="w-[60%] h-1" />
      </div>
    );
  }

  // หากไม่มีสิทธิ์ ให้ Redirect ไปที่หน้า Login โดยเก็บ Path เดิมไว้ใน State
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;