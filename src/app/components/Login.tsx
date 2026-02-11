import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { authenService } from '../../services/authenService';
// import { apiClient } from '../../utils/apiClient';
import { Progress } from './ui/progress';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "./ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  roles?: string;
  [key: string]: any;
}

interface LoginProps {
  onLogin: () => void;
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State สำหรับจัดการ Alert Dialog
  // const [isAlertOpen, setIsAlertOpen] = useState(false);
  // const [apiErrorMessage, setApiErrorMessage] = useState('');

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

      if (decoded.roles !== 'SYSTEM_ADMIN') {
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
          <h1 className="text-3xl text-white mb-2"> NWL Centralize Back Office</h1>
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
                className={`w-full px-4 py-3 bg-black border ${
                  emailError ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors`}
                placeholder="Enter your email"
                required
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
                className={`w-full px-4 py-3 bg-black border ${
                  passwordError ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors`}
                placeholder="Enter your password"
                required
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

        {/* <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
        </AlertDialog> */}
      </div>
    </div>
  );
}