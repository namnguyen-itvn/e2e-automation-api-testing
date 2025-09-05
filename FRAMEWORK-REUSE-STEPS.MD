# API Automation Framework – Reusable Implementation Steps

## 1. Project Structure
```
/ (root)
├── tests/            # API test specs
├── pages/api/        # API endpoint classes (POM for APIs)
│   ├── BasePage.ts   # Abstract base class for all API resources (custom actions, generic HTTP methods)
│   └── <Resource>API.ts # One file per API resource, extends BasePage
├── utils/            # Helpers (faker, schema validation, logger, config, request headers/body)
│   ├── requestHeaders.ts # Utility for building request headers
│   └── requestBody.ts    # Utility for building request bodies
├── fixtures/         # Reusable test data or setup/teardown logic
```

## 2. Install Dependencies
```sh
npm init -y
npm install -D typescript @playwright/test @faker-js/faker zod
npm install -D @types/node
```

## 3. TypeScript Config
Enable strict typing in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "target": "esnext",
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["**/*.ts"]
}
```

## 4. BasePage Class (pages/api/BasePage.ts)
- Centralizes base URL, generic HTTP methods (GET, POST, PUT, DELETE), error handling, and response parsing.
- All API resource classes should extend this class.
- Custom actions reusable for all API endpoints.

## 5. Request Header & Body Utilities
- `utils/requestHeaders.ts`: Build/extend headers (e.g., add auth, content-type).
- `utils/requestBody.ts`: Transform or prepare request body as needed.

## 6. API Resource Classes (POM)
- One file per resource (e.g., `UsersAPI.ts`), extends `BasePage`.
- Only resource-specific logic and endpoint methods.

## 7. Utilities
- `utils/config.ts`: Centralize config (base URL, etc.)
- `utils/logger.ts`: Simple logger
- `utils/errors.ts`: Custom error classes
- `utils/validator.ts`: Schema validation (Zod)

## 8. Example Test
Write high-level test specs in `tests/`, using AAA pattern and POM classes.

## 9. Data Management
Use `@faker-js/faker` for dynamic test data. Place fixtures in `fixtures/` if needed.

## 10. Validation
- Always assert status code and key response fields
- Use Zod for contract/schema validation

## 11. CI/CD Ready
- Use environment variables for base URL/config
- Clean up test data after creation if needed

---

## Example: BasePage and Resource API

### BasePage
```ts
// pages/api/BasePage.ts
import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../../utils/logger';
import { APIError } from '../../utils/errors';
import { buildHeaders } from '../../utils/requestHeaders';
import { buildRequestBody } from '../../utils/requestBody';
import { config } from '../../utils/config';

export abstract class BasePage {
  protected baseURL: string;
  constructor(protected request: APIRequestContext) {
    this.baseURL = config.baseURL;
  }
  protected async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> { /* ... */ }
  protected async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> { /* ... */ }
  protected async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> { /* ... */ }
  protected async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> { /* ... */ }
  protected async parseResponse<T>(response: APIResponse): Promise<T> { /* ... */ }
  protected async handleRequest<T>(fn: () => Promise<T>, info: string): Promise<T> { /* ... */ }
}
```

### Request Header Utility
```ts
// utils/requestHeaders.ts
export function buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    // Add auth or other headers here
    ...customHeaders,
  };
}
```

### Request Body Utility
```ts
// utils/requestBody.ts
export function buildRequestBody(data: any): any {
  // Add transformation logic if needed
  return data;
}
```

### Example Resource API
```ts
// pages/api/UsersAPI.ts
import { BasePage } from './BasePage';
import { z } from 'zod';
import { validateSchema } from '../../utils/validator';

const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  email: z.string().email(),
});

export class UsersAPI extends BasePage {
  async createUser(user: { firstName: string; email: string }) {
    const body = await this.post('/users', user);
    return validateSchema(UserSchema, body);
  }
  async getUser(userId: string) {
    const body = await this.get(`/users/${userId}`);
    return validateSchema(UserSchema, body);
  }
}
```

---

**Follow these steps and structure for a scalable, maintainable, and SDET-level API automation framework.**
