import { defineConfig } from "cypress";
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
    // Reporter
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: { charts: true, reportDir: 'cypress/results', inlineAssets: true },

    e2e: {
        // ============================================
        // BASE CONFIGURATION
        // ============================================

        // Base URL for your application under test
        baseUrl: "https://qauto2.forstudy.space",

        // Pattern to find your test files
        specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",

        // ============================================
        // VIEWPORT & BROWSER SETTINGS
        // ============================================

        // Default viewport size (desktop)
        viewportWidth: 1280,
        viewportHeight: 720,

        // Default browser
        defaultBrowser: "chrome",

        // ============================================
        // TIMEOUTS (in milliseconds)
        // ============================================

        // How long to wait for cy.visit() to load
        pageLoadTimeout: 60000, // 60 seconds

        // Default timeout for most commands (cy.get, cy.find, etc.)
        defaultCommandTimeout: 10000, // 10 seconds

        // Timeout for cy.request()
        requestTimeout: 10000,

        // Timeout for cy.exec()
        execTimeout: 60000,

        // Timeout for assertions
        responseTimeout: 30000,

        // ============================================
        // TEST BEHAVIOR
        // ============================================

        // Don't reload tests when you save files
        watchForFileChanges: false,

        // Allow running all specs at once
        experimentalRunAllSpecs: true,

        // Take video of test runs
        video: true,

        // Compress videos to save space
        videoCompression: 32,

        // Take screenshots on failure automatically
        screenshotOnRunFailure: true,

        // Trash old assets before new run (keeps folders clean)
        trashAssetsBeforeRuns: true,

        // ============================================
        // RETRY LOGIC (for flaky tests)
        // ============================================

        retries: {
            // Retry failed tests in CI
            runMode: 2,
            // Don't retry in interactive mode
            openMode: 0,
        },

        // ============================================
        // SECURITY & BROWSER SETTINGS
        // ============================================

        // Allow tests to work across different domains
        chromeWebSecurity: false,

        // ============================================
        // ENVIRONMENT VARIABLES
        // ============================================

        env: {
            // Add custom environment variables here
            // Access with Cypress.env('apiUrl')
            apiUrl: "https://qauto2.forstudy.space/api",

            // Example: different user credentials for testing
            // testUser: "test@example.com",
            // testPassword: "password123",
        },

        // ============================================
        // FOLDERS
        // ============================================

        // Where to find support files
        supportFile: "cypress/support/e2e.js",

        // Where to find fixtures (test data)
        fixturesFolder: "cypress/fixtures",

        // Where screenshots are saved
        screenshotsFolder: "cypress/screenshots",

        // Where videos are saved
        videosFolder: "cypress/videos",

        // Where downloads go
        downloadsFolder: "cypress/downloads",

        // ============================================
        // NODE EVENTS (Advanced)
        // ============================================

        setupNodeEvents(on, config) {
            // Use Mocha awesome reporter
            cypressMochawesomeReporter(on);

            // Use the corresponding env variables for the project
            if (config.env.project2) Object.assign(config.env, config.env.project2);

            return config;

        },
    },
});