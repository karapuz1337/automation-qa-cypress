import casesMod from '../../fixtures/registration/lastNameField.json';
import colorsMod from '../../fixtures/colors.json';

const CASES = (casesMod?.default ?? casesMod);
const COLORS = colorsMod.borders ?? colorsMod;

describe("Registration form - Last Name field", () => {

    beforeEach(()=> {
        cy.visit("/")
        cy.contains(".btn-primary", "Sign up").click()
    })

    const inputSelector = "#signupLastName"
    const errorSelector = "#signupLastName + .invalid-feedback"

    CASES.forEach((c) => {
        const test = c.skip ? it.skip : it;
        test(c.title + (c.skipReason ? `[${c.skipReason}]` : ""), () => {
            cy.assertTextFieldUI({
                inputSelector,
                errorSelector,
                value: c.input.lastName,
                expected: c.expected,
                borderKey: c.borderColor,
                colors: COLORS
            })

        })
    })
})
