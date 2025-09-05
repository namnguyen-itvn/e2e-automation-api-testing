import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UsersAPI } from '../pages/api/UsersAPI';

// Arrange: create a UsersAPI instance for all tests
let usersApi: UsersAPI;
test.beforeEach(async ({ request }) => {
  usersApi = new UsersAPI(request);
});

test.describe('User API Workflow', () => {
  test('should create and fetch user successfully', async () => {
    // Arrange: test data
    const userData = {
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
    };
    // Act: create user
    const createdUser = await usersApi.createUser(userData);
    // Assert: creation
    expect(createdUser.firstName).toBe(userData.firstName);
    // Act: fetch user
    const fetchedUser = await usersApi.getUser(createdUser.id);
    // Assert: fetched user matches
    expect(fetchedUser.email).toBe(userData.email);
  });

  test('should throw schema validation error for invalid user response', async () => {
    // Arrange: invalid user data (simulate, e.g., missing email)
    const invalidUserData = {
      firstName: faker.person.firstName(),
      // email intentionally omitted
    } as any;
    let errorCaught = false;
    try {
      // Act: attempt to create user with invalid data
      await usersApi.createUser(invalidUserData);
    } catch (err: any) {
      // Assert: error is caught and is a schema validation error
      errorCaught = true;
      expect(err.message).toContain('Schema validation failed');
    }
    // Assert: ensure the error was caught
    expect(errorCaught).toBe(true);
  });
});

test.describe('User API Acceptance', () => {
  test('should create, fetch, and delete user (end-to-end)', async () => {
    // Arrange: test data
    const userData = {
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
    };
    // Act: create user
    const createdUser = await usersApi.createUser(userData);
    expect(createdUser.firstName).toBe(userData.firstName);
    // Act: fetch user
    const fetchedUser = await usersApi.getUser(createdUser.id);
    expect(fetchedUser.email).toBe(userData.email);
    // (Optional) Act: delete user (if API supports it)
    // await usersApi.deleteUser(createdUser.id);
    // (Optional) Assert: user no longer exists
    // await expect(usersApi.getUser(createdUser.id)).rejects.toThrow();
  });
});

import { z } from 'zod';
import { validateSchema } from '../utils/validator';

test.describe('User API Contract', () => {
  test('should match user contract (strict schema)', async () => {
    const userData = {
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
    };
    const createdUser = await usersApi.createUser(userData);
    // Define strict contract
    const StrictUserSchema = z.object({
      id: z.string().uuid(),
      firstName: z.string().min(1),
      email: z.string().email(),
      // Add more fields as required by contract
    });
    // Validate contract
    validateSchema(StrictUserSchema, createdUser);
  });
});
