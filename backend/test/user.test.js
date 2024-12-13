import { use, expect } from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const chai = use(chaiHttp);
chai.should();

process.env.NODE_ENV = "test";

let userEmails = [];

describe("User APIs", () => {
  after(async () => {
    for (const email of userEmails) {
      const user = await User.findOneAndDelete({ email });
    }
  });

  describe("POST /signup", () => {
    it("Should sign up a new user", (done) => {
      const newUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "StrongPassword123!",
      };

      chai.request
        .execute(app)
        .post("/api/user/signup")
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("username", newUser.username);
          expect(res.body).to.have.property("email", newUser.email);
          expect(res.body).to.have.property("token");

          userEmails.push(newUser.email);
          done();
        });
    });

    it("Should return an error if username is missing", (done) => {
      const newUser = {
        email: "testuser@example.com",
        password: "StrongPassword123!",
      };

      chai.request
        .execute(app)
        .post("/api/user/signup")
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            "error",
            "All fields must be filled"
          );
          done();
        });
    });

    it("Should return an error if email is invalid", (done) => {
      const newUser = {
        username: "testuser",
        email: "invalid-email",
        password: "StrongPassword123",
      };

      chai.request
        .execute(app)
        .post("/api/user/signup")
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Email is not valid");
          done();
        });
    });

    it("Should return an error if password is not strong enough", (done) => {
      const newUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "weakpass",
      };

      chai.request
        .execute(app)
        .post("/api/user/signup")
        .send(newUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            "error",
            "Password is not strong enough"
          );
          done();
        });
    });

    it("Should return an error if email or username already exists", async () => {
      const existingUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "StrongPassword123!",
      };

      // Try to sign up again with the same credentials
      const res = await chai.request
        .execute(app)
        .post("/api/user/signup")
        .send(existingUser);

      // Check the response
      expect(res).to.have.status(400);
      expect(res.body).to.have.property(
        "error",
        "Email or Username already in use"
      );
    });
  });

  describe("POST /login", () => {
    it("Should log in the user with valid credentials", (done) => {
      const validUser = {
        username: "testuser",
        password: "StrongPassword123!",
      };
      chai.request
        .execute(app)
        .post("/api/user/login")
        .send(validUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("username", validUser.username);
          expect(res.body).to.have.property("token");
          done();
        });
    });

    it("Should return an error if username is incorrect", (done) => {
      const invalidUser = {
        username: "wronguser",
        password: "StrongPassword123!",
      };

      chai.request
        .execute(app)
        .post("/api/user/login")
        .send(invalidUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Incorrect username");
          done();
        });
    });

    it("Should return an error if password is incorrect", (done) => {
      const invalidPasswordUser = {
        username: "testuser",
        password: "WrongPassword123!",
      };

      chai.request
        .execute(app)
        .post("/api/user/login")
        .send(invalidPasswordUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property("error", "Incorrect password");
          done();
        });
    });

    it("Should return an error if username or password is missing", (done) => {
      const missingFieldUser = {
        username: "testuser",
      };

      chai.request
        .execute(app)
        .post("/api/user/login")
        .send(missingFieldUser)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body).to.have.property(
            "error",
            "All fields must be filled"
          );
          done();
        });
    });
  });

  describe("POST /forgetPassword", () => {
    it("Should send a reset password email for a valid user", (done) => {
      const email = "testuser@example.com";
      chai.request
        .execute(app)
        .post("/api/user/forgetPassword")
        .send({ email })
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").eql("Email Sent");
          done();
        });
    });
    it("Should return an error if user is not found", (done) => {
      const invalidEmail = "test@example.com";
      chai.request
        .execute(app)
        .post("/api/user/forgetPassword")
        .send({ invalidEmail })
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").eql("User not found");
          done();
        });
    });
  });

  describe("POST /reset-password/:token", () => {
    let validToken;
    let invalidToken;
    let user;

    before(async () => {
      user = await User.create({
        username: "testuser123",
        email: "testuser123@example.com",
        password: "StrongPassword123!",
      });

      userEmails.push(user.email);

      validToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "10m",
      });
      const fakeObjectId = new mongoose.Types.ObjectId();

      const fakeId = fakeObjectId.toString();
      invalidToken = jwt.sign(fakeId, process.env.SECRET);
    });

    it("Should successfully reset password for valid token and new password", (done) => {
      const newPassword = "NewStrongPassword123!";
      chai.request
        .execute(app)
        .post(`/api/user/reset-password/${validToken}`)
        .send({ password: newPassword })
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").eql("Password Updated");
          done();
        });
    });

    it("Should return error when password is not strong enough", (done) => {
      const weakPassword = "123";
      chai.request
        .execute(app)
        .post(`/api/user/reset-password/${validToken}`)
        .send({ password: weakPassword })
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property("message")
            .eql("Password is not strong enough");
          done();
        });
    });

    it("Should return error for a non-existent user", (done) => {
      chai.request
        .execute(app)
        .post(`/api/user/reset-password/${invalidToken}`)
        .send({ password: "NewStrongPassword123!" })
        .end((err, res) => {
          if (err) done(err);

          // Assert the response
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("message").eql("No user found");
          done();
        });
    });
  });
});
