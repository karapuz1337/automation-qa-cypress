import {formatDateUI} from "../../support/formatDate.js";

describe("The \"Add Fuel expenses\" functionality", () => {

    beforeEach(() => {
        // Register a new user
        cy.register()
    })

    const validDateStr = formatDateUI()

    // Define valid constants for each value
    const validCarBrand = "Audi"
    const validCarModel = "A6"
    const validCarName = `${validCarBrand} ${validCarModel}`
    const validMileage = 1000
    const validNewMileage = 10000
    const validLiters = 100
    const validTotalCost = 250

    it("Should add valid Fuel expenses", () => {
        // Add a valid car
        cy.addCar(validCarBrand, validCarModel, validMileage)

        // Add valid Fuel expense
        cy.addFuelExpense(validCarName, validDateStr, validNewMileage, validLiters, validTotalCost)

        // Assert valid Fuel expense
        cy.assertFuelExpense(validCarName, validDateStr, validNewMileage, validLiters, validTotalCost)

    })

    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})