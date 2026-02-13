import { useEffect, useState } from 'react';
import { Lock, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { authenService } from '../../services/authenService';
// import { apiClient } from '../../utils/apiClient';
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
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  roles?: string;
  [key: string]: any;
}

// Types สำหรับ Error Cases
type ErrorSeverity = 'error' | 'warning' | 'info';

interface LoginError {
  message: string;
  severity: ErrorSeverity;
  icon: JSX.Element;
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State สำหรับจัดการ Alert Dialog
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null);

  // States สำหรับ Loading และ Progress
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // States สำหรับ Validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && progress < 90) {
      timer = setInterval(() => {
        setProgress((prev) => prev + Math.random() * 10);
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isLoading, progress]);

  // ฟังก์ชันสำหรับ set error ตาม severity
  const setError = (message: string, severity: ErrorSeverity = 'error') => {
    const icons = {
      error: <XCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      info: <CheckCircle2 className="h-5 w-5 text-blue-500" />
    };

    setLoginError({
      message,
      severity,
      icon: icons[severity]
    });
    setIsAlertOpen(true);
  };

  // ฟังก์ชันตรวจสอบ Email Format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('กรุณากรอกอีเมล');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }
    setEmailError('');
    return true;
  };

  // ฟังก์ชันตรวจสอบ Password
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('กรุณากรอกรหัสผ่าน');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // ฟังก์ชันตรวจสอบ Token ว่าหมดอายุหรือไม่
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
      }
      return false;
    } catch {
      return true;
    }
  };

  // ฟังก์ชันตรวจสอบ Role จาก JWT Token
  const validateRole = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded JWT:', decoded);
      // console.log(decoded.role);


      // if (decoded.role !== 'SYSTEM_ADMIN') {
      if (decoded.roles !== 'SYSTEM_ADMIN') {
        // setApiErrorMessage('คุณไม่มี Permission ใช้ Back Office');
        // setIsAlertOpen(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('JWT Decode Error:', error);
      // setApiErrorMessage('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์');
      // setIsAlertOpen(true);
      return false;
    }
  };

  // ฟังก์ชัน Handle Error จาก API
  const handleApiError = (error: any) => {
    console.error('Login Error:', error);

    // กรณี Network Error
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      setError(
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้\n' +
        'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', 
        'error'
      );
      return;
    }

    // กรณีมี error message จาก API
    const errorMessage = error?.message || '';

    // Handle specific error cases
    if (errorMessage.includes('Invalid login response') || 
        errorMessage.includes('Invalid token response')) {
      setError(
        'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์\n' +
        'กรุณาติดต่อผู้ดูแลระบบ', 
        'error'
      );
    } else if (errorMessage.includes('401') || 
               errorMessage.toLowerCase().includes('unauthorized') ||
               errorMessage.toLowerCase().includes('invalid credentials')) {
      setError(
        'อีเมลหรือรหัสผ่านไม่ถูกต้อง\n' +
        'กรุณาตรวจสอบและลองใหม่อีกครั้ง', 
        'warning'
      );
    } else if (errorMessage.includes('403') || 
               errorMessage.toLowerCase().includes('forbidden')) {
      setError(
        'บัญชีของคุณถูกระงับการใช้งาน\n' +
        'กรุณาติดต่อผู้ดูแลระบบ', 
        'warning'
      );
    } else if (errorMessage.includes('429') || 
               errorMessage.toLowerCase().includes('too many')) {
      setError(
        'มีการพยายามเข้าสู่ระบบมากเกินไป\n' +
        'กรุณารอสักครู่แล้วลองใหม่อีกครั้ง', 
        'warning'
      );
    } else if (errorMessage.includes('500') || 
               errorMessage.includes('503')) {
      setError(
        'เซิร์ฟเวอร์ขัดข้อง\n' +
        'กรุณาลองใหม่อีกครั้งในภายหลัง', 
        'error'
      );
    } else {
      // Default error message
      setError(
        errorMessage || 
        'เกิดข้อผิดพลาดในการเข้าสู่ระบบ\n' +
        'กรุณาลองใหม่อีกครั้ง', 
        'error'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);
    setProgress(20);

    try {
      const data = await authenService.login({ email, password });

      setProgress(60);

      // optional role check
      if (data.access_token) {
        const decoded = jwtDecode<JwtPayload>(data.access_token);
        console.log('Decoded JWT:', decoded);

        if (decoded.roles !== 'SYSTEM_ADMIN') {
          setApiErrorMessage('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์');
          setIsAlertOpen(true);
          throw new Error('คุณไม่มี Permission ใช้ Back Office');
        }
      }

      setProgress(100);

      setTimeout(() => {
        navigate('/users');
      }, 400);

    } catch (err) {
      // DO NOTHING
      // interceptor will show popup
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  // Get Alert Dialog styling based on severity
  const getAlertStyling = () => {
    if (!loginError) return {};

    const styles = {
      error: {
        title: 'Login Failed',
        titleClass: 'text-destructive',
        borderClass: 'border-red-500'
      },
      warning: {
        title: 'Access Denied',
        titleClass: 'text-yellow-600',
        borderClass: 'border-yellow-500'
      },
      info: {
        title: 'Notice',
        titleClass: 'text-blue-600',
        borderClass: 'border-blue-500'
      }
    };

    return styles[loginError.severity];
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
                  setEmailError('');
                }}
                onBlur={() => validateEmail(email)}
                className={`w-full px-4 py-3 bg-black border ${emailError ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors`}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onBlur={() => validatePassword(password)}
                className={`w-full px-4 py-3 bg-black border ${passwordError ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors`}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
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

        {/* Enhanced Alert Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent className={`border-2 ${getAlertStyling().borderClass}`}>
            <AlertDialogHeader>
              <AlertDialogTitle className={`flex items-center gap-2 ${getAlertStyling().titleClass}`}>
                {loginError?.icon}
                <span>{getAlertStyling().title}</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="whitespace-pre-line">
                {loginError?.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction 
                onClick={() => {
                  setIsAlertOpen(false);
                  setLoginError(null);
                }}
                className="w-full"
              >
                Try Again
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
