// src/app/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { Users, HardDrive, FolderKanban, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiClient.clearTokens();
    navigate('/login');
  };

  const navItems = [
    { name: 'จัดการผู้ใช้งาน', path: '/users', icon: <Users size={20} /> },
    { name: 'จัดการอุปกรณ์', path: '/devices', icon: <HardDrive size={20} /> },
    { name: 'จัดการโครงการ', path: '/projects', icon: <FolderKanban size={20} /> },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 font-bold text-xl border-b">
        NWL Back Office
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent text-muted-foreground"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
