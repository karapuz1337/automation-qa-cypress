import {formatDateAPI} from "../../../support/formatDate.js";

describe("API: Add fuel expenses", () => {

    beforeEach(() => {
        // Register a new user
        cy.register()
    })

    it("Response should contain the sent data", () => {
        // Add a valid car
        const addCarBody = {
            carBrandId: 1,
            carModelId: 2,
            mileage: 1000
        }

        cy.api({
            method: "POST",
            url: "/api/cars",
            body: addCarBody
        }).then((response) => {
            expect(response.status).to.equal(201)

            // Grab a car ID
            const carId = response.body.data.id

            // Add valid Fuel expense
            const addFuelExpenseBody = {
                carId,
                reportedAt: formatDateAPI(),
                mileage: addCarBody.mileage + 1,
                liters: 50,
                totalCost: 100
            }

            cy.api({
                method: "POST",
                url: "/api/expenses",
                body: addFuelExpenseBody
            }).then((response) => {
                expect(response.status).to.equal(200)

                // Retrieve response body
                const {status, data} = response.body

                // Assert response body
                expect(status).to.equal("ok")
                expect(data.carId).to.equal(carId)
                expect(data.reportedAt).to.include(addFuelExpenseBody.reportedAt)
                expect(data.liters).to.equal(addFuelExpenseBody.liters)
                expect(data.mileage).to.equal(addFuelExpenseBody.mileage)
                expect(data.totalCost).to.equal(addFuelExpenseBody.totalCost)
            })
        })


    })

    afterEach(() => {
        // Delete user
        cy.deleteUser()
    })
})