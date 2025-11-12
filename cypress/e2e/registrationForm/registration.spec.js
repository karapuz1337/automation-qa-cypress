import {generateUserData} from "../../support/testUserData.js"

describe("Registration Form", () => {

    let isValidTest
    let userData
    // Generate data for each test and open the registration form
    beforeEach(() => {
        isValidTest = false
        userData = generateUserData()

        cy.visit("/")
        cy.contains("button", "Sign up").click()
    })

    // Valid registration
    it("Should create user with valid credentials", () => {

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

        // Mark as valid test for the afterEach hook
        isValidTest = true
    })

    afterEach(function () {
        if (isValidTest) {
            // Check that the user is created
            cy.login(userData.email, userData.password)

            // Delete user
            cy.deleteUser()
        }
    })


})