import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Role } from '../../types/settings';
import { UserRole } from '../../types';
import ToggleSwitch from '../ToggleSwitch';
import Modal from '../ui/Modal';
import { userService } from '../../services';

interface UserSettingsProps {
  initialRoles: Role[];
}

const UserSettings: React.FC<UserSettingsProps> = ({ initialRoles }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    role: 'BROKER' as UserRole,
    department: '',
    phone: ''
  });

  // Fetch real users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      const mappedUsers = response.content.map(user => ({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        role: mapRoleToDisplay(user.role),
        department: user.department || 'Not specified',
        status: 'active' as const,
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never',
        initials: `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.email[0].toUpperCase(),
        avatarColor: getAvatarColor(user.role)
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      // Set empty array on error
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const mapRoleToDisplay = (role: string): 'Admin' | 'Dispatcher' | 'Accountant' | 'Viewer' => {
    const roleMap: Record<string, 'Admin' | 'Dispatcher' | 'Accountant' | 'Viewer'> = {
      'admin': 'Admin',
      'supervisor': 'Admin',
      'dispatcher': 'Dispatcher',
      'driver': 'Dispatcher',
      'accounting': 'Accountant',
      'broker': 'Dispatcher',
      'carrier': 'Dispatcher',
      'shipper': 'Viewer'
    };
    return roleMap[role.toLowerCase()] || 'Viewer';
  };

  const getAvatarColor = (role: string): string => {
    const colorMap: Record<string, string> = {
      'admin': 'purple',
      'supervisor': 'indigo',
      'dispatcher': 'blue',
      'driver': 'green',
      'accounting': 'yellow',
      'broker': 'orange',
      'carrier': 'teal',
      'shipper': 'gray'
    };
    return colorMap[role.toLowerCase()] || 'gray';
  };

  // Users & Permissions handlers
  const handleAddUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      role: 'BROKER' as UserRole,
      department: '',
      phone: ''
    });
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.email,
      password: '',
      role: user.role.toUpperCase() as UserRole,
      department: user.department,
      phone: ''
    });
    setShowEditUserModal(true);
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await userService.toggleUserStatus(userId);
      const user = users.find(u => u.id === userId);
      if (user) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast.success(`User ${user.firstName} ${user.lastName} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ));
      }
    } catch (error) {
      toast.error('Failed to toggle user status');
    }
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser) {
        // Update existing user
        await userService.updateUser(currentUser.id, {
          username: formData.username || formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          role: formData.role
        });
        toast.success('User updated successfully');
        setShowEditUserModal(false);
      } else {
        // Create new user
        await userService.createUser({
          username: formData.username || formData.email,
          email: formData.email,
          password: formData.password || 'Ronin!1991',
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role.toUpperCase() as UserRole,
          department: formData.department,
          phone: formData.phone
        });
        toast.success('User created successfully');
        setShowAddUserModal(false);
      }
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleAddRole = () => {
    setShowAddRoleModal(true);
    toast.success('Add Role modal would open here');
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setShowEditRoleModal(true);
    toast.success(`Editing permissions for role: ${role.name}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Users & Permissions</h2>
        <p className="text-sm text-gray-600 mt-1">Manage users, roles, and access permissions</p>
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Users</h3>
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleAddUser}
          >
            <i className="fas fa-plus mr-2"></i> Add User
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mr-2"></i>
                        <span className="text-gray-500">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-gray-500">No users found</p>
                    </td>
                  </tr>
                ) : users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white bg-${user.avatarColor}-500`}>
                          {user.initials}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Dispatcher' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Accountant' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ToggleSwitch 
                        isOn={user.status === 'active'} 
                        onToggle={() => handleToggleUserStatus(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
          <button 
            className="btn btn-sm btn-primary"
            onClick={handleAddRole}
          >
            <i className="fas fa-plus mr-2"></i> Add Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(role => (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-shadow">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.iconBg}`}>
                    <i className={`fas ${role.icon}`}></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900">{role.name}</h4>
                    <span className="text-xs text-gray-500">{role.userCount} users</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => handleEditRole(role)}
                >
                  Edit Permissions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-control"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="form-control"
                placeholder="Leave empty to use email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="form-control"
                placeholder="Default: Ronin!1991"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="form-control"
                >
                  <option value="BROKER">Broker</option>
                  <option value="CARRIER">Carrier</option>
                  <option value="SHIPPER">Shipper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="form-control"
                  placeholder="e.g., Operations"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-control"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddUserModal(false)}
              className="btn btn-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        title="Edit User"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-control"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="form-control"
                >
                  {/*<option value="ADMIN">Admin</option>*/}
                  {/*<option value="SUPERVISOR">Supervisor</option>*/}
                  {/*<option value="DISPATCHER">Dispatcher</option>*/}
                  {/*<option value="DRIVER">Driver</option>*/}
                  {/*<option value="ACCOUNTING">Accounting</option>*/}
                  <option value="BROKER">Broker</option>
                  <option value="CARRIER">Carrier</option>
                  <option value="SHIPPER">Shipper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="form-control"
                  placeholder="e.g., Operations"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="form-control"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditUserModal(false)}
              className="btn btn-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserSettings;