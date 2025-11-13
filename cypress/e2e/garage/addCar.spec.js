
describe("Add car functionality", () => {


    beforeEach(() => {
        // Register a new user and login
        cy.register().then(({email, password}) => {
            cy.login(email, password)
        })
    })



    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})