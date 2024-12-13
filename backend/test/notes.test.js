import { use, expect } from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Note from "../models/noteModel.js";

const chai = use(chaiHttp);
chai.should();

process.env.NODE_ENV = "test";

let token;
let userId;
let noteIds = [];

describe("Notes APIs", () => {
  before(async () => {
    const user = await User.create({
      username: "testuser123",
      email: "testuser123@example.com",
      password: "Testpassword123!",
    });

    userId = user._id;

    token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "3d",
    });
    const notes = await Note.create([
      {
        title: "Test Note 1",
        content: "This is the first test note",
        user_id: user._id,
      },
      {
        title: "Test Note 2",
        content: "This is the second test note",
        user_id: user._id,
      },
    ]);
    noteIds = notes.map((note) => note._id);
  });
  after(async () => {
    // Delete the test notes and user after the tests are complete
    await Note.deleteMany({ user_id: userId });
    await User.deleteOne({ _id: userId });
  });
  describe("GET /api/notes", () => {
    it("Should get all notes of a user", (done) => {
      chai.request
        .execute(app)
        .get("/api/notes/")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
  describe("GET /api/notes/:id", () => {
    it("Should get a single note by id", (done) => {
      chai.request
        .execute(app)
        .get(`/api/notes/${noteIds[0]}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title").eql("Test Note 1");
          expect(res.body)
            .to.have.property("content")
            .eql("This is the first test note");
          done();
        });
    });
  });
  describe("POST /api/notes", () => {
    it("Should create a new note", (done) => {
      const newNote = {
        title: "New Test Note for POST",
        content: "This is a new note",
      };
      chai.request
        .execute(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send(newNote)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title").eql(newNote.title);
          expect(res.body).to.have.property("content").eql(newNote.content);
          expect(res.body).to.have.property("user_id").eql(userId.toString());

          noteIds.push(res.body._id);

          done();
        });
    });
    it("Should return error if content is missing", (done) => {
      const newNote = {
        title: "Test Note Without Content",
      };

      chai.request
        .execute(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send(newNote)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(400);
          expect(res.body)
            .to.have.property("error")
            .eql("Please fill in Note's Content");
          done();
        });
    });
  });
  describe("DELETE /api/notes/:id", () => {
    it("Should delete a note by id", (done) => {
      const noteId = noteIds[0];
      chai.request
        .execute(app)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title").eql("Test Note 1");
          expect(res.body)
            .to.have.property("content")
            .eql("This is the first test note");

          Note.findById(noteId)
            .then((note) => {
              expect(note).to.be.null; // Note should be deleted
              done();
            })
            .catch((err) => done(err));
        });
    });
    it("Should return an error for an invalid note id", (done) => {
      const invalidNoteId = "12345invalidId";
      chai.request
        .execute(app)
        .delete(`/api/notes/${invalidNoteId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").eql("No such note");
          done();
        });
    });
  });
  describe("PATCH /api/notes/:id", () => {
    it("Should update a note", (done) => {
      const noteId = noteIds[1];
      const updatedNote = {
        title: "Updated Note Title",
        content: "This is the updated content of the note.",
      };
      chai.request
        .execute(app)
        .patch(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNote)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title").eql(updatedNote.title);
          expect(res.body).to.have.property("content").eql(updatedNote.content);

          done();
        });
    });
    it("Should return an error for an invalid note id", (done) => {
      const invalidNoteId = "12345invalidId";
      const updatedNote = {
        title: "Updated Note Title",
        content: "This is the updated content of the note.",
      };
      chai.request
        .execute(app)
        .delete(`/api/notes/${invalidNoteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNote)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").eql("No such note");
          done();
        });
    });
  });
});
