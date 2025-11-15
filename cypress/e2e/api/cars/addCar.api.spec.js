describe("API: Add Car", () => {


    beforeEach(() => {
        // Register a new user
        cy.register()
    })

    it("Response should contain the entered in UI data", () => {

        // Define valid request data
        const carBrand = "Ford"
        const carModel = "Focus"
        const mileage = 1000

        // Intercept the POST request
        cy.intercept({
            method: "POST",
            url: "/api/cars"
        })
            .as("addCarRequest")

        // Create car via UI
        cy.addCar(carBrand, carModel, mileage)

        // Wait and assert the response
        cy.wait("@addCarRequest")
            .then((interception) => {

                // Check status
                expect(interception.response.statusCode).to.equal(201)

                // Retrieve response body
                const { status, data } = interception.response.body

                // Assert response body
                expect(status).to.equal("ok")
                expect(data.brand).to.equal(carBrand)
                expect(data.model).to.equal(carModel)
                expect(data.mileage).to.equal(mileage)
                expect(data.logo).to.equal(`${carBrand.toLowerCase()}.png`)
            })
    })

    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})