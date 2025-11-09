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

// Add the custom command to login using the login and password credentials
Cypress.Commands.add('login', (email, password, remember=false) => {
    // Open the "Sign In" form
    cy.get(".header_signin").click()

    // Enter the credentials and click Login
    cy.get(".modal-content").within(() => {
        cy.get("#signinEmail").type(email)
        cy.get("#signinPassword").type(password)

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
    cy.get(".sidebar_btn a[href^='/panel/settings']").click();

    // Click the "Remove my account" button
    cy.contains('button.btn.btn-danger-bg', /^Remove my account$/).click();
})