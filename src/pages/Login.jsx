import { useState, useEffect } from "react";
import { auth, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";


const LoginPage = () => {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [message, setMessage] = useState("Say 'login' to sign in with Google");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);

  useEffect(() => {
    // Apply dark mode on component mount and when changed
    document.body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);
  
  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    
    // Announce mode change with speech
    speak(`${newMode ? 'Dark' : 'Light'} mode activated`);
  };

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        setMessage(`Command recognized: "${command}"`);
        
        if (command.includes('login') || command.includes('sign in')) {
          handleLogin();
        } else if (command.includes('dark mode') || command.includes('light mode')) {
          toggleDarkMode();
        } else if (command.includes('help')) {
          speak("You can say 'login' to sign in with Google");
        } else if (command.includes('repeat')) {
          speak("Welcome to voice-based email. Say 'login' to sign in");
        } else {
          speak("Command not recognized. Say 'login' to sign in, or 'help' for assistance.");
          // Restart listening after speaking
          setTimeout(() => {
            if (recognition) {
              try {
                recognition.start();
                setListening(true);
              } catch (error) {
                console.error("Error restarting recognition:", error);
              }
            }
          }, 4000);
        }
      };
      
      recognition.onerror = (event) => {
        console.error(`Speech recognition error: ${event.error}`);
        setMessage(`Error occurred in recognition: ${event.error}`);
        setListening(false);
        
        // Try to restart listening after error
        setTimeout(() => {
          try {
            recognition.start();
            setListening(true);
            setMessage("Listening for commands... (say 'login' or 'help')");
          } catch (error) {
            console.error("Error restarting recognition:", error);
            speak("Voice recognition error. Using keyboard or touch is required.");
          }
        }, 4000);
      };
      
      recognition.onend = () => {
        // Auto-restart listening if not navigating away
        if (listening) {
          try {
            recognition.start();
          } catch (error) {
            console.error("Error restarting recognition:", error);
            setListening(false);
          }
        }
      };
      
      setSpeechRecognition(recognition);
      
      // Start listening automatically on component mount
      setTimeout(() => {
        try {
          recognition.start();
          setListening(true);
          setMessage("Listening for commands... (say 'login' or 'help')");
        } catch (error) {
          console.error("Error starting initial recognition:", error);
          speak("Voice recognition could not start automatically. Please use keyboard or touch interface.");
        }
      }, 1000); // Short delay to ensure component is fully mounted
      
    } else {
      setMessage("Speech recognition is not supported by your browser");
      speak("Speech recognition is not supported by your browser. Please use keyboard or touch interface.");
    }
    
    // Initialize voice feedback and provide initial audio cue
    if (window.speechSynthesis) {
      // Ensure initial welcome message plays when the page loads
      setTimeout(() => {
        if (isFirstLoad) {
          speak("Welcome to voice-based email. Say 'login' to sign in, or 'help' for more options.");
          setIsFirstLoad(false);
        }
      }, 2000);
    } else {
      console.error("Speech synthesis not supported");
    }
    
    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (listening) {
      speechRecognition.stop();
      setListening(false);
      setMessage("Voice recognition paused. Click to resume.");
      speak("Voice recognition paused");
    } else {
      try {
        speechRecognition.start();
        setListening(true);
        setMessage("Listening for commands... (say 'login' or 'help')");
        speak("Voice recognition active");
      } catch (error) {
        console.error("Error starting recognition:", error);
        speak("Could not start voice recognition. Please try again.");
      }
    }
  };

  const speak = (text) => {
    if (window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogin = async () => {
    try {
      speak("Logging you in with Google");
      setMessage("Initiating Google login...");
      
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user);
      
      speak("Login successful. Redirecting to inbox.");
      setMessage("Login successful! Redirecting to inbox...");
      
      // Stop listening before navigating away
      if (speechRecognition) {
        speechRecognition.stop();
        setListening(false);
      }
      
      // Short delay to allow the speech to complete before navigation
      setTimeout(() => navigate("/inbox"), 2000);
    } catch (error) {
      console.error("Login failed:", error.message);
      speak(`Login failed. ${error.message}. Please try again by saying login.`);
      setMessage(`Login failed: ${error.message}`);
      
      // Restart listening after error feedback
      setTimeout(() => {
        if (speechRecognition) {
          try {
            speechRecognition.start();
            setListening(true);
          } catch (err) {
            console.error("Error restarting recognition after login failure:", err);
          }
        }
      }, 4000);
    }
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleLogin();
      } else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleListening();
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleDarkMode();
      } else if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        speak("You can say 'login' to sign in with Google, 'help' for assistance, or 'repeat' to hear instructions again.");
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [listening, darkMode]);

  return (
    <div className={`login-container ${darkMode ? 'dark-theme' : 'light-theme'}`} role="main" aria-live="polite">
      <h1 tabIndex="-1">Voice-Based Email Service for aws </h1>
      
      <button 
        onClick={toggleDarkMode} 
        className="theme-toggle-button"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      
      <p className="instruction" aria-live="assertive">{message}</p>
      
      <div className="status-indicator" aria-live="assertive">
        {listening ? (
          <div className="listening-indicator" role="status">
            <span className="visually-hidden">Voice recognition active</span>
            <div className="pulse-animation"></div>
          </div>
        ) : (
          <div className="listening-paused" role="status">
            <span className="visually-hidden">Voice recognition paused</span>
          </div>
        )}
      </div>
      
      <div className="buttons-container">
        <button 
          onClick={handleLogin} 
          className="login-button"
          aria-label="Login with Google"
        >
          Login with Google
        </button>
        
        <button 
          onClick={toggleListening} 
          className={`voice-control-button ${listening ? 'listening' : ''}`}
          aria-label={listening ? "Stop voice recognition" : "Start voice recognition"}
        >
          {listening ? "Stop Listening" : "Start Voice Control"}
        </button>
      </div>
      
      <div className="accessibility-info">
        <h2>Voice Commands:</h2>
        <ul>
          <li>"Login" - Sign in with Google</li>
          <li>"Dark mode" / "Light mode" - Toggle theme</li>
          <li>"Help" - Get assistance</li>
          <li>"Repeat" - Repeat instructions</li>
        </ul>
        <h2>Keyboard Shortcuts:</h2>
        <ul>
          <li>Ctrl/Cmd + L - Login with Google</li>
          <li>Ctrl/Cmd + V - Toggle voice recognition</li>
          <li>Ctrl/Cmd + D - Toggle dark/light mode</li>
          <li>Ctrl/Cmd + H - Hear help instructions</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;






















// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("Click the button to sign in with Google");
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || false);

//   useEffect(() => {
//     document.body.classList.toggle("dark-theme", darkMode);
//   }, [darkMode]);
  
//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode.toString());
//   };

//   const handleLogin = async () => {
//     try {
//       setMessage("Initiating Google login...");
//       const result = await signInWithPopup(auth, provider);
//       console.log("User Info:", result.user);
//       setMessage("Login successful! Redirecting to inbox...");
//       setTimeout(() => navigate("/inbox"), 2000);
//     } catch (error) {
//       console.error("Login failed:", error.message);
//       setMessage(`Login failed: ${error.message}`);
//     }
//   };

//   return (
//     <div className={`login-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
//       <h1>Voice-Based Email Service</h1>
      
//       <button onClick={toggleDarkMode} className="theme-toggle-button">
//         {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//       </button>
      
//       <p className="instruction">{message}</p>
      
//       <div className="buttons-container">
//         <button onClick={handleLogin} className="login-button">
//           Login with Google
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

// import { useState, useEffect } from "react";
// import { auth, provider } from "../../firebase/Config";

// import { signInWithPopup } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import "../../styles/LoginPage.css";
