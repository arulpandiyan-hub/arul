import { useState, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

import "./Voice.css";

const API = "http://10.40.59.177:8000";

function Voice() {
  const [listening, setListening] = useState(false);
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  // ==========================================
  // TEXT TO SPEECH
  // ==========================================

  const speak = async (text) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: text,
          lang: "en-US",
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          queueStrategy: 0,
        });
        return;
      }

      // Browser fallback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
      }
    } catch (err) {
      console.error("TTS ERROR:", err);
    }
  };

  // ==========================================
  // PROCESS DEVICE COMMAND
  // ==========================================

  const processCommand = async (spokenText) => {
    const text = spokenText.toLowerCase();

    let device = null;
    let action = null;

    if (
      text.includes("light") &&
      (text.includes("turn on") ||
        text.includes("switch on") ||
        text.includes("lights on") ||
        text.endsWith("on"))
    ) {
      device = "light";
      action = "on";
    } else if (
      text.includes("light") &&
      (text.includes("turn off") ||
        text.includes("switch off") ||
        text.includes("lights off") ||
        text.endsWith("off"))
    ) {
      device = "light";
      action = "off";
    } else if (
      text.includes("fan") &&
      (text.includes("turn on") ||
        text.includes("switch on") ||
        text.includes("fan on") ||
        text.endsWith("on"))
    ) {
      device = "fan";
      action = "on";
    } else if (
      text.includes("fan") &&
      (text.includes("turn off") ||
        text.includes("switch off") ||
        text.includes("fan off") ||
        text.endsWith("off"))
    ) {
      device = "fan";
      action = "off";
    } else {
      const response =
        "I didn't understand that command. Try saying, turn on the light.";
      setMessage(response);
      await speak(response);
      return;
    }

    try {
      setError("");

      const deviceName = device === "light" ? "Light" : "Fan";
      const actionName = action === "on" ? "on" : "off";

      setMessage(`Turning ${deviceName} ${actionName}...`);

      const response = await fetch(
        `${API}/device/${device}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const successMessage = `${deviceName} turned ${actionName}.`;
      setMessage(successMessage);
      await speak(successMessage);
    } catch (err) {
      console.error("DEVICE CONTROL ERROR:", err);
      setMessage("");
      const errorMessage =
        "I could not connect to your SmartHome controller.";
      setError(errorMessage);
      await speak(errorMessage);
    }
  };

  // ==========================================
  // START VOICE — NATIVE (Android APK)
  // ==========================================

  const startNativeVoice = async () => {
    const available = await SpeechRecognition.available();

    if (!available.available) {
      setError(
        "Speech recognition is not available on this device."
      );
      return;
    }

    const permission =
      await SpeechRecognition.requestPermissions();

    if (permission.speechRecognition !== "granted") {
      setError(
        "Microphone permission is required for voice control."
      );
      return;
    }

    setListening(true);
    setMessage("Listening...");

    const result = await SpeechRecognition.start({
      language: "en-US",
      maxResults: 1,
      prompt: "Speak your SmartHome command",
      partialResults: false,
      popup: true,
    });

    setListening(false);

    const spokenText =
      result.matches && result.matches.length > 0
        ? result.matches[0].trim()
        : "";

    if (!spokenText) {
      setMessage("");
      setError("I couldn't hear your command. Please try again.");
      return;
    }

    setCommand(spokenText);
    await processCommand(spokenText);
  };

  // ==========================================
  // START VOICE — BROWSER FALLBACK
  // ==========================================

  const startBrowserVoice = () => {
    const BrowserSpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!BrowserSpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. " +
        "Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    // Stop if already listening
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new BrowserSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
      setMessage("Listening...");
      setCommand("");
    };

    recognition.onresult = (event) => {
      const spokenText =
        event.results?.[0]?.[0]?.transcript?.trim() || "";

      setListening(false);
      setMessage("");

      if (spokenText) {
        setCommand(spokenText);
        processCommand(spokenText);
      } else {
        setError("I couldn't hear your command. Please try again.");
      }
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setListening(false);
      setMessage("");
      recognitionRef.current = null;

      if (event.error === "not-allowed") {
        setError(
          "Microphone access was denied. " +
          "Open this page on localhost (not an IP address) " +
          "and allow microphone in your browser settings."
        );
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "network") {
        setError(
          "Network error during voice recognition. Check your connection."
        );
      } else {
        setError(
          `Voice recognition error: ${event.error || "unknown"}.`
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error("Could not start recognition:", err);
      setError(
        "Could not start voice recognition. " +
        "Make sure you are using Chrome/Edge on localhost or HTTPS."
      );
    }
  };

  // ==========================================
  // MAIN START HANDLER
  // ==========================================

  const startListening = async () => {
    setError("");
    setMessage("");
    setCommand("");

    try {
      if (Capacitor.isNativePlatform()) {
        await startNativeVoice();
      } else {
        startBrowserVoice();
      }
    } catch (err) {
      console.error("VOICE ERROR:", err);
      setListening(false);
      setMessage("");
      setError("Voice recognition failed. Please try again.");
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="feature-page">

      <div className="section-label">
        VOICE CONTROL
      </div>

      <h1>Voice Control</h1>

      <p className="feature-description">
        Control your SmartHome using your voice.
      </p>

      <div className="voice-container">

        <button
          className={
            listening
              ? "voice-button listening"
              : "voice-button"
          }
          onClick={startListening}
          disabled={listening}
        >
          {listening ? (
            <MicOff size={40} />
          ) : (
            <Mic size={40} />
          )}
        </button>

        <h2>
          {listening
            ? "Listening..."
            : "Tap to Speak"}
        </h2>

        <p>
          {listening
            ? "Speak your command..."
            : "Control your light or fan"}
        </p>

        <button
          className="start-listening-button"
          onClick={startListening}
          disabled={listening}
        >
          <Mic size={20} />

          {listening
            ? "Listening..."
            : "Start Voice Control"}
        </button>

        <div className="voice-example">
          <Volume2 size={18} />

          <span>
            Try saying:
          </span>

          <strong>
            "Turn on the light"
          </strong>
        </div>

      </div>

      {command && (
        <div className="voice-result">

          <Mic size={18} />

          <div>
            <span>You said</span>

            <strong>
              {command}
            </strong>
          </div>

        </div>
      )}

      {message && (
        <div className="feature-message">

          <CheckCircle size={18} />

          <span>
            {message}
          </span>

        </div>
      )}

      {error && (
        <div className="voice-error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}

    </div>
  );
}

export default Voice;