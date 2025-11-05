import js from "@eslint/js";
import globals from "globals";
import cypressPlugin from "eslint-plugin-cypress/flat";

export default [
    // Base JavaScript recommended rules
    js.configs.recommended,

    // Cypress plugin with recommended rules
    cypressPlugin.configs.recommended,

    // Global configuration for all files
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha, // Cypress uses Mocha's BDD syntax
            },
        },
    },

    // Cypress-specific configuration
    {
        files: ["cypress/**/*.{js,mjs,cjs}"],
        rules: {
            // Cypress Best Practices
            "cypress/no-assigning-return-values": "error", // cy commands are not Promises
            "cypress/no-unnecessary-waiting": "warn", // Avoid cy.wait(time)
            "cypress/assertion-before-screenshot": "warn", // Ensure state before screenshot
            "cypress/no-force": "warn", // Avoid force: true
            "cypress/no-async-tests": "error", // Don't use async/await in Cypress tests

            // Code Quality
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "warn", // Use cy.log() instead
            "prefer-const": "error",
            "no-var": "error",

            // Test Organization
            "max-lines-per-function": "off",
            "complexity": ["warn", 10],
        },
    },

    // Ignore patterns
    {
        ignores: [
            "node_modules/**",
            "cypress/downloads/**",
            "cypress/screenshots/**",
            "cypress/videos/**",
            "dist/**",
            "build/**",
        ],
    },
];