📌 General Rules
	•	Always use TypeScript with strict typing (tsconfig: strict: true).
	•	Organize framework into POM-like structure for APIs:
	•	tests/ → test specs
	•	pages/api/ → API endpoint classes (encapsulate requests, like Page Objects)
	•	utils/ → common helpers (faker data, schema validation, logger, config)
	•	fixtures/ → reusable test data or setup/teardown logic
	•	Use Playwright test runner (@playwright/test) with request fixture.
	•	Use faker for realistic test data.
	•	Follow AAA pattern (Arrange, Act, Assert) in tests.
	•	Include comments for each step (Setup, Request, Assertion).
	•	Avoid hardcoding values → use config.ts or env variables.
	•	Ensure idempotency: clean up test data after creation if necessary.

⸻

📌 POM for APIs (Best Practice)
	•	Treat each API resource like a Page Object.
	•	Each API class should:
	•	Accept request: APIRequestContext in constructor.
	•	Expose methods for each endpoint (e.g., createUser(data), getUser(id)).
	•	Return typed response models (User, Order, etc.) instead of raw JSON.
	•	Handle status + body validation internally.
	•	Example structure:
```
pages/api/
├── BaseAPI.ts
├── UsersAPI.ts
├── OrdersAPI.ts
```
📌 Assertions & Validations
	•	Always assert on:
	•	Status code (expect(res.status()).toBe(200))
	•	Critical response fields from history.json or schema
	•	Use Playwright expect for response validation.
	•	Use Zod / Joi / Yup (optional) for response schema validation.
	•	Log response on failure for debugging.

⸻

📌 Error Handling
	•	Wrap critical calls in try/catch.
	•	Print failed payload + response body on errors.
	•	Use custom error classes in utils/errors.ts.

⸻

📌 Example API Test with POM
```
// tests/user.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { UsersAPI } from '../pages/api/UsersAPI';

test.describe('User API Workflow', () => {
  test('should create and fetch user successfully', async ({ request }) => {
    const usersApi = new UsersAPI(request);

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
});
```

📌 Example API POM Class
```
// pages/api/UsersAPI.ts
import { APIRequestContext, expect } from '@playwright/test';

export class UsersAPI {
  constructor(private request: APIRequestContext) {}

  async createUser(user: { firstName: string; email: string }) {
    const response = await this.request.post('/users', { data: user });
    expect(response.status()).toBe(201);

    const body = await response.json();
    return body as { id: string; firstName: string; email: string };
  }

  async getUser(userId: string) {
    const response = await this.request.get(`/users/${userId}`);
    expect(response.status()).toBe(200);

    return (await response.json()) as { id: string; firstName: string; email: string };
  }
}
```
📌 Key Best Practices (SDET Level)
	1.	Reusability: Encapsulate endpoints in classes.
	2.	Maintainability: Centralize base URL, headers, and auth in BaseAPI.ts.
	3.	Scalability: Organize endpoints per resource (Users, Orders, Auth).
	4.	Data Management: Use faker + fixtures, avoid static test data.
	5.	Validation: Always check both status + response schema.
	6.	CI/CD Ready: Configurable base URLs via process.env.
	7.	Clean Tests: Keep test specs high-level; logic stays in POM.