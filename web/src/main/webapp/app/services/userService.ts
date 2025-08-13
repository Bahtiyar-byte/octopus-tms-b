import { User, UserRole } from '../types/core/user.types';
import { ApiClient } from './api';

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
  private baseUrl = '/users';

  // Get all users with pagination
  async getUsers(page = 0, size = 20): Promise<UserListResponse> {
    return await ApiClient.get<UserListResponse>(this.baseUrl, {
      params: { page, size }
    });
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return await ApiClient.get<User>(`${this.baseUrl}/${id}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Ensure role is uppercase
    const requestData = {
      ...userData,
      role: userData.role.toUpperCase() as UserRole
    };
    return await ApiClient.post<User, CreateUserRequest>(this.baseUrl, requestData);
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return await ApiClient.put<User, UpdateUserRequest>(`${this.baseUrl}/${id}`, userData);
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await ApiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Toggle user status
  async toggleUserStatus(id: string): Promise<User> {
    return await ApiClient.patch<User>(`${this.baseUrl}/${id}/toggle-status`);
  }

  // Reset user password
  async resetUserPassword(id: string, newPassword: string): Promise<void> {
    await ApiClient.post<void>(`${this.baseUrl}/${id}/reset-password`, { newPassword });
  }
}

export const userService = new UserService();