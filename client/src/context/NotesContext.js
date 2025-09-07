import React, { createContext, useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../config";
import { AuthContext } from "./AuthContext";

export const NotesContext = createContext();

export const NotesContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All Notes");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("active");
  const [searchedNote, setSearchedNote] = useState("");
  const [viewMode, setViewMode] = useState("preview");
  const [content, setContent] = useState("");

  const handleSearchNote = (e) => {
    setSearchedNote(e.target.value);
  };

  const fetchCategories = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/categories?uid=${currentUser.uid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();

      if (result.success) {
        setCategories(result.categories);
      } else {
        toast.error(result.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.log("server error", error);
      toast.error("Server error");
    }
  }, [currentUser]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        categories,
        setCategories,
        currentNote,
        setCurrentNote,
        filteredNotes,
        setFilteredNotes,
        currentCategory,
        setCurrentCategory,
        searchedNote,
        setSearchedNote,
        handleSearchNote,
        fetchCategories,
        viewMode,
        setViewMode,
        content,
        setContent,
        status,
        setStatus,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
