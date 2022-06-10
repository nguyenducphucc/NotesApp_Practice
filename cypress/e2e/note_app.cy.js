describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "john",
      username: "jony",
      password: "18346183461",
    };
    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });

  it("login fails with wrong password", function () {
    cy.contains("login").click();
    cy.get("#username").type("jony");
    cy.get("#password").type("72946729467");
    cy.get("#login-button").click();

    cy.get(".error").should("contain", "Wrong credentials");
    cy.get("html").should("not.contain", "Welcome john");
  });

  it("user can login", function () {
    cy.contains("login").click();
    cy.get("#username").type("jony");
    cy.get("#password").type("18346183461");
    cy.get("#login-button").click();

    cy.contains("Welcome john");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "jony", password: "18346183461" });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type(
        "a note is automatically created for testing by cypress"
      );
      cy.contains("save").click();
      cy.contains("a note is automatically created for testing by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({
          content: "a note is automatically created for testing by cypress",
          important: false,
        });
      });

      it("it can be made important", function () {
        cy.contains("a note is automatically created for testing by cypress")
          .contains("make important")
          .click();
        cy.contains(
          "a note is automatically created for testing by cypress"
        ).contains("make not important");
      });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: "false" });
        cy.createNote({ content: "second note", important: "false" });
        cy.createNote({ content: "third note", important: "false" });
      });

      it("one of those can be made important", function () {
        cy.contains("second note").contains("make important").click();
        cy.contains("second note").contains("make not important");
      });

      it("then example", function () {
        cy.get("button").then((buttons) => {
          console.log("number of buttons", buttons.length);
          cy.wrap(buttons[0]).click();
        });
      });
    });
  });
});
