// src/app/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Outlet คือจุดที่เนื้อหาของแต่ละ Route (Dashboard, Users) จะมาแสดง */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;