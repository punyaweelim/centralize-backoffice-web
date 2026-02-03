import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
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
} from "./ui/alert-dialog"; // ตรวจสอบ Path ของไฟล์ให้ถูกต้องตามโครงสร้างโปรเจกต์
import { useNavigate } from 'react-router-dom';


interface LoginProps {
  onLogin: () => void;
}

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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email && password) {
  //     onLogin();
  //   }
  // };

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
    setIsLoading(true);
    setProgress(10); // เริ่มต้นที่ 10%
    try {
      const response = await authenService.login({ email, password });
      setProgress(100);
      // สมมติว่า Backend ส่ง { accessToken, refreshToken } กลับมา
      if (response.refresh_token && response.access_token) {
        apiClient.setTokens(response.accessToken, response.refreshToken);
        setTimeout(() => navigate('/users'), 500);
        // window.location.assign('/dashboard');
      } else {
        setIsLoading(false);
        setProgress(0);
        const message = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        setApiErrorMessage(message);
        setIsAlertOpen(true);
      }
    } catch (error: any) {
      // 2. กรณี Error
      setIsLoading(false);
      setProgress(0);
      const message = error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      setApiErrorMessage(message);
      setIsAlertOpen(true);
    } finally {
      // ไม่เซ็ต setIsLoading(false) ที่นี่ถ้าสำเร็จ เพราะเรากำลังจะ Redirect
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/70 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors mb-4"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900 text-white/50">Or continue with</span>
            </div>
          </div> */}
          {/* <button
            onClick={handleMicrosoftLogin}
            className="w-full px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-3 border border-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H10.8571V10.8571H0V0Z" fill="#F25022"/>
              <path d="M12.1429 0H23V10.8571H12.1429V0Z" fill="#7FBA00"/>
              <path d="M0 12.1429H10.8571V23H0V12.1429Z" fill="#00A4EF"/>
              <path d="M12.1429 12.1429H23V23H12.1429V12.1429Z" fill="#FFB900"/>
            </svg>
            <span>Sign in with Microsoft</span>
          </button> */}

          {/* <p className="text-white/30 text-xs text-center mt-6">
            Using Microsoft Azure AD SAML 2.0 Authentication
          </p> */}
        </div>
        <div className="text-center mt-6">
          <p className="text-white/30 text-sm">
            © 2026 Back Office. All rights reserved.
          </p>
        </div>



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
