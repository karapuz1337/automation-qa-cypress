import { faker } from "@faker-js/faker";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Add the credentials to enter the website to the original visit command
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    return originalFn(url, {
        ...options,
        auth: {
            username: Cypress.env('username'),
            password: Cypress.env('password')
        }
    })
})

// Add the "sensitive" flag to the type command to hide the password in logs
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
    if (options && options.sensitive) {
        // turn off original log
        options.log = false
        // create our own log with masked message
        Cypress.log({
            $el: element,
            name: 'type',
            message: '*'.repeat(text.length),
        })
    }

    return originalFn(element, text, options)
})

// Add the custom command to create valid credentials
Cypress.Commands.add('generateUserData', () => {

        // Generate unique email to avoid duplicates
        const timeStamp = Date.now();
        const randomString = faker.string.alphanumeric(5);
        const email = `test-${timeStamp}-${randomString}@test.com`;

        // Generate password: "Qwerty@" (7 chars) + number (1-8 digits) = 8-15 chars total
        const randomNumber = faker.number.int({ min: 1, max: 99999999 }); // 1-8 digits
        const password = `Qwerty@${randomNumber}`;


        return {
            // Trim name and lastName of any symbols
            name: faker.person.firstName().replace(/[^a-zA-Z]/g, ""),
            lastName: faker.person.lastName().replace(/[^a-zA-Z]/g, ""),
            email,
            password,
            repeatPassword: password
        };
    })


// Add the custom command to register user with valid credentials
Cypress.Commands.add('register', () => {

    cy.visit("/")
    cy.contains("button", "Sign up").click()

    const userData = cy.generateUserData()

    cy.get(".modal-content .btn-primary").as("registerBtn")
    cy.get("@registerBtn").should("be.visible").and("be.disabled")

    cy.get("#signupName").type(userData.name)
    cy.get("@registerBtn").should("be.disabled")

    cy.get("#signupLastName").type(userData.lastName)
    cy.get("@registerBtn").should("be.disabled")

    cy.get("#signupEmail").type(userData.email)
    cy.get("@registerBtn").should("be.disabled")

    cy.get("#signupPassword").type(userData.password, {sensitive:true})
    cy.get("@registerBtn").should("be.disabled")

    cy.get("#signupRepeatPassword").type(userData.repeatPassword, {sensitive:true})
    cy.get("@registerBtn").should("be.enabled")

    cy.get("@registerBtn").click()

    return {email: userData.email, password: userData.password}
})

// Add the custom command to login using the login and password credentials
Cypress.Commands.add('login', (email, password, remember=false) => {
    cy.visit("/")
    // Open the "Sign In" form
    cy.get(".header_signin").click()

    // Enter the credentials and click Login
    cy.get(".modal-content").within(() => {
        cy.get("#signinEmail").type(email)
        cy.get("#signinPassword").type(password, {sensitive:true})

        if (remember) {
            cy.get("#remember").check()
        }

        cy.get(".btn-primary").click()
    })

    // Correct page is opened
    cy.location("pathname").should("eq", "/panel/garage")

    // The "Add car" button is visible and enabled
    cy.get(".btn-primary").should("be.visible")
        .and("be.enabled")
        .and("contain.text", "Add car")

})

// Add the custom command to delete the user
Cypress.Commands.add('deleteUser', () => {

    cy.visit("/panel/garage");

    // Click the "Settings" button
    cy.get("a.sidebar_btn[href='/panel/settings']").click();

    // Click the "Remove my account" button
    cy.contains('button.btn.btn-danger-bg', /^Remove my account$/).click();

    // Click the "Remove" button (Confirm removal)
    cy.contains('button.btn.btn-danger', /^Remove$/).click()
})

// Add the custom helper function to test text field UI
Cypress.Commands.add("assertTextFieldUI", ({
    inputSelector,
    errorSelector,
    value,
    expected,         // empty string for valid cases; non-empty for invalid
    borderKey,        // "Red" | "Default" from fixtures
    colors            // COLORS.borders or a flat map like { Red: "...", Default: "..." }
}) => {
    const negative = Boolean(expected && expected.length);
    const color = (colors.borders || colors)[borderKey];

    // Handle empty string without cy.type('')
    const isEmpty = value === '' || value === undefined || value === null;

    // Type something and clear it so the text field is not pristine
    if (isEmpty) {
        cy.get(inputSelector).type("x")
        cy.get(inputSelector).clear()
        cy.get(inputSelector).blur();
    } else
    {
        cy.get(inputSelector).clear();
        cy.get(inputSelector).type(value);
        cy.get(inputSelector).blur();
    }

    // Check style + state
    cy.get(inputSelector)
        .should(negative ? 'have.class' : 'not.have.class', 'is-invalid')
        .and('have.css', 'border-top-color', color);

    // Error visibility
    if (negative) {
        cy.get(errorSelector).should('be.visible').and('contain', expected);
    } else {
        cy.get(errorSelector).should('not.exist');

        // Verify trimming for the “with spaces” valid cases
        if (value.trim() !== value) {
            cy.get(inputSelector).invoke('val').should('eq', value.trim());
        }
    }
})