import { APIRequestContext, expect } from '@playwright/test';
import { BaseAPI } from './BaseAPI';
import { z } from 'zod';
import { validateSchema } from '../../utils/validator';

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  email: z.string().email(),
});

export class UsersAPI extends BaseAPI {
  async createUser(user: { firstName: string; email: string }) {
    return this.handleRequest(async () => {
      const response = await this.request.post('/users', { data: user });
      expect(response.status()).toBe(201);
      const body = await response.json();
      return validateSchema(UserSchema, body);
    }, 'Create User');
  }

  async getUser(userId: string) {
    return this.handleRequest(async () => {
      const response = await this.request.get(`/users/${userId}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      return validateSchema(UserSchema, body);
    }, 'Get User');
  }
}
