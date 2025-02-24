describe("Booking status works", () => {
  it("Status check workflow", () => {
    cy.visit("/");

    cy.wait(2000);

    cy.get("[data-test='booking-status-popover-trigger']").click();
    cy.get("[data-test='booking-status-email']").type("vukan@gmail.com");
    cy.get("[data-test='booking-status-code']").type(
      "67c1c9bc86084da535c92dd7"
    );

    cy.intercept("POST", "/api/graphql").as("statusRequest");

    cy.get("[data-test='booking-status-button']").click();

    cy.url().should("include", "/booking-status");

    cy.wait("@statusRequest");

    cy.get("[data-test='booking-status-card']").should("exist");
  });
});
