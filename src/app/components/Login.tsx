import { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would validate credentials
    if (username && password) {
      onLogin();
    }
  };

  const handleMicrosoftLogin = () => {
    // Mock Microsoft SAML login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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
              <label className="block text-white/70 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
      </div>
    </div>
  );
}
