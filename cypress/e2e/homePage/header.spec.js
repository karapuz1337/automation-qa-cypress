
describe("Header elements", () => {

    // Open the Home page before each test
    beforeEach(() => {
        cy.visit("/")
    })

    it("The 'Hillel-auto' logo", ()=>{

        // Find the target element and create an alias
        cy.get(".header_logo").as("logo")

        // Check that the element has a hyperlink
        cy.get("@logo").should("have.attr", "href")

        // Check that the element has the correct link
        const expectedLink = "/"
        cy.get("@logo").invoke("attr", "href").should("eq", expectedLink)

        // Check that the correct page is opened on click
        cy.get("@logo").click()
        cy.location('pathname').should('eq', '/')
    })

    it("Navigation bar - Home link", () => {

        // Find Home link by the href attribute
        cy.get(".header_nav a[href='/']").as("homeLink")

        // Check if it has the correct text content
        cy.get("@homeLink").should("contain.text", "Home")

        // Check if it is active
        cy.get("@homeLink").should("have.class", "-active")
    })

    it("Navigation bar - About button", () => {

        // Find the About button by the appscrollto attribute
        cy.get("button[appscrollto='aboutSection']").as("aboutButton")

        // Check if it has the correct text content
        cy.get("@aboutButton").should("contain.text", "About")
    })

    it("Navigation bar - Contacts button", () => {

        // Find the Contacts button by the appscrollto attribute
        cy.get("button[appscrollto='contactsSection']").as("contactsButton")

        // Check if it has the correct text content
        cy.get("@contactsButton").should("contain.text", "Contacts")
    })

    it("Right header - 'Guest log in' button", () => {

        // Find the 'Guest log in' button in the header_right container
        cy.get(".header_right").within(() => {

            // Create alias
            cy.get(".-guest").as("guestLoginButton")

            // Check that it has the correct text content
            cy.get("@guestLoginButton").should("contain.text", "Guest log in")

            // Check that we are logged in as Guest after click
            cy.get("@guestLoginButton").click()
        })

        // Correct page is opened
        cy.location("pathname").should("eq", "/panel/garage")

        // The "Add car" button is visible and enabled
        cy.get(".btn-primary").should("be.visible")
            .and("be.enabled")
            .and("contain.text", "Add car")

        // Click the "Log out" button
        cy.get(".icon-logout").click()
    })

    it("Right header - 'Sign In' button", () => {

        // Find the 'Sign In' button in the header_right container
        cy.get(".header_right").within(() => {

            // Create alias
            cy.get(".header_signin").as("signInButton")

            // Check that the button is visible and enabled
            cy.get("@signInButton").should("be.visible").and("be.enabled")

            // Check that it has the correct text content
            cy.get("@signInButton").should("contain.text", "Sign In")

            // Check that the Sign-In form is opened on click
            cy.get("@signInButton").click()
        })

        cy.get(".modal-title").should("be.visible")

        // Check that it is a Sign-In and not a Sign-Up form (the "Remember me" checkbox is present)
        cy.get("#remember").should("exist").and("be.visible")
    })

    it("The 'Sign up' button", () => {

        // Find and create alias
        cy.get(".btn-primary").as("signUpButton")

        // Check that it has the correct text content
        cy.get("@signUpButton").should("contain.text", "Sign up")

        // Check that the Sign-Up form is opened on click
        cy.get("@signUpButton").click()
        cy.get(".modal-title").should("be.visible")

        // Check that it is a Sign-Up and not a Sign-In form (the "Re-enter password" text field is present)
        cy.get("#signupRepeatPassword")
    })
})