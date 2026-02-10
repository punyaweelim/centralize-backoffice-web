// src/app/components/Login.tsx
import { useEffect, useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { authenService } from '../../services/authenService';
import { apiClient } from '../../utils/apiClient';
import { Progress } from './ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State สำหรับจัดการ Alert Dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  // States สำหรับ Loading และ Progress
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // แสดง inline error แทน dialog
  const [inlineError, setInlineError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && progress < 90) {
      timer = setInterval(() => {
        setProgress((prev) => prev + Math.random() * 10);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isLoading, progress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setInlineError('');
    setApiErrorMessage('');
    
    setIsLoading(true);
    setProgress(10);
    
    try { 
      const response = await authenService.login({ email, password });
      console.log('Login response:', response);
      
      setProgress(100);
      
      // ตรวจสอบ response structure - รองรับหลายรูปแบบ
      const accessToken = response.access_token || response.accessToken;
      const refreshToken = response.refresh_token || response.refreshToken;
      
      if (accessToken && refreshToken) {
        apiClient.setTokens(accessToken, refreshToken);
        
        // รอให้ progress bar เสร็จก่อน navigate
        setTimeout(() => {
          navigate('/users');
        }, 500);
      } else {
        setIsLoading(false);
        setProgress(0);
        
        const message = response.message || 'Invalid response from server';
        setInlineError(message);
        console.error('Invalid login response:', response);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      setProgress(0);
      
      const message = error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      
      // แสดง error แบบ inline สำหรับ errors ทั่วไป
      if (message.includes('connect') || 
          message.includes('network') || 
          message.includes('Unable to')) {
        setInlineError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      } else if (message.includes('credentials') || 
                 message.includes('Invalid') ||
                 message.includes('password')) {
        setInlineError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setInlineError(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full z-50">
          <Progress value={progress} className="h-1 rounded-none bg-blue-100" />
        </div>
      )}
      
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl text-white mb-2">NWL Centralize Back Office</h1>
          <p className="text-white/50">Sign in to continue</p>
        </div>

        {/* Inline Error Alert */}
        {inlineError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{inlineError}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white/70 mb-2">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInlineError(''); // Clear error when user types
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setInlineError('');
                }}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-white/30 text-sm">
            © 2026 Back Office. All rights reserved.
          </p>
        </div>

        {/* Dialog Alert สำหรับ critical errors */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Login Failed</AlertDialogTitle>
              <AlertDialogDescription>
                {apiErrorMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
                Try Again
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
