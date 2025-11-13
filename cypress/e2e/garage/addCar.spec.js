
describe("The \"Add car\" functionality", () => {


    beforeEach(() => {
        // Register a new user
        cy.register()
    })

    it("Should add a car with valid credentials", () => {

        const carBrand = "BMW"
        const carModel = "X5"
        const carName = `${carBrand} ${carModel}`
        const validMileage = 1000
        cy.addCar(carBrand, carModel, validMileage)

        cy.getCarCard(carName).within(() => {
            // Check logo
            cy.get(".car-logo_img").invoke("attr", "src")
                .should('include', `/public/images/brands/${carBrand.toLowerCase()}.png`)

            // Check car name
            cy.get('.car_name').should('contain', carName)

            // Check the mileage
            cy.get("input[formcontrolname='miles']").should("have.value", validMileage)
        })

    })

    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})