import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Star,
  Book,
  Plus,
  Trash2,
  Layers,
  Folder,
  Settings,
  LogOut,
  Archive,
} from "react-feather";
import { auth } from "../../firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import { toast } from "react-toastify";
import SettingsModal from "../Settings/SettingsModal.jsx";
import API_BASE_URL from "../../config.js";

const Sidebar = () => {
  const {
    currentUser,
    setShowTempNote,
    setCurrentNote,
    notes,
    currentCategory,
    setCurrentCategory,
    setFilteredNotes,
    categories,
    setCategories,
    fetchCategories,
    setViewMode,
    searchedNote,
    settingsOpen,
    setSettingsOpen,
    showSidebar,
    setShowSidebar,
    setShowNotesList,
  } = useContext(AuthContext);

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error during sign out", err);
    }
  };

  const handleNewNoteClick = (e) => {
    e.stopPropagation();
    setShowTempNote(true);
    setCurrentNote(null);
    setCurrentCategory("All Notes");
    setViewMode("edit");
    setShowSidebar(false);
  };

  const handleAddCategoryClick = (e) => {
    e.stopPropagation();
    setShowCategoryInput(true);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim())
      return toast.error("Category name cannot be empty");

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, uid: currentUser.uid }),
      });
      const result = await response.json();

      if (result.success) {
        setCategories([...categories, { name: newCategoryName, count: 0 }]);
        setNewCategoryName("");
        setShowCategoryInput(false);
        toast.success("Category created successfully");
        fetchCategories();
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setCategories(categories.filter((cat) => cat._id !== id));
        toast.success("Category deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    if (currentUser) fetchCategories();
  }, [currentUser, fetchCategories]);

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter((note) => {
      if (currentCategory === "All Notes") return note.status !== "archived";
      if (currentCategory === "Favorites") return note.status === "favorite";
      if (currentCategory === "Archived") return note.status === "archived";
      if (currentCategory === "Recently Deleted")
        return note.status === "recently_deleted";
      return note.category === currentCategory;
    });
    return filtered.filter((note) =>
      note.content.toLowerCase().includes(searchedNote.toLowerCase())
    );
  }, [notes, currentCategory, searchedNote]);

  useEffect(
    () => setFilteredNotes(filteredNotes),
    [filteredNotes, setFilteredNotes]
  );

  return (
    <div
      className={`Sidebar ${showSidebar ? "active" : ""}`}
      onClick={() => setShowCategoryInput(false)}
    >
      <div className="sidebar--main">
        <div className="btn--add-new-note" onClick={handleNewNoteClick}>
          <Plus className="icon" /> <p>New Space</p>
        </div>
        <div className="default-categories">
          {[
            {
              name: "All Notes",
              icon: <Book className="icon" />,
              filter: (n) => n.status !== "archived",
            },
            {
              name: "Favorites",
              icon: <Star className="icon" />,
              filter: (n) => n.status === "favorite",
            },
            {
              name: "Archived",
              icon: <Archive className="icon" />,
              filter: (n) => n.status === "archived",
            },
          ].map(({ name, icon, filter }) => (
            <div
              key={name}
              className={`category ${currentCategory === name ? "active" : ""}`}
              onClick={() => {
                setCurrentCategory(name);
                setCurrentNote(null);
                setShowSidebar(false);
                setShowNotesList(true);
              }}
            >
              {icon}
              <div className="category-name">{name}</div>
              <div className="category-count">
                {notes.filter(filter).length}
              </div>
            </div>
          ))}
        </div>

        <div className="additional-categories">
          <header>
            <Layers className="icon" />
            <p>Categories</p>
            <div
              className="btn--add-new-category"
              onClick={handleAddCategoryClick}
            >
              <Plus className="icon" />
            </div>
          </header>
          {showCategoryInput && (
            <div className="new-category-name-field">
              <input
                type="text"
                name="category"
                placeholder="New Category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div
                className="btn--create-category"
                onClick={handleCreateCategory}
              >
                Create
              </div>
            </div>
          )}
          {categories.map((category) => (
            <div
              key={category._id}
              className={`category ${
                currentCategory === category._id ? "active" : ""
              }`}
              onClick={() => {
                setCurrentCategory(category._id);
                setCurrentNote(null);
                setShowSidebar(false);
                setShowNotesList(true);
              }}
            >
              <Folder className="icon" />
              <div className="category-name">{category.name}</div>
              <div className="category-count">
                {notes.filter((note) => note.category === category._id).length}
              </div>
              <Trash2
                className="icon delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category._id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar--settings-and-preferences">
        <Settings className="icon" onClick={() => setSettingsOpen(true)} />
        <LogOut className="icon" onClick={handleLogOut} />
      </div>
    </div>
  );
};

export default Sidebar;
