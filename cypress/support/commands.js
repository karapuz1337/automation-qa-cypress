import {generateUserData} from "./generateUserData.js";

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

// ---------- AUTHORIZATION ------------

// Add the custom command to register user with valid credentials
Cypress.Commands.add('register', () => {

    cy.visit("/")
    cy.contains("button", "Sign up").click()

    const userData = generateUserData()

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

    cy.location('pathname').should('eq', '/panel/garage')

    return cy.wrap({ email: userData.email, password: userData.password }, { log: false })
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

// --------- ASSERTIONS ------------

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


// ------------ ADD CAR --------------

Cypress.Commands.add("addCar", (brand, model, mileage) => {
    // Open the Add Car form
    cy.contains(".btn-primary", "Add car").click()

    cy.get(".modal-content").as("addCarForm")

    cy.get("@addCarForm").should("be.visible")

    // Add a valid car
    cy.get("@addCarForm").within(() => {

        cy.get(".modal-title").should("contain.text", "Add a car")

        cy.get(".btn-primary").as("addBtn")
        cy.get("@addBtn").should("be.disabled")

        cy.get("#addCarBrand").select(brand)
        cy.get("@addBtn").should("be.disabled")

        cy.get("#addCarModel").select(model)
        cy.get("@addBtn").should("be.disabled")

        cy.get("#addCarMileage").type(String(mileage))
        cy.get("@addBtn").should("be.enabled")

        cy.get("@addBtn").click()
    })

})

Cypress.Commands.add('getCarCard', (name) => {
    return cy.contains('.car_name', name).closest('.car.jumbotron')
})

// ------------ FUEL EXPENSES ---------------
Cypress.Commands.add('addFuelExpense', (carName, reportDate, mileage, numOfLiters, totalCost) => {
    // Click the "Fuel expenses" button
    cy.get("a.sidebar_btn[href='/panel/expenses']").click();

    // Click the "Add an expense" button
    cy.contains(".btn-primary", "Add an expense").click();

    cy.get(".modal-content").should("be.visible").as("addExpenseForm")

    cy.get("@addExpenseForm").within(() => {
        // Check the title
        cy.get(".modal-title").should("contain.text", "Add an expense")

        // Check button after each input
        cy.get(".btn-primary").should("be.disabled").as("addBtn")

        // Select a car
        cy.get("#addExpenseCar").select(carName)

        // Input "Report date"
        cy.get("#addExpenseDate").clear()
        cy.get("#addExpenseDate").type(reportDate)
        cy.get("@addBtn").should("be.disabled")

        // Input "Mileage"
        cy.get("#addExpenseMileage").clear()
        cy.get("#addExpenseMileage").type(String(mileage))
        cy.get("@addBtn").should("be.disabled")

        // Input "Number of liters"
        cy.get("#addExpenseLiters").clear()
        cy.get("#addExpenseLiters").type(String(numOfLiters))
        cy.get("@addBtn").should("be.disabled")

        // Input "Total cost"
        cy.get("#addExpenseTotalCost").clear()
        cy.get("#addExpenseTotalCost").type(String(totalCost))
        cy.get("@addBtn").should("be.enabled")

        cy.get("@addBtn").click()
    })

    cy.get("#carSelectDropdown").should("contain.text", carName)
    cy.get(".expenses_table").should("be.visible")
})

Cypress.Commands.add('assertFuelExpense', (carName, reportDate, mileage, numOfLiters, totalCost) => {

    // Check that the expense is added correctly
    cy.get(".expenses_table")
        .should("contain.text", reportDate)
        .and("contain.text", String(mileage))
        .and("contain.text", String(numOfLiters))
        .and("contain.text", String(totalCost))
})