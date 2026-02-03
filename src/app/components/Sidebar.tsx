// import { Users, HardDrive, FolderKanban, LogOutIcon } from 'lucide-react';

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
//   const menuItems = [
//     { id: 'users', label: 'Users', icon: Users },
//     { id: 'devices', label: 'Devices', icon: HardDrive },
//     { id: 'projects', label: 'Projects', icon: FolderKanban },
//     { id: 'logout', label: 'Logout', icon: LogOutIcon},
//   ];

//   return (
//     <div className="w-64 bg-black border-r border-white/10 h-screen flex flex-col">
//       <div className="p-6 border-b border-white/10">
//         <h1 className="text-xl text-white font-semibold">Back Office</h1>
//       </div>
      
//       <nav className="flex-1 p-4">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           return (
//             <button
//               key={item.id}
//               onClick={() => onTabChange(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
//                 activeTab === item.id
//                   ? 'bg-white text-black'
//                   : 'text-white/70 hover:bg-white/5 hover:text-white'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span>{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }


// src/app/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { Users, LogOut } from 'lucide-react'; // สมมติว่าใช้ lucide-react

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiClient.clearTokens();
    navigate('/login');
  };

  const navItems = [
    // { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/users', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 font-bold text-xl border-b">
        Back Office
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
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

