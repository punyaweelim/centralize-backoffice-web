// import { useState } from 'react';
// import { Login } from '@/app/components/Login';
// import { Sidebar } from '@/app/components/Sidebar';
// import { Users, User } from '@/app/components/Users';
// import { Devices, Device } from '@/app/components/Devices';
// import { Projects, Project } from '@/app/components/Projects';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState<User[]>([]);
//   const [devices, setDevices] = useState<Device[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);

//   // User handlers
//   const handleAddUser = (user: Omit<User, 'id'>) => {
//     const newUser = { ...user, id: Date.now().toString() };
//     setUsers([...users, newUser]);
//   };

//   const handleDeleteUser = (id: string) => {
//     setUsers(users.filter(u => u.id !== id));
//     // Remove user from projects
//     setProjects(projects.map(p => ({
//       ...p,
//       assignedUsers: p.assignedUsers.filter(userId => userId !== id)
//     })));
//   };

//   const handleUpdateUser = (id: string, user: Omit<User, 'id'>) => {
//     setUsers(users.map(u => u.id === id ? { ...user, id } : u));
//   };

//   // Device handlers
//   const handleAddDevice = (device: Omit<Device, 'id'>) => {
//     const newDevice = { ...device, id: Date.now().toString() };
//     setDevices([...devices, newDevice]);
//   };

//   const handleDeleteDevice = (id: string) => {
//     setDevices(devices.filter(d => d.id !== id));
//     // Remove device from projects
//     setProjects(projects.map(p => ({
//       ...p,
//       assignedDevices: p.assignedDevices.filter(deviceId => deviceId !== id)
//     })));
//   };

//   const handleUpdateDevice = (id: string, device: Omit<Device, 'id'>) => {
//     setDevices(devices.map(d => d.id === id ? { ...device, id } : d));
//   };

//   // Project handlers
//   const handleAddProject = (project: Omit<Project, 'id'>) => {
//     const newProject = { ...project, id: Date.now().toString() };
//     setProjects([...projects, newProject]);
//   };

//   const handleDeleteProject = (id: string) => {
//     setProjects(projects.filter(p => p.id !== id));
//   };

//   const handleUpdateProject = (id: string, project: Omit<Project, 'id'>) => {
//     setProjects(projects.map(p => p.id === id ? { ...project, id } : p));
//   };

//   if (!isLoggedIn) {
//     return <Login onLogin={() => setIsLoggedIn(true)} />;
//   }

//   return (
//     <div className="flex h-screen bg-black">
//       <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
//       <main className="flex-1 overflow-y-auto p-8">
//         {activeTab === 'users' && (
//           <Users
//             users={users}
//             onAddUser={handleAddUser}
//             onDeleteUser={handleDeleteUser}
//             onUpdateUser={handleUpdateUser}
//           />
//         )}
        
//         {activeTab === 'devices' && (
//           <Devices
//             devices={devices}
//             onAddDevice={handleAddDevice}
//             onDeleteDevice={handleDeleteDevice}
//             onUpdateDevice={handleUpdateDevice}
//           />
//         )}
        
//         {activeTab === 'projects' && (
//           <Projects
//             projects={projects}
//             users={users}
//             devices={devices}
//             onAddProject={handleAddProject}
//             onDeleteProject={handleDeleteProject}
//             onUpdateProject={handleUpdateProject}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;

// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { UsersPage } from './components/Users';
// import Dashboard from '@/app/pages/Dashboard';
// import UserManagement from '@/app/pages/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public: หน้า Login ไม่ต้องมี Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Protected: ทุกหน้าที่ต้องผ่านการตรวจสอบ และใช้ Layout ร่วมกัน */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/users" element={ <UsersPage /> } />
          {/* สามารถเพิ่มหน้าอื่นๆ เช่น /tasks ได้ที่นี่ */}
        </Route>

        {/* Default Path */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;