
describe("Add car functionality", () => {


    beforeEach(() => {
        // Register a new user and login
        const credentials = cy.register()
        cy.login(credentials.email, credentials.password)
    })



    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})