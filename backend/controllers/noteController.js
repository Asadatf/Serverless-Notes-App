import Note from "../models/noteModel.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

// get all notes
const getNotes = async (req, res) => {
  const user_id = req.user._id;

  try {
    logger.info(`Fetching all notes for user ID: ${user_id}`);
    const notes = await Note.find({ user_id }).sort({ createdAt: -1 });
    logger.info(`Successfully fetched notes for user ID: ${user_id}`);
    res.status(200).json(notes);
  } catch (error) {
    logger.error(
      `Error fetching notes for user ID: ${user_id} - ${error.message}`
    );
    res.status(400).json({ error: "Could not fetch notes" });
  }
};

// get a single note
const getNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID provided: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }

  try {
    logger.info(`Fetching note with ID: ${id}`);
    const note = await Note.findById(id);
    if (!note) {
      logger.warn(`No note found with ID: ${id}`);
      return res.status(400).json({ error: "No such note" });
    }
    logger.info(`Successfully fetched note with ID: ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error fetching note with ID: ${id} - ${error.message}`);
    res.status(400).json({ error: "Could not fetch the note" });
  }
};

// create a new note
const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    logger.warn(`Failed to create note: Content is missing`);
    return res.status(400).json({ error: "Please fill in Note's Content" });
  }

  try {
    const user_id = req.user._id;
    logger.info(`Creating a new note for user ID: ${user_id}`);
    const note = await Note.create({ title, content, user_id });
    logger.info(
      `Note created successfully for user ID: ${user_id}, Note ID: ${note._id}`
    );
    res.status(200).json(note);
  } catch (error) {
    logger.error(
      `Error creating note for user ID: ${user_id} - ${error.message}`
    );
    res.status(400).json({ error: error.message });
  }
};

// delete a note
const deleteNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID provided for deletion: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }

  try {
    logger.info(`Attempting to delete note with ID: ${id}`);
    const note = await Note.findOneAndDelete({ _id: id });

    if (!note) {
      logger.warn(`No note found to delete with ID: ${id}`);
      return res.status(400).json({ error: "No such note" });
    }

    logger.info(`Successfully deleted note with ID: ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error deleting note with ID: ${id} - ${error.message}`);
    res.status(400).json({ error: "Could not delete the note" });
  }
};

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`Invalid note ID provided for update: ${id}`);
    return res.status(404).json({ error: "No such note" });
  }
  const { title, content } = req.body;
  try {
    logger.info(`Attempting to update note with ID: ${id}`);
    const note = await Note.findOneAndUpdate(
      { _id: id },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      logger.warn(`No note found to update with ID: ${id}`);
      return res.status(400).json({ error: "No such note" });
    }
    logger.info(`Successfully updated note with ID: ${id}`);
    res.status(200).json(note);
  } catch (error) {
    logger.error(`Error updating note with ID: ${id} - ${error.message}`);
    res.status(400).json({ error: "Could not update the note" });
  }
};

export { getNotes, getNote, createNote, deleteNote, updateNote };
