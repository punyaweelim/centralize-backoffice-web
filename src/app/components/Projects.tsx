import { useState } from 'react';
import { Plus, Trash2, Edit2, UserPlus, HardDriveDownload } from 'lucide-react';
import { User } from './UserPage';
import { Device } from './Devices';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export interface Project {
  id: string;
  name: string;
  description: string;
  locationX: string;
  locationY: string;
  code: string;
  status: string;
  assignedUsers: string[];
  assignedDevices: string[];
}

// แก้ปัญหา Marker Icon ไม่ขึ้น (Common Issue ใน Webpack/Vite)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ProjectsProps {
  projects: Project[];
  users: User[];
  devices: Device[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProject: (id: string, project: Omit<Project, 'id'>) => void;
}

export function Projects({ projects, users, devices, onAddProject, onDeleteProject, onUpdateProject }: ProjectsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [showAssignDeviceModal, setShowAssignDeviceModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    locationX: '',
    locationY: '',
    code: '',
    status: 'Active',
    assignedUsers: [] as string[],
    assignedDevices: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      onUpdateProject(editingProject.id, formData);
    } else {
      onAddProject(formData);
    }
    setFormData({ name: '', description: '', locationX: '', locationY: '', code: '', status: 'Active', assignedUsers: [], assignedDevices: [] });
    setShowModal(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      locationX: project.locationX,
      locationY: project.locationY,
      code: project.code,
      status: project.status,
      assignedUsers: project.assignedUsers,
      assignedDevices: project.assignedDevices
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', locationX: '', locationY: '', code: '', status: 'Active', assignedUsers: [], assignedDevices: [] });
  };

  const handleAssignUsers = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowAssignUserModal(true);
    }
  };

  const handleAssignDevices = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowAssignDeviceModal(true);
    }
  };

  const toggleUserAssignment = (userId: string) => {
    if (selectedProject) {
      const newAssignedUsers = selectedProject.assignedUsers.includes(userId)
        ? selectedProject.assignedUsers.filter(id => id !== userId)
        : [...selectedProject.assignedUsers, userId];

      onUpdateProject(selectedProject.id, {
        ...selectedProject,
        assignedUsers: newAssignedUsers
      });
      setSelectedProject({ ...selectedProject, assignedUsers: newAssignedUsers });
    }
  };

  const toggleDeviceAssignment = (deviceId: string) => {
    if (selectedProject) {
      const newAssignedDevices = selectedProject.assignedDevices.includes(deviceId)
        ? selectedProject.assignedDevices.filter(id => id !== deviceId)
        : [...selectedProject.assignedDevices, deviceId];

      onUpdateProject(selectedProject.id, {
        ...selectedProject,
        assignedDevices: newAssignedDevices
      });
      setSelectedProject({ ...selectedProject, assignedDevices: newAssignedDevices });
    }
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.firstname || 'Unknown User';
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white">Projects Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl text-white">{project.name}</h3>
                  <span className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                    {project.code}
                  </span>
                </div>
                <p className="text-white/70 mb-2">{project.description}</p>
                <div className="h-[400px] w-full rounded-xl overflow-hidden mb-6 border border-white/10">
                  <MapContainer
                    center={[13.7563, 100.5018]} // ตั้งค่า Center เริ่มต้น (เช่น กรุงเทพฯ)
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {projects.map((project) => {
                      // ตรวจสอบว่ามีพิกัดครบถ้วนก่อนปักหมุด
                      const lat = parseFloat(project.locationX);
                      const lng = parseFloat(project.locationY);

                      if (isNaN(lat) || isNaN(lng)) return null;

                      return (
                        <Marker key={project.id} position={[lat, lng]} icon={icon}>
                          <Popup>
                            <div className="p-2">
                              <h4 className="font-bold text-gray-900">{project.name}</h4>
                              <p className="text-sm text-gray-600">{project.description}</p>
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 inline-block">
                                Code: {project.code}
                              </span>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${project.status === 'Active' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                  }`}>
                  {project.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/50 text-sm">Assigned Users ({project.assignedUsers.length})</span>
                  <button
                    onClick={() => handleAssignUsers(project.id)}
                    className="text-white/70 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.assignedUsers.map(userId => (
                    <span key={userId} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                      {getUserName(userId)}
                    </span>
                  ))}
                  {project.assignedUsers.length === 0 && (
                    <span className="text-white/30 text-xs">No users assigned</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/50 text-sm">Assigned Devices ({project.assignedDevices.length})</span>
                  <button
                    onClick={() => handleAssignDevices(project.id)}
                    className="text-white/70 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                  >
                    <HardDriveDownload className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.assignedDevices.map(deviceId => (
                    <span key={deviceId} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                      {getDeviceName(deviceId)}
                    </span>
                  ))}
                  {project.assignedDevices.length === 0 && (
                    <span className="text-white/30 text-xs">No devices assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="bg-white/5 rounded-lg border border-white/10 p-12 text-center text-white/50">
            No projects found. Click "Add Project" to create one.
          </div>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-550">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl text-white mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Location X</label>
                <input
                  type="text"
                  value={formData.locationX}
                  onChange={(e) => setFormData({ ...formData, locationX: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Location Y</label>
                <input
                  type="text"
                  value={formData.locationY}
                  onChange={(e) => setFormData({ ...formData, locationY: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Project Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Users Modal */}
      {showAssignUserModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-550">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl text-white mb-4">Assign Users to {selectedProject.name}</h3>
            <div className="max-h-96 overflow-y-auto">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProject.assignedUsers.includes(user.id)}
                    onChange={() => toggleUserAssignment(user.id)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white">{user.name}</div>
                    <div className="text-white/50 text-sm">{user.email}</div>
                  </div>
                </label>
              ))}
              {users.length === 0 && (
                <div className="text-white/50 text-center py-8">No users available</div>
              )}
            </div>
            <button
              onClick={() => setShowAssignUserModal(false)}
              className="w-full mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Assign Devices Modal */}
      {showAssignDeviceModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-550">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl text-white mb-4">Assign Devices to {selectedProject.name}</h3>
            <div className="max-h-96 overflow-y-auto">
              {devices.map(device => (
                <label key={device.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProject.assignedDevices.includes(device.id)}
                    onChange={() => toggleDeviceAssignment(device.id)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white">{device.name}</div>
                    <div className="text-white/50 text-sm">{device.type} - {device.serialNumber}</div>
                  </div>
                </label>
              ))}
              {devices.length === 0 && (
                <div className="text-white/50 text-center py-8">No devices available</div>
              )}
            </div>
            <button
              onClick={() => setShowAssignDeviceModal(false)}
              className="w-full mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}