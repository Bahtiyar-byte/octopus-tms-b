import axios from 'axios';
import { User, UserRole } from '../types/core/user.types';

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
  username?: string;
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
      // Error fetching users
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      // Error fetching user
      throw error;
    }
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Ensure role is uppercase
      const requestData = {
        ...userData,
        role: userData.role.toUpperCase() as UserRole
      };
      const response = await axios.post(this.baseUrl, requestData);
      return response.data;
    } catch (error) {
      // Error creating user
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, userData);
      return response.data;
    } catch (error) {
      // Error updating user
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      // Error deleting user
      throw error;
    }
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      // Error toggling user status
      throw error;
    }
  }

  // Reset user password
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${id}/reset-password`, { newPassword });
    } catch (error) {
      // Error resetting password
      throw error;
    }
  }
}

export const userService = new UserService();