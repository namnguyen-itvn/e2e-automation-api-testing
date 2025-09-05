import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["list"],
    ["allure-playwright"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  testDir: "./tests",
});
