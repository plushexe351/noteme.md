const Note = require("../models/Note");

const createNote = async (req, res) => {
  try {
    const { title, content, category, user } = req.body;
    if (!content.trim()) {
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;

    if (!content.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Content cannot be empty" });
    }

    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, category, status, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const updateNoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const note = await Note.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

const updateNoteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    // Update the note's category
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { category: category || null },
      { new: true } // Return the updated note
    );

    // Check if note was found and updated
    if (!updatedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("Error updating note category:", error); // Log the error
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getNotesByUser = async (req, res) => {
  try {
    const { userId } = req.query;

    const notes = await Note.find({ user: userId });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports = {
  createNote,
  updateNote,
  updateNoteStatus,
  getNotesByUser,
  deleteNote,
  updateNoteCategory,
};
