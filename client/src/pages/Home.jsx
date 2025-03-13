import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import NotesList from "../components/NotesList/NotesList";
import Note from "../components/Note/Note";
import SettingsModal from "../components/Settings/SettingsModal";

const Home = () => {
  const navigate = useNavigate();
  const { setWritingToolsMode, currentUser, settingsOpen, loading } =
    useContext(AuthContext);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // ✅ Prevents flickering redirect
  }

  return (
    <div
      className="Home"
      onClick={(e) => {
        e.stopPropagation();
        setWritingToolsMode(false);
      }}
    >
      <Sidebar />
      <NotesList />
      <Note />
      {settingsOpen && <SettingsModal />}
    </div>
  );
};

export default Home;
