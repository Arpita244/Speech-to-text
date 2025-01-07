import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// List of top 50 languages in the world with readable names
const languages = [
  { code: "en-US", name: "English (US)" },
  { code: "zh-CN", name: "Chinese (Mandarin)" },
  { code: "es-ES", name: "Spanish" },
  { code: "hi-IN", name: "Hindi" },
  { code: "ar-SA", name: "Arabic" },
  { code: "bn-BD", name: "Bengali" },
  { code: "pt-PT", name: "Portuguese" },
  { code: "ru-RU", name: "Russian" },
  { code: "ja-JP", name: "Japanese" },
  { code: "de-DE", name: "German" },
  { code: "ko-KR", name: "Korean" },
  { code: "fr-FR", name: "French" },
  { code: "it-IT", name: "Italian" },
  { code: "tr-TR", name: "Turkish" },
  { code: "pl-PL", name: "Polish" },
  { code: "uk-UA", name: "Ukrainian" },
  { code: "ro-RO", name: "Romanian" },
  { code: "ta-IN", name: "Tamil" },
  { code: "vi-VN", name: "Vietnamese" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "mr-IN", name: "Marathi" },
  { code: "th-TH", name: "Thai" },
  { code: "cs-CZ", name: "Czech" },
  { code: "sw-KE", name: "Swahili" },
  { code: "fa-IR", name: "Persian (Farsi)" },
  { code: "he-IL", name: "Hebrew" },
  { code: "sv-SE", name: "Swedish" },
  { code: "no-NO", name: "Norwegian" },
  { code: "da-DK", name: "Danish" },
  { code: "fi-FI", name: "Finnish" },
  { code: "nl-NL", name: "Dutch" },
  { code: "el-GR", name: "Greek" },
  { code: "sr-RS", name: "Serbian" },
  { code: "bs-BA", name: "Bosnian" },
  { code: "hr-HR", name: "Croatian" },
  { code: "sk-SK", name: "Slovak" },
  { code: "bg-BG", name: "Bulgarian" },
  { code: "lt-LT", name: "Lithuanian" },
  { code: "lv-LV", name: "Latvian" },
  { code: "et-EE", name: "Estonian" },
  { code: "sl-SI", name: "Slovenian" },
  { code: "mk-MK", name: "Macedonian" },
  { code: "sq-AL", name: "Albanian" },
  { code: "ka-GE", name: "Georgian" },
  { code: "hy-AM", name: "Armenian" },
  { code: "km-KH", name: "Khmer" },
  { code: "lo-LA", name: "Lao" },
  { code: "my-MM", name: "Burmese" }
];

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [savedTranscripts, setSavedTranscripts] = useState([]);
  const [isLocked, setIsLocked] = useState(false);  // Lock the UI when recording starts
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current.lang = language;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setError("");
      setIsLocked(true);  // Lock UI on speech start
    };
    recognitionRef.current.onresult = (event) => {
      const speechResult = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(speechResult);
    };

    recognitionRef.current.onerror = (event) => setError(`Error: ${event.error}`);
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsLocked(false);  // Unlock UI when speech recognition ends
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    if (!isLocked) {
      setTranscript("");
    }
  };

  const saveTranscript = () => {
    if (!isLocked && transcript) {
      setSavedTranscripts([...savedTranscripts, transcript]);
      setTranscript("");
    }
  };

  const copyToClipboard = () => {
    if (!isLocked && transcript) {
      navigator.clipboard.writeText(transcript);
      alert("Transcript copied to clipboard!");
    }
  };

  const downloadTranscript = () => {
    if (!isLocked && transcript) {
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transcript.txt";
      link.click();
    }
  };

  return (
    <div className="app">
      <header>
        <h1 className="neon-title">Voice AI Transcriber</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => document.body.classList.toggle("dark")}
        >
          Toggle Dark Mode
        </button>
      </header>

      <div className="controls">
        <button
          className="btn neon-btn"
          onClick={startListening}
          disabled={isListening || isLocked}
        >
          Start Listening
        </button>
        <button
          className="btn neon-btn"
          onClick={stopListening}
          disabled={!isListening || isLocked}
        >
          Stop Listening
        </button>
        <button
          className="btn neon-btn clear-btn"
          onClick={clearTranscript}
          disabled={isLocked || !transcript}
        >
          Clear
        </button>
        <button
          className="btn neon-btn"
          onClick={saveTranscript}
          disabled={isLocked || !transcript}
        >
          Save
        </button>
        <button
          className="btn neon-btn"
          onClick={copyToClipboard}
          disabled={isLocked || !transcript}
        >
          Copy
        </button>
        <button
          className="btn neon-btn"
          onClick={downloadTranscript}
          disabled={isLocked || !transcript}
        >
          Download
        </button>
      </div>

      <div className="settings">
        <label>
          Language:
          <select
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLocked}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="error neon-error">{error}</div>}

      <textarea
        className="transcript-box neon-textarea"
        value={transcript}
        readOnly
        placeholder="Your speech will appear here..."
      ></textarea>

      <div className="word-count">
        Words: {transcript.split(" ").filter(Boolean).length} | Characters: {transcript.length}
      </div>

      {savedTranscripts.length > 0 && (
        <div className="saved-transcripts">
          <h2 className="neon-title">Saved Transcripts</h2>
          <ul>
            {savedTranscripts.map((text, index) => (
              <li key={index} className="neon-item">{text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
