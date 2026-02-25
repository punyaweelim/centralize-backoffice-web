// src/app/components/Login.tsx
import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { authenService } from '../../services/authenService';
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
import { ThemeToggle } from './ThemeToggle';
import { appConfig } from '@/utils/apiConfig';

interface JwtPayload {
  roles?: string;
  [key: string]: any;
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setEmailError('กรุณากรอกอีเมล'); return false; }
    if (!emailRegex.test(email)) { setEmailError('รูปแบบอีเมลไม่ถูกต้อง'); return false; }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) { setPasswordError('กรุณากรอกรหัสผ่าน'); return false; }
    if (password.length < 6) { setPasswordError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return false; }
    setPasswordError('');
    return true;
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

      if (data.access_token) {
        const decoded = jwtDecode<JwtPayload>(data.access_token);
        if (decoded.roles !== 'System Admin') {
          setApiErrorMessage('เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์');
          setIsAlertOpen(true);
          throw new Error('คุณไม่มี Permission ใช้ Back Office');
        }
      }

      setProgress(100);
      setTimeout(() => navigate('/users'), 400);
    } catch (err) {
      // interceptor will show popup
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Progress bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full z-50">
          <Progress value={progress} className="h-1 rounded-none" />
        </div>
      )}

      {/* Theme toggle — top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-lg mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-medium text-foreground mb-2">
            NWL Centralize Back Office
            
          </h1>
          {/* <p className="text-muted-foreground">Sign in to continue</p> */}
          <p className="text-muted-foreground">URL ENDPOINT : {appConfig.APP_USER_API_URL} | {import.meta.env.APP_USER_API_URL} </p> 
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-muted-foreground mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                onBlur={() => validateEmail(email)}
                className={`w-full px-4 py-3 bg-input-background border ${
                  emailError ? 'border-destructive' : 'border-border'
                } rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors`}
                placeholder="Enter your email"
                required
              />
              {emailError && <p className="text-destructive text-sm mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-muted-foreground mb-2 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                onBlur={() => validatePassword(password)}
                className={`w-full px-4 py-3 bg-input-background border ${
                  passwordError ? 'border-destructive' : 'border-border'
                } rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors`}
                placeholder="Enter your password"
                required
              />
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            © 2026 Back Office. All rights reserved.
          </p>
        </div>

        {/* Error Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Login Failed</AlertDialogTitle>
              <AlertDialogDescription>{apiErrorMessage}</AlertDialogDescription>
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
