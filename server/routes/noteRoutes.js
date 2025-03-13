const express = require("express");
const {
  createNote,
  updateNote,
  getNotesByUser,
  deleteNote,
  updateNoteCategory,
  updateNoteStatus,
} = require("../controllers/noteController");

const router = express.Router();

router.get("/notes", getNotesByUser);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.put("/notes/status/:id", updateNoteStatus);
router.patch("/notes/:id", updateNoteCategory);
router.delete("/notes/:id", deleteNote);

module.exports = router;
