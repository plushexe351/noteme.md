import React, { useContext } from "react";
import "./Settings.scss";
import { Mail, User } from "react-feather";

import { AuthContext } from "../../context/AuthContext";

const SettingsModal = () => {
  const { currentUser, setSettingsOpen, notes } = useContext(AuthContext);

  return (
    <div className="Settings">
      <div className="settings-container">
        <header>
          <button
            className="btn--close-settings"
            onClick={() => setSettingsOpen(false)}
          ></button>
          <h3>Your Profile</h3>
        </header>
        <main>
          <div className="profile-image">
            <img src={currentUser.photoURL} alt="" />
          </div>
          <div className="username">
            <User className="icon" />
            {currentUser.name}
          </div>
          <div className="email">
            <Mail className="icon" />
            {currentUser.email}
          </div>
        </main>
        {/* <div className="btn--log-out">Log Out</div> */}
      </div>
    </div>
  );
};

export default SettingsModal;
