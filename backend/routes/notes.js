import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  deleteNote,
  updateNote,
} from "../controllers/noteController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// require auth for all note routes
router.use(requireAuth);

// GET all notes
router.get("/", getNotes);

// GET a single note
router.get("/:id", getNote);

// POST a new note
router.post("/", createNote);

// DELETE a note
router.delete("/:id", deleteNote);

// UPDATE a note
router.patch("/:id", updateNote);

export default router;
