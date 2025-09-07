const Note = require("../models/Note");
const asyncHandler = require("../middlewares/asyncHandler");

// create a note
const createNote = async (req, res) => {
  const { title, content, category, user } = req.body;

  if (!content?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Content cannot be empty" });
  }

  const note = new Note({
    title: title || "Untitled",
    content,
    category,
    user,
  });

  await note.save();
  res.status(201).json({ success: true, note });
};

// update a note
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, status } = req.body;

  if (!content?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Content cannot be empty" });
  }

  const note = await Note.findByIdAndUpdate(
    id,
    { title, content, category, status, updatedAt: Date.now() },
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.status(200).json({ success: true, note });
};

// update note status
const updateNoteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const note = await Note.findByIdAndUpdate(
    id,
    { status, updatedAt: Date.now() },
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.status(200).json({ success: true, note });
};

// update note category
const updateNoteCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  const note = await Note.findByIdAndUpdate(
    id,
    { category: category || null },
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.status(200).json({ success: true, note });
};

// delete note
const deleteNote = async (req, res) => {
  const { id } = req.params;

  const note = await Note.findByIdAndDelete(id);

  if (!note) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.status(200).json({ success: true, message: "Note deleted successfully" });
};

// get notes by user
const getNotesByUser = async (req, res) => {
  const { userId } = req.query;

  const notes = await Note.find({ user: userId });
  res.status(200).json({ success: true, notes });
};

module.exports = {
  createNote,
  updateNote,
  updateNoteStatus,
  updateNoteCategory,
  deleteNote,
  getNotesByUser,
};
