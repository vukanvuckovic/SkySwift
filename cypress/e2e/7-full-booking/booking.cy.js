describe("Booking works", () => {
  it("booking", () => {
    cy.visit("/");

    cy.get("[data-test='from-airport-picker']").type("Miami");
    cy.get("[data-test='airport-picker-option']").click();

    cy.get("[data-test='to-airport-picker']").type("Dubai");
    cy.get("[data-test='airport-picker-option']").click();

    cy.window().its("store").invoke("dispatch", {
      type: "search/setDepartureDate",
      payload: "2025-03-15",
    });

    cy.intercept("POST", "/api/graphql").as("getFlights");

    cy.get("[data-test='search-button']").click();

    cy.url().should("include", "/booking/availability");

    cy.wait("@getFlights");

    cy.get(
      "[data-test='direct-flights-container'], [data-test='connected-flights-container']"
    ).should("have.length.above", 0);

    cy.get("[data-test='flight-item']").first().click();
    cy.get("[data-test='flight-class-button']").first().click();

    cy.get(".toast-data-test")
      .should("be.visible")
      .and(($el) => {
        const text = $el.text();
        expect(text).to.match(/Flight added/i);
      });

    cy.get("[data-test='footer-continue']").as("footerContinue").click();

    cy.get("[data-test='passenger-info-first-name']").type("Vukan");
    cy.get("[data-test='passenger-info-last-name']").type("Vuckovic");
    cy.get("[data-test='passenger-info-birth']").type("2005-11-20");
    cy.get("[data-test='passenger-info-gender']").click();
    cy.get("[data-test='passenger-info-email']").type(
      "vukanvuckovich11@gmail.com"
    );
    cy.get("[data-test='passenger-info-phone']").type("1234123123");
    cy.get("[data-test='passenger-info-contact']").type(
      "vukanvuckovic@gmail.com"
    );

    cy.get("@footerContinue").click();

    cy.get("[data-test='seat-button']").first().click();
    cy.get("[data-test='add-seat-button']").click();
    cy.get(".toast-data-test")
      .should("be.visible")
      .and(($el) => {
        const text = $el.text();
        expect(text).to.match(/seat added/i);
      });

    cy.get("@footerContinue").click();

    cy.get("[data-test='additional-services-trigger']").first().click();
    cy.get("[data-test='add-additional-service']").first().click();
    cy.get(".toast-data-test")
      .should("be.visible")
      .and(($el) => {
        const text = $el.text();
        expect(text).to.match(/service added/i);
      });

    cy.get("@footerContinue").click();

    cy.intercept("POST", "/api/graphql").as("postBooking");

    cy.get("[data-test='card-holder']").type("Vukan Vuckovic");
    cy.get("[data-test='card-number']").type("1234123123");
    cy.get("[data-test='card-expiry']").type("112");
    cy.get("[data-test='card-cvc']").type("123");

    cy.get("[data-test='payment-button']").click();

    cy.wait("@postBooking");

    cy.get("[data-test='booking-popup-title']").should("be.visible");
  });
});
