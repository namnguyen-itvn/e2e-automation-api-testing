# e2e-automation-api-testing

# Playwright API Automation Framework

## 🚀 Quick Start

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd e2e-automation-api-testing
```

### 2. Install dependencies
```sh
npm ci
```

### 3. Install Playwright browsers
```sh
npx playwright install --with-deps
```

### 4. Configure environment (optional)
- Set `BASE_URL` in your environment or `.env` file if needed.

### 5. Run tests locally
```sh
npx playwright test
```

### 6. View Playwright HTML report
```sh
npx playwright show-report
```

### 7. Generate and view Allure report locally
```sh
npm install -g allure-commandline --save-dev  # Only needed once
npx playwright test
allure generate ./allure-results --clean -o ./allure-report
allure open ./allure-report
```

> **Note:** Do NOT open `index.html` directly from the file system. Always use `allure open` to serve the report.

---

## 🏗️ Project Structure
```
/ (root)
├── tests/            # API test specs
├── pages/api/        # API endpoint classes (POM for APIs)
├── utils/            # Helpers (faker, schema validation, logger, config, request headers/body)
├── fixtures/         # Reusable test data or setup/teardown logic
├── playwright.config.ts
├── .github/workflows/playwright-test.yml  # CI workflow
```

---

## 🧪 CI/CD with GitHub Actions
- Tests run automatically on push and pull request to `main`.
- Allure and Playwright HTML reports are zipped and uploaded as artifacts (retained for 3 days).
- Download the artifact, unzip, and use `allure open ./allure-report` to view the Allure report locally.

---

## 📝 Troubleshooting
- If Allure report shows only "Loading...", use `allure open ./allure-report` instead of opening `index.html` directly.
- Make sure `BASE_URL` is set correctly for your API.
- For more details, see the workflow file in `.github/workflows/playwright-test.yml`.

---

## 📚 References
- [Playwright Test Docs](https://playwright.dev/docs/test-intro)
- [Allure Report Docs](https://docs.qameta.io/allure/)