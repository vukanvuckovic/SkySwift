describe("Auth works", () => {
  it("creates account successfully", () => {
    cy.visit("/");

    cy.wait(2000);

    cy.get("[data-test='login-popover-trigger']").click();
    cy.get("[data-test='register-button']").click();

    cy.get("[data-test='auth-first-name']").type("Vukan Test");
    cy.get("[data-test='auth-last-name']").type("Vuckovic Test");
    cy.get("[data-test='auth-email']").type("vukanvuckovictest@gmail.com");
    cy.get("[data-test='auth-password']").type("vukan123");

    cy.intercept("POST", "/api/graphql").as("loginRequest");

    cy.get("[data-test='auth-button']").click();

    cy.wait("@loginRequest");

    cy.get(".toast-data-test")
      .should("be.visible")
      .and(($el) => {
        const text = $el.text();
        expect(text).to.match(/Registration successful|User already exists/i);
      });
  });

  it("performs login action successfully", () => {
    cy.login();
  });

  it("logs out the user", () => {
    cy.login();

    cy.get("[data-test='user-popover-trigger']").click();

    cy.intercept("POST", "/api/graphql").as("logoutRequest");

    cy.get("[data-test='popover-logout-button']").click();

    cy.wait("@logoutRequest");

    cy.get("[data-test='login-popover-trigger']").should("exist");

    cy.getCookie("session").should("not.exist");
  });
});
