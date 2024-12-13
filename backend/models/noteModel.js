import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true, // Trim whitespace
    },
    content: {
      type: String,
      required: true, // Content is required
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", noteSchema);
