import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";

// icons
import {
  Archive,
  ChevronLeft,
  Edit,
  Eye,
  FilePlus,
  Heart,
  List,
  Search,
} from "react-feather";
import { Sparkles } from "lucide-react";

import debounce from "lodash.debounce";
import "./ToggleWritingTools.css";
import { toast } from "react-toastify";
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/themes/prism-funky.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import WritingTools from "./WritingTools";
import "./WritingTools.scss";
import axios from "axios";
import SpinLoader from "../SpinLoader/SpinLoader";
import API_BASE_URL from "../../config";
import { UIContext } from "../../context/UIContext";
import { NotesContext } from "../../context/NotesContext";
import { WritingToolsContext } from "../../context/WritingToolsContext";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
const AUTO_SAVE_DELAY = 1000;

const Note = () => {
  const { currentUser } = useContext(AuthContext);

  const { setShowSidebar, setShowNotesList, showTempNote, setShowTempNote } =
    useContext(UIContext);
  const {
    viewMode,
    setViewMode,
    searchedNote,
    handleSearchNote,
    content,
    setContent,
    notes,
    setNotes,
    currentNote,
    setCurrentNote,
    setCurrentCategory,
    status,
    setStatus,
  } = useContext(NotesContext);

  const { writingToolsMode, setWritingToolsMode } =
    useContext(WritingToolsContext);
  const GEMINI_INSTRUCTIONS_PROMPT = `Return formatted text by converting it to markdown`;
  const [loading, setLoading] = useState(false);

  const [isFavorite, setIsFavorite] = useState(
    currentNote?.status === "favorite"
  );

  const defaultContent = `# Welcome to Noteme!

- **Add to Favorites ❤️ :**  Keep your most important notes close at hand.
- **Add to category 🗂️ :** Organize your notes for easy retrieval.
- **Archive 🗄️ :**  Store notes you don't need right now, but want to keep.
- **Delete 🗑️ :**  Remove notes you no longer need.
- **Search 🔎 :**  Quickly find the note you're looking for.
- **Save in real time 📋 :** Never worry about losing your work.
- **AI based Writing tools ✨ :**  Summarize, refactor, or create text-based content with ease.
- **Built-in markdown previewer 👁️‍🗨️ :**  See your notes exactly as they'll look when you share them.
  `;

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || "");
      setStatus(currentNote.status || "active");
      setIsFavorite(currentNote.status === "favorite");
    } else {
      setContent("");
      setStatus("active");
      setIsFavorite(false);
    }
  }, [currentNote, setStatus, setContent]);

  const saveNote = async () => {
    if (!content.trim()) return;

    const firstLine = content.split("\n")[0] || "Untitled";
    const title = firstLine.startsWith("#")
      ? firstLine.substring(1)
      : firstLine;

    const method = currentNote ? "PUT" : "POST";
    const url = currentNote
      ? `${API_BASE_URL}/api/notes/${currentNote._id}`
      : `${API_BASE_URL}/api/notes`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, user: currentUser.uid, status }),
      });

      const result = await response.json();
      if (result.success) {
        if (!currentNote) {
          setShowTempNote(false);
          setCurrentNote(result.note);
          setNotes((prevNotes) => [...prevNotes, result.note]);
        } else {
          setCurrentNote(result.note);
          setNotes((prevNotes) =>
            prevNotes.map((note) =>
              note._id === result.note?._id ? result.note : note
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to save note", error);
    }
  };

  const debouncedSaveNote = useCallback(debounce(saveNote, AUTO_SAVE_DELAY), [
    content,
  ]);

  useEffect(() => {
    debouncedSaveNote();
    return () => debouncedSaveNote.cancel();
  }, [content]);

  // manual save on ctrl+s
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        console.log("save note called using key binding");
        saveNote();
        debouncedSaveNote.cancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown); // cleanup on unmount
    };
  }, []);

  const handleToggleFavorite = async () => {
    if (!currentNote) return;

    const newStatus = status === "favorite" ? "active" : "favorite";
    setStatus(newStatus);
    setIsFavorite(newStatus === "favorite");

    try {
      await axios.put(`${API_BASE_URL}/api/notes/status/${currentNote._id}`, {
        status: newStatus,
      });

      setCurrentNote((prevNote) => ({ ...prevNote, status: newStatus })); // Update note state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === currentNote._id ? { ...note, status: newStatus } : note
        )
      );

      toast.success(
        newStatus === "favorite" ? "Marked as Favorite" : "Unmarked"
      );
    } catch (error) {
      console.error("Error updating favorite status", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleArchive = async () => {
    if (!currentNote) return;

    const newStatus = status === "archived" ? "active" : "archived";
    setStatus(newStatus);

    try {
      await axios.put(`${API_BASE_URL}/api/notes/status/${currentNote._id}`, {
        status: newStatus,
      });

      setCurrentNote((prevNote) => ({ ...prevNote, status: newStatus })); // Update note state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === currentNote._id ? { ...note, status: newStatus } : note
        )
      );

      toast.success(newStatus === "archived" ? "Archived" : "Unarchived");
    } catch (error) {
      console.error("Error updating archive status", error);
      toast.error("Failed to update archive status");
    }
  };

  const handleToggleViewMode = () => {
    setViewMode(viewMode === "edit" ? "preview" : "edit");
    viewMode === "edit"
      ? toast.success("Now in View Mode")
      : toast.success("Now in Edit Mode");
  };

  useEffect(() => {
    if (viewMode === "preview") {
      Prism.highlightAll();
    }
  }, [viewMode, content]);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);
  const renderContent = () => {
    if (notes.length === 0) {
      setShowTempNote(true);
      setContent(defaultContent);
    }
    if (viewMode === "preview") {
      const html = marked.parse(content, { breaks: true, gfm: true });

      return <div id="preview" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return (
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        id="note-content"
        placeholder="Write away"
      ></textarea>
    );
  };
  // Function to handle file selection and trigger the upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdfFile", file);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/upload-pdf`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        markdownPDF(response.data.text);
      } catch (error) {
        console.error("Error uploading or parsing PDF", error);
        toast.error("Error reading the PDF");
      } finally {
        e.target.value = "";
        toast.success("File imported, Parsing...");
      }
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const chatHistory = [
    {
      role: "user",
      parts: [
        {
          text: GEMINI_INSTRUCTIONS_PROMPT,
        },
      ],
    },
  ];

  function appendToChatHistory(role, msg) {
    chatHistory.push({
      role: role,
      parts: [{ text: msg }],
    });
  }
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 20000,
    },
  });

  const markdownPDF = async (pdfContent) => {
    setLoading(true);
    let msg = await pdfContent;
    appendToChatHistory("user", msg);

    try {
      const result = await chat.sendMessageStream(msg);
      let text = "";
      try {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          text += chunkText;
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      appendToChatHistory("model", text);
      if (msg.trim() !== "") {
        setContent(text);
        setLoading(false);
        toast.success("File parsed successfully");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("failed to refactor PDF :(");
    }
    msg = "";
  };

  return (
    <div
      className="Note"
      onClick={() => {
        setShowNotesList(false);
        setShowSidebar(false);
        setWritingToolsMode(false);
      }}
    >
      <div className="toolbar">
        <div className="actions">
          <ChevronLeft
            className="icon back"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar((showSidebar) => !showSidebar);
              setShowNotesList(false);
            }}
          />
          <List
            className="icon list"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotesList((showNotesList) => !showNotesList);
              setShowSidebar(false);
            }}
          />
          <div
            className="btn--toggle-edit-or-preview"
            onClick={handleToggleViewMode}
          >
            {viewMode === "preview" ? (
              <Edit className="icon" />
            ) : (
              <Eye className="icon" />
            )}
          </div>
          <div
            className={`btn--toggle-favorite`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`icon ${status === "favorite" ? "fill" : ""}`} />
          </div>
          <div className="btn--move-content-to-archive" onClick={handleArchive}>
            <Archive
              className={`icon ${status === "archived" ? "fill" : ""}`}
            />
          </div>
        </div>
        <div className="fileExplorer">
          <label htmlFor="import">
            {loading && <SpinLoader />}
            {!loading && <FilePlus className="icon" />}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
            id="import"
            hidden
          />
        </div>
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
          className="btn--toggle-writing-tools"
          onClick={(e) => {
            e.stopPropagation();
            setWritingToolsMode(true);
          }}
        >
          <button className="uiverse">
            <div className="wrapper">
              <span>
                <Sparkles size={15} fill="white" />
              </span>
              <div className="circle circle-12"></div>
              <div className="circle circle-11"></div>
              <div className="circle circle-10"></div>
              <div className="circle circle-9"></div>
              <div className="circle circle-8"></div>
              <div className="circle circle-7"></div>
              <div className="circle circle-6"></div>
              <div className="circle circle-5"></div>
              <div className="circle circle-4"></div>
              <div className="circle circle-3"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-1"></div>
            </div>
          </button>
        </div>
      </div>

      {(showTempNote || currentNote) && (
        <div className="main">
          {currentNote && (
            <div className="updatedAt">
              {new Date(currentNote?.updatedAt)?.toDateString()}
              {` at `}
              {new Date(currentNote?.updatedAt)?.getHours()}:
              {new Date(currentNote?.updatedAt)?.getMinutes()}
            </div>
          )}
          {renderContent()}
        </div>
      )}
      {!currentNote && (
        <div
          className="main"
          onClick={() => {
            setCurrentCategory("All Notes");
            setViewMode("edit");
            setShowTempNote(true);
          }}
        ></div>
      )}
      {writingToolsMode && <WritingTools />}
    </div>
  );
};

export default Note;
