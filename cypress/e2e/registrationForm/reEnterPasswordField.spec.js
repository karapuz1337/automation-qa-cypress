import casesMod from '../../fixtures/registration/reEnterPasswordField.json';
import colorsMod from '../../fixtures/colors.json';
import { assertTextFieldUI } from '../../support/assertTextFieldUI';

const CASES = (casesMod?.default ?? casesMod);
const COLORS = colorsMod.borders ?? colorsMod;

describe("Registration form - Re-enter password field", () => {

    beforeEach(()=> {
        cy.visit("/")
        cy.contains(".btn-primary", "Sign up").click()
    })

    const inputSelector = "#signupRepeatPassword"
    const errorSelector = "#signupRepeatPassword + .invalid-feedback"

    CASES.forEach((c) => {
        const test = c.skip ? it.skip : it;
        test(c.title + (c.skipReason ? `[${c.skipReason}]` : ""), () => {
            // Input password first
            cy.get("#signupPassword").type(c.input.password, {sensitive:true})

            assertTextFieldUI({
                inputSelector,
                errorSelector,
                value: c.input.reEnterPassword,
                expected: c.expected,
                borderKey: c.borderColor,
                colors: COLORS
            })

        })
    })
})
