import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import API_BASE_URL from "../config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showTempNote, setShowTempNote] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All Notes");
  const [status, setStatus] = useState("active");
  const [content, setContent] = useState("");
  const [writingToolsMode, setWritingToolsMode] = useState(false);
  const [resultGlobal, setResultGlobal] = useState("");
  const [viewMode, setViewMode] = useState("preview");
  const [showNotesList, setShowNotesList] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchedNote, setSearchedNote] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        console.log(user.uid);
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // ✅ Mark loading as complete
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSearchNote = (e) => {
    setSearchedNote(e.target.value);
    console.log(searchedNote);
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

  // useEffect(() => {
  //   if (currentUser) {
  //     setNotes([]); // Clear previous user's notes
  //     setCategories([]);
  //   }
  // }, [currentUser]); // Run when `user` changes

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        showTempNote,
        setShowTempNote,
        currentNote,
        setCurrentNote,
        setNotes,
        notes,
        filteredNotes,
        setFilteredNotes,
        currentCategory,
        setCurrentCategory,
        status,
        setStatus,
        content,
        setContent,
        writingToolsMode,
        setWritingToolsMode,
        resultGlobal,
        setResultGlobal,
        viewMode,
        setViewMode,
        showSidebar,
        setShowSidebar,
        showNotesList,
        setShowNotesList,
        categories,
        setCategories,
        fetchCategories,
        searchedNote,
        setSearchedNote,
        handleSearchNote,
        settingsOpen,
        setSettingsOpen,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
