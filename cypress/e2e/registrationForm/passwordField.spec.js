import casesMod from '../../fixtures/registration/passwordField.json';
import colorsMod from '../../fixtures/colors.json';
import { assertTextFieldUI } from '../../support/assertTextFieldUI';

const CASES = (casesMod?.default ?? casesMod);
const COLORS = colorsMod.borders ?? colorsMod;

describe("Registration form - Password field", () => {

    beforeEach(()=> {
        cy.visit("/")
        cy.contains(".btn-primary", "Sign up").click()
    })

    const inputSelector = "#signupPassword"
    const errorSelector = "#signupPassword + .invalid-feedback"

    CASES.forEach((c) => {
        const test = c.skip ? it.skip : it;
        test(c.title + (c.skipReason ? `[${c.skipReason}]` : ""), () => {
            assertTextFieldUI({
                inputSelector,
                errorSelector,
                value: c.input.password,
                expected: c.expected,
                borderKey: c.borderColor,
                colors: COLORS
            })

        })
    })
})
