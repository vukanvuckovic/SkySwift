/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email?: string, password?: string): Chainable<void>;
  }
}

Cypress.Commands.add(
  "login",
  (
    email: string = "vukanvuckovictest@gmail.com",
    password: string = "vukan123"
  ) => {
    cy.visit("/");

    cy.wait(2000);

    cy.get("[data-test='login-popover-trigger']").click();
    cy.get("[data-test='auth-email']").type(email);
    cy.get("[data-test='auth-password']").type(password);

    cy.intercept("POST", "/api/graphql").as("loginRequest");

    cy.get("[data-test='auth-button']").click();

    cy.wait("@loginRequest");

    cy.get("[data-test='user-username']")
      .should("exist")
      .and("contain.text", "Vukan Test");
  }
);
