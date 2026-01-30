import { Users, HardDrive, FolderKanban } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'devices', label: 'Devices', icon: HardDrive },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className="w-64 bg-black border-r border-white/10 h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl text-white font-semibold">Back Office</h1>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
