
describe("Footer elements", ()=> {

    beforeEach(() => {
        cy.visit("/")
    })

    it("Contacts - Social links are in correct order", () => {
        // Clarify the expected links and order
        const expectedSocialLinks = [
            "https://www.facebook.com/Hillel.IT.School",
            "https://t.me/ithillel_kyiv",
            "https://www.youtube.com/user/HillelITSchool?sub_confirmation=1",
            "https://www.instagram.com/hillel_itschool/",
            "https://www.linkedin.com/school/ithillel/"
        ]

        // Check that the links are present and are in the correct order
        cy.get(".contacts_socials a.socials_link")
            .should('have.length', expectedSocialLinks.length)
            .each(($link, index) => {
                cy.wrap($link)
                    .should('have.attr', 'href', expectedSocialLinks[index])
                    .and('have.attr', 'target', '_blank')
                    .and('have.attr', 'rel', 'nofollow')
            })
    })

    it("Contacts - Social links have correct icons", () => {
        // Check that each link has the correct icon class
        const expectedIcons = [
            'icon-facebook',
            'icon-telegram',
            'icon-youtube',
            'icon-instagram',
            'icon-linkedin'
        ]

        cy.get(".contacts_socials a.socials_link span.socials_icon")
            .each(($icon, index) => {
                cy.wrap($icon).should('have.class', expectedIcons[index])
            })
    })

    it("Contacts - the 'ithillel.ua' link", () => {

        // Find the element and create alias
        cy.get(".contacts a[href='https://ithillel.ua']").as("link")

        // Check that it contains the correct text
        cy.get("@link").should("contain.text", "ithillel.ua")

        // Check that it has the correct link - https://ithillel.ua
        cy.get("@link").invoke("attr", "href").should("eq", "https://ithillel.ua")

    })

    it("Contacts - the support mailbox link", () => {
        // Find the element and create alias
        cy.get(".contacts a[href^='mailto:']").as("mail")

        // Check that it contains the correct text
        cy.get("@mail").should("contain.text", "support@ithillel.ua")

        // Check that it has the correct link - https://ithillel.ua
        cy.get("@mail").invoke("attr", "href").should("eq", "mailto:developer@ithillel.ua")
    })

    it("Footer logo", () => {
        // Find the target element and create an alias
        cy.get(".footer_logo").as("logo")

        // Check that the element has a hyperlink
        cy.get("@logo").should("have.attr", "href")

        // Check that the element has the correct link
        const expectedLink = "/"
        cy.get("@logo").invoke("attr", "href").should("eq", expectedLink)

        // Check that the correct page is opened on click
        cy.get("@logo").click()
        cy.location('pathname').should('eq', '/')
    })
})