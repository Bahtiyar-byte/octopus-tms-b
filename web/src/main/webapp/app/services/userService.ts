import axios from 'axios';
import { User, UserRole } from '../types';

// Ensure authorization header is set if token exists
const token = localStorage.getItem('octopus_tms_token') || sessionStorage.getItem('octopus_tms_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: UserRole;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UserListResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class UserService {
  private baseUrl = '/api/users';

  // Get all users with pagination
  async getUsers(page = 0, size = 20): Promise<UserListResponse> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await axios.post(this.baseUrl, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Reset user password
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${id}/reset-password`, { newPassword });
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

export const userService = new UserService();