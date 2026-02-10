// src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import UserPage from './components/UserPage';
import DevicePage from './components/DevicePage';
import ProjectPage from './components/ProjectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public: หน้า Login ไม่ต้องมี Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Protected: ทุกหน้าที่ต้องผ่านการตรวจสอบ และใช้ Layout ร่วมกัน */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/users" element={<UserPage />} />
          <Route path="/devices" element={<DevicePage />} />
          <Route path="/projects" element={<ProjectPage />} />
        </Route>

        {/* Default Path - Redirect to users */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
