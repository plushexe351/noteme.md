import React from "react";
import "./Login.scss";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle,
  Edit2,
  Facebook,
  FolderPlus,
  GitHub,
  Globe,
  Instagram,
  Linkedin,
  Search,
  Settings,
} from "react-feather";

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import { toast } from "react-toastify";

import heroMedia from "../assets/hero-media.mp4";
import poster from "../assets/hero-img.png";
import API_BASE_URL from "../config.js";

const Login = () => {
  const navigate = useNavigate();
  const {
    setCurrentUser,
    setContent,
    setCurrentNote,
    setShowTempNote,
    setNotes,
    setCategories,
  } = useContext(AuthContext);

  setNotes([]);
  setCategories([]);

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // console.log("Firebase User:", user);

        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });

        return fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          }),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("data.user:", data.user);
          toast.success(`Welcome, ${data.user.name}`);
          setCurrentNote(null);

          navigate("/home");
        } else {
          console.error("Failed to log in:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };
  setTimeout(() => {
    document.querySelector("video")?.play();
  }, 1000);
  return (
    <div className="Login">
      <div className="navbar">
        <header>
          <div id="app-title">
            NOTEME{" "}
            <span>
              .md <ArrowDown className="icon" />
            </span>
          </div>
          {/* <nav className="nav-items">
            <a href="">Login</a>
          </nav> */}
        </header>
        <div className="auth-provider-container">
          <button className="signin" onClick={signInWithGoogle}>
            <svg
              viewBox="0 0 256 262"
              preserveAspectRatio="xMidYMid"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              ></path>
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              ></path>
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              ></path>
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              ></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
      <main>
        <div className="hero">
          <div className="hero-text">
            <p>Welcome to</p>
            <h1>
              Noteme.<span>md</span>
            </h1>
            <p>Learning made easier.</p>
          </div>
          <div className="hero-media">
            <video muted preload="auto" playsInline loop poster={poster}>
              <source src={heroMedia} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="infoCards">
          <div className="infoCard">
            <Settings className="icon customise" />
            <h1>Customise & Categorise</h1>
            <p>
              Keep your most important notes close at hand. Organize your notes
              for easy retrieval. Store notes you don't need right now, but want
              to keep. Never worry about losing your work.
            </p>
          </div>
          <div className="infoCard">
            <Edit2 className="icon tools" />
            <h1>Learning and Writing Tools</h1>
            <p>Choose a wide array of Writing & Learning tools including :</p>
            <div className="tools-list">
              <div className="tool">Write</div>
              <div className="tool">Summarize</div>
              <div className="tool">Reimagine</div>
              <div className="tool">Table</div>
              <div className="tool">Key-points</div>
              <div className="tool">Quiz</div>
              <div className="tool">Evaluate</div>
            </div>
          </div>
          <div className="infoCard">
            <Search className="icon search" />
            <h1>Don't gotta sweat scrolling</h1>
            <p>
              Real-time search has never been easier ! Retrieve your study
              material with ease, using titles or even the content itself.
            </p>
          </div>
          <div className="infoCard">
            <CheckCircle className="icon quiz" />
            <h1>Test your learning</h1>
            <p>
              Personalised Quizzes help you test what you've learnt ! Use AI to
              teach, and AI to test. Evaluate yourself and get precise
              feedbacks.
            </p>
          </div>
          <div className="infoCard">
            <FolderPlus className="icon import" />
            <h1>No need to Control-C Control-V</h1>
            <p>
              Import and Parse PDFs directly into your study-space, and
              downloading & sharing your study-notes is just a click away.
            </p>
          </div>
          <div className="infoCard">
            <Globe className="icon translate" />
            <h1>Translate</h1>
            <p>Translate your content with ease using AI</p>
          </div>
        </div>
        <div className="call-to-action" onClick={signInWithGoogle}>
          Try Now <ArrowUpRight />
        </div>
      </main>
      <footer>
        <p>&copy; 2024 | Ushnish Tapaswi</p>
        <div className="social-links">
          <GitHub />
          <Facebook />
          <Instagram />
          <Linkedin />
        </div>
      </footer>
    </div>
  );
};

export default Login;
