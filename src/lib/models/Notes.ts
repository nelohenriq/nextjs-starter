import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
