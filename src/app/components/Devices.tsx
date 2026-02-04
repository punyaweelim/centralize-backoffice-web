import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
}

interface DevicesProps {
  devices: Device[];
  onAddDevice: (device: Omit<Device, 'id'>) => void;
  onDeleteDevice: (id: string) => void;
  onUpdateDevice: (id: string, device: Omit<Device, 'id'>) => void;
}

export function Devices({ devices, onAddDevice, onDeleteDevice, onUpdateDevice }: DevicesProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({ name: '', type: '', serialNumber: '', status: 'Active' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDevice) {
      onUpdateDevice(editingDevice.id, formData);
    } else {
      onAddDevice(formData);
    }
    setFormData({ name: '', type: '', serialNumber: '', status: 'Active' });
    setShowModal(false);
    setEditingDevice(null);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({ name: device.name, type: device.type, serialNumber: device.serialNumber, status: device.status });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingDevice(null);
    setFormData({ name: '', type: '', serialNumber: '', status: 'Active' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white">Devices Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </button>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left px-6 py-3 text-white/70">Name</th>
              <th className="text-left px-6 py-3 text-white/70">Type</th>
              <th className="text-left px-6 py-3 text-white/70">Serial Number</th>
              <th className="text-left px-6 py-3 text-white/70">Status</th>
              <th className="text-right px-6 py-3 text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="border-t border-white/10">
                <td className="px-6 py-4 text-white">{device.name}</td>
                <td className="px-6 py-4 text-white/70">{device.type}</td>
                <td className="px-6 py-4 text-white/70">{device.serialNumber}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    device.status === 'Active' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                  }`}>
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(device)}
                    className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors mr-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDevice(device.id)}
                    className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/50">
                  No devices found. Click "Add Device" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl text-white mb-4">
              {editingDevice ? 'Edit Device' : 'Add New Device'}
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
                <label className="block text-white/70 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="VMS">VMS</option>
                  <option value="Sensor">Sensor</option>
                  <option value="ETC">ETC</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white/70 mb-2">Serial Number</label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
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
                  {editingDevice ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}