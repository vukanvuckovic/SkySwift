describe("Search works", () => {
  it("Loads flights for the search", () => {
    cy.visit("/");

    cy.get("[data-test='from-airport-picker']").type("Miami");
    cy.get("[data-test='airport-picker-option']").click();

    cy.get("[data-test='to-airport-picker']").type("Dubai");
    cy.get("[data-test='airport-picker-option']").click();

    cy.get("[data-test='departure-date-trigger']").click();
    cy.get("[data-test='departure-date-picker']").clear().type("2025-03-15");

    // cy.window().its("store").invoke("dispatch", {
    //   type: "search/setDepartureDate",
    //   payload: "2025-03-15",
    // });

    cy.intercept("POST", "/api/graphql").as("getFlights");

    cy.get("[data-test='search-button']").click();

    cy.url().should("include", "/booking/availability");

    cy.wait("@getFlights");

    cy.get(
      "[data-test='direct-flights-container'], [data-test='connected-flights-container']"
    ).should("have.length.above", 0);
  });
});
