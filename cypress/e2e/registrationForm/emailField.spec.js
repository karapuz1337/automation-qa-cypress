import casesMod from '../../fixtures/registration/emailField.json';
import colorsMod from '../../fixtures/colors.json';
import { assertTextFieldUI } from '../../support/assertTextFieldUI';

const CASES = (casesMod?.default ?? casesMod);
const COLORS = colorsMod.borders ?? colorsMod;

describe("Registration form - Email field", () => {

    beforeEach(()=> {
        cy.visit("/")
        cy.contains(".btn-primary", "Sign up").click()
    })

    const inputSelector = "#signupEmail"
    const errorSelector = "#signupEmail + .invalid-feedback"

    CASES.forEach((c) => {
        const test = c.skip ? it.skip : it;
        test(c.title + (c.skipReason ? `[${c.skipReason}]` : ""), () => {
            assertTextFieldUI({
                inputSelector,
                errorSelector,
                value: c.input.email,
                expected: c.expected,
                borderKey: c.borderColor,
                colors: COLORS
            })

        })
    })
})
