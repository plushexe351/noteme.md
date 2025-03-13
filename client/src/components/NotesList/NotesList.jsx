import React, { useEffect, useContext, useCallback } from "react";
import {
  ChevronLeft,
  Edit,
  Folder,
  Heart,
  List,
  Search,
  Trash2,
} from "react-feather";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";

const NotesList = () => {
  const {
    currentUser,
    setShowTempNote,
    setCurrentNote,
    showTempNote,
    setNotes,
    filteredNotes,
    currentNote,
    categories,
    fetchCategories,
    setViewMode,
    setCurrentCategory,
    searchedNote,
    setSearchedNote,
    handleSearchNote,
    setShowNotesList,
    showNotesList,
    setShowSidebar,
  } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notes?userId=${currentUser.uid}`
      );
      const result = await response.json();
      if (result.success) {
        setNotes(result.notes);
      } else {
        console.error(result.message || "Failed to fetch notes");
      }
    } catch (error) {
      console.error("Server error", error);
    }
  }, [currentUser, setNotes]);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [fetchNotes, fetchCategories, currentUser]);

  const handleDeleteNote = useCallback(
    async (id) => {
      if (showTempNote) {
        setShowTempNote(false);
      } else {
        try {
          await fetch(`${API_BASE_URL}/api/notes/${id}`, {
            method: "DELETE",
          });
          setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
          toast.success("Note Deleted");
        } catch (error) {
          console.error("Failed to delete note", error);
        }
      }
    },
    [showTempNote, setNotes, setShowTempNote]
  );

  const handleNoteClick = useCallback(
    (note) => {
      setCurrentNote(note);
      setShowTempNote(false);
      setShowNotesList(false);
    },
    [setCurrentNote, setShowTempNote]
  );

  const handleCategoryChange = useCallback(
    async (noteId, newCategory) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategory || null }),
        });
        const result = await response.json();
        if (result.success) {
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note._id === noteId
                ? { ...note, category: newCategory || null }
                : note
            )
          );
        } else {
          console.error(result.message || "Failed to update note category");
        }
      } catch (error) {
        console.error("Failed to update note category", error);
      }
    },
    [setNotes]
  );

  return (
    <div className={`NotesList ${showNotesList ? "active" : ""}`}>
      <div className="actions-bar">
        <ChevronLeft
          className="icon back"
          onClick={() => {
            setShowSidebar(true);
            setShowNotesList(false);
          }}
        />
        <List className="icon" onClick={() => setShowNotesList(false)} />
        <div className="search-notes">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchedNote}
            onChange={handleSearchNote}
          />
        </div>
        <div
          className="btn--delete-note"
          onClick={() => handleDeleteNote(currentNote?._id)}
        >
          <Trash2 className="icon" />
        </div>
      </div>
      <div className="notes">
        {showTempNote && (
          <div className="note active" onClick={() => setShowNotesList(false)}>
            <div className="title">Untitled</div>
            <div className="categories">
              <div className="category">
                <Folder className="icon" />
                All Notes
              </div>
            </div>
          </div>
        )}
        {!filteredNotes.length && !showTempNote && (
          <div
            className="note"
            onClick={() => {
              setShowTempNote(true);
              setViewMode("edit");
              setCurrentCategory("All Notes");
            }}
          >
            <div className="title">Nothing here yet</div>
            <div className="categories">
              <div className="category">
                <Edit className="icon" />
                Tap to start writing
              </div>
            </div>
          </div>
        )}
        {[...filteredNotes].reverse().map((note) => (
          <div
            key={note._id}
            className={`note ${currentNote?._id === note._id ? "active" : ""}`}
            onClick={() => handleNoteClick(note)}
          >
            <div className="title">{note.title || "Untitled"}</div>
            <div className="categories">
              <div className="category">
                <Folder className="icon" />

                <select
                  value={note.category || ""}
                  onChange={(e) =>
                    handleCategoryChange(note._id, e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">All Notes</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {note.status === "favorite" && <Heart className="icon fill" />}
                <div className="updatedAt">
                  {new Date(note.createdAt).toDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;
