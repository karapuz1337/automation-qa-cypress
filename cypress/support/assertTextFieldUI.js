
// Helper function to test text fields UI
export function assertTextFieldUI({
                                      inputSelector,
                                      errorSelector,
                                      value,
                                      expected,         // empty string for valid cases; non-empty for invalid
                                      borderKey,        // "Red" | "Default" from fixtures
                                      colors            // COLORS.borders or a flat map like { Red: "...", Default: "..." }
                                  }) {
    const negative = Boolean(expected && expected.length);
    const color = (colors.borders || colors)[borderKey];

    // Handle empty string without cy.type('')
    const isEmpty = value === '' || value === undefined || value === null;

    // Type something and clear it so the text field is not pristine
    if (isEmpty) {
        cy.get(inputSelector).type("x")
        cy.get(inputSelector).clear()
        cy.get(inputSelector).blur();
    } else
    {
        cy.get(inputSelector).clear();
        cy.get(inputSelector).type(value);
        cy.get(inputSelector).blur();
    }

    // Check style + state
    cy.get(inputSelector)
        .should(negative ? 'have.class' : 'not.have.class', 'is-invalid')
        .and('have.css', 'border-top-color', color);

    // Error visibility
    if (negative) {
        cy.get(errorSelector).should('be.visible').and('contain', expected);
    } else {
        cy.get(errorSelector).should('not.exist');

        // Verify trimming for the “with spaces” valid cases
        if (value.trim() !== value) {
            cy.get(inputSelector).invoke('val').should('eq', value.trim());
        }
    }
}