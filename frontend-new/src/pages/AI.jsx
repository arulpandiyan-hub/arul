import { useState, useRef, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  Fan,
  Power,
  Trash2,
  Wifi,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Home,
} from "lucide-react";

import "./AI.css";

const API = "http://10.40.59.177:8000";

function AI() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        "Hello! I'm your SmartHome AI assistant. You can type or speak to me. Try saying “Turn on the light” or “What is my home status?”",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [listening, setListening] = useState(false);

  const [speaking, setSpeaking] = useState(false);

  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const chatEndRef = useRef(null);

  const recognitionRef = useRef(null);


  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  /* =====================================================
     TEXT TO SPEECH
  ===================================================== */

  const speakResponse = async (text) => {
    if (!voiceEnabled) return;

    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/[*_#]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    if (!cleanText) return;

    try {
      // Native Android/iOS TTS for the APK
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
        setSpeaking(true);

        await TextToSpeech.speak({
          text: cleanText,
          lang: "en-IN",
          rate: 0.95,
          pitch: 1.0,
          volume: 1.0,
          queueStrategy: 0,
        });

        setSpeaking(false);
        return;
      }

      // Browser fallback for development/testing in Chrome/Edge
      if (!("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(cleanText);
      speech.lang = "en-IN";
      speech.rate = 0.95;
      speech.pitch = 1;
      speech.volume = 1;

      speech.onstart = () => setSpeaking(true);
      speech.onend = () => setSpeaking(false);
      speech.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error("TTS error:", error);
      setSpeaking(false);
    }
  };

  /* =====================================================
     CONTROL DEVICE
  ===================================================== */

  const controlDevice = async (
    device,
    state
  ) => {
    const action = state ? "on" : "off";

    const response = await fetch(
      `${API}/device/${device}/${action}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Unable to control ${device}`
      );
    }

    return response.json();
  };


  /* =====================================================
     CONTROL ALL DEVICES
  ===================================================== */

  const controlEverything = async (
    state
  ) => {
    const action = state ? "on" : "off";

    const response = await fetch(
      `${API}/devices/all/${action}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to control all devices"
      );
    }

    return response.json();
  };


  /* =====================================================
     GET REAL HOME STATUS
  ===================================================== */

  const getHomeStatus = async () => {
    const response = await fetch(
      `${API}/devices`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to get home status"
      );
    }

    return response.json();
  };


  /* =====================================================
     DETECT SMART HOME COMMAND
  ===================================================== */

  const detectCommand = (text) => {
    const command = text
      .toLowerCase()
      .trim();


    /* ---------------------------------------------
       HOME STATUS
    --------------------------------------------- */

    if (
      command.includes("home status") ||
      command.includes("status of my home") ||
      command.includes("home state") ||
      command.includes("what is happening at home") ||
      command.includes("what is the status") ||
      command.includes("how is my home") ||
      command.includes("how is the home") ||
      command.includes("home doing") ||
      command.includes("device status") ||
      command.includes("status of my devices") ||
      command.includes("are my devices on") ||
      command.includes("what devices are on") ||
      command.includes("what devices are running")
    ) {
      return {
        type: "home_status",
      };
    }


    /* ---------------------------------------------
       LIGHT ON
    --------------------------------------------- */

    if (
      command.includes("light") &&
      (
        command.includes("turn on") ||
        command.includes("switch on") ||
        command.includes("switch the light on") ||
        command.includes("enable") ||
        command.includes("start")
      )
    ) {
      return {
        type: "light",
        state: true,
      };
    }


    /* ---------------------------------------------
       LIGHT OFF
    --------------------------------------------- */

    if (
      command.includes("light") &&
      (
        command.includes("turn off") ||
        command.includes("switch off") ||
        command.includes("switch the light off") ||
        command.includes("disable") ||
        command.includes("stop")
      )
    ) {
      return {
        type: "light",
        state: false,
      };
    }


    /* ---------------------------------------------
       FAN ON
    --------------------------------------------- */

    if (
      command.includes("fan") &&
      (
        command.includes("turn on") ||
        command.includes("switch on") ||
        command.includes("start") ||
        command.includes("enable")
      )
    ) {
      return {
        type: "fan",
        state: true,
      };
    }


    /* ---------------------------------------------
       FAN OFF
    --------------------------------------------- */

    if (
      command.includes("fan") &&
      (
        command.includes("turn off") ||
        command.includes("switch off") ||
        command.includes("stop") ||
        command.includes("disable")
      )
    ) {
      return {
        type: "fan",
        state: false,
      };
    }


    /* ---------------------------------------------
       EVERYTHING ON
    --------------------------------------------- */

    if (
      (
        command.includes("everything") ||
        command.includes("all devices") ||
        command === "all"
      ) &&
      (
        command.includes("turn on") ||
        command.includes("switch on") ||
        command.includes("enable")
      )
    ) {
      return {
        type: "all",
        state: true,
      };
    }


    /* ---------------------------------------------
       EVERYTHING OFF
    --------------------------------------------- */

    if (
      (
        command.includes("everything") ||
        command.includes("all devices") ||
        command === "all"
      ) &&
      (
        command.includes("turn off") ||
        command.includes("switch off") ||
        command.includes("disable")
      )
    ) {
      return {
        type: "all",
        state: false,
      };
    }


    return null;
  };


  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const sendMessage = async (
    text = message
  ) => {
    const cleanMessage = text.trim();

    if (!cleanMessage || loading) {
      return;
    }


    /* USER MESSAGE */

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");

    setLoading(true);


    try {

      const command =
        detectCommand(cleanMessage);


      /* =================================================
         SMART HOME COMMAND
      ================================================= */

      if (command) {


        /* ---------------------------------------------
           HOME STATUS
        --------------------------------------------- */

        if (
          command.type === "home_status"
        ) {

          const statusData =
            await getHomeStatus();


          const lightState =
            statusData.light === true;

          const fanState =
            statusData.fan === true;


          let lightText;

          if (lightState) {
            lightText =
              "The light is ON.";
          } else {
            lightText =
              "The light is OFF.";
          }


          let fanText;

          if (fanState) {
            fanText =
              "The fan is running.";
          } else {
            fanText =
              "The fan is OFF.";
          }


          const deviceResponse =
            `Your home is online. ${lightText} ${fanText}`;


          setMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: "ai",
              text: deviceResponse,
            },
          ]);


          speakResponse(
            deviceResponse
          );


          return;
        }


        /* ---------------------------------------------
           LIGHT
        --------------------------------------------- */

        if (
          command.type === "light"
        ) {

          const statusData =
            await getHomeStatus();


          const currentLightState =
            statusData.light === true;


          let deviceResponse;


          /* ALREADY ON */

          if (
            command.state === true &&
            currentLightState === true
          ) {

            deviceResponse =
              "The light is already on.";

          }


          /* ALREADY OFF */

          else if (
            command.state === false &&
            currentLightState === false
          ) {

            deviceResponse =
              "The light is already off.";

          }


          /* ACTUALLY CHANGE */

          else {

            await controlDevice(
              "light",
              command.state
            );


            deviceResponse =
              command.state
                ? "The light is now on."
                : "The light is now off.";
          }


          setMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: "ai",
              text: deviceResponse,
            },
          ]);


          speakResponse(
            deviceResponse
          );


          return;
        }


        /* ---------------------------------------------
           FAN
        --------------------------------------------- */

        if (
          command.type === "fan"
        ) {

          const statusData =
            await getHomeStatus();


          const currentFanState =
            statusData.fan === true;


          let deviceResponse;


          /* ALREADY RUNNING */

          if (
            command.state === true &&
            currentFanState === true
          ) {

            deviceResponse =
              "The fan is already running.";

          }


          /* ALREADY OFF */

          else if (
            command.state === false &&
            currentFanState === false
          ) {

            deviceResponse =
              "The fan is already off.";

          }


          /* ACTUALLY CHANGE */

          else {

            await controlDevice(
              "fan",
              command.state
            );


            deviceResponse =
              command.state
                ? "The fan is now running."
                : "The fan is now off.";
          }


          setMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: "ai",
              text: deviceResponse,
            },
          ]);


          speakResponse(
            deviceResponse
          );


          return;
        }


        /* ---------------------------------------------
           ALL DEVICES
        --------------------------------------------- */

        if (
          command.type === "all"
        ) {

          const statusData =
            await getHomeStatus();


          const lightState =
            statusData.light === true;

          const fanState =
            statusData.fan === true;


          let deviceResponse;


          /* ALL ON */

          if (
            command.state === true &&
            lightState === true &&
            fanState === true
          ) {

            deviceResponse =
              "The light and fan are already on.";

          }


          /* ALL OFF */

          else if (
            command.state === false &&
            lightState === false &&
            fanState === false
          ) {

            deviceResponse =
              "The light and fan are already off.";

          }


          /* CHANGE */

          else {

            await controlEverything(
              command.state
            );


            deviceResponse =
              command.state
                ? "The light and fan are now on."
                : "The light and fan are now off.";
          }


          setMessages((previous) => [
            ...previous,
            {
              id: Date.now() + 1,
              sender: "ai",
              text: deviceResponse,
            },
          ]);


          speakResponse(
            deviceResponse
          );


          return;
        }
      }


      /* =================================================
         NORMAL GEMINI QUESTION
      ================================================= */

      const response = await fetch(
        `${API}/ai`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            message: cleanMessage,
          }),
        }
      );


      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }


      const data =
        await response.json();


      const aiReply =
        data.response ||
        data.message ||
        "I couldn't understand the response from SmartHome AI.";


      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiReply,
        },
      ]);


      speakResponse(aiReply);

    } catch (error) {

      console.error(
        "AI connection error:",
        error
      );


      const errorMessage =
        "I couldn't connect to your SmartHome system. Please check that the backend and ESP32 are online.";


      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: errorMessage,
          error: true,
        },
      ]);


      speakResponse(
        errorMessage
      );

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     VOICE RECOGNITION
  ===================================================== */

  const startVoiceRecognition = async () => {
    if (loading) return;

    try {
      // =================================================
      // NATIVE ANDROID / IOS
      // =================================================
      if (Capacitor.isNativePlatform()) {
        if (listening) {
          await SpeechRecognition.stop();
          setListening(false);
          return;
        }

        const permission =
          await SpeechRecognition.checkPermissions();

        if (permission.speechRecognition !== "granted") {
          const requested =
            await SpeechRecognition.requestPermissions();

          if (requested.speechRecognition !== "granted") {
            setMessages((previous) => [
              ...previous,
              {
                id: Date.now(),
                sender: "ai",
                text:
                  "Microphone permission is required. Please allow microphone permission and try again.",
                error: true,
              },
            ]);
            return;
          }
        }

        const availability =
          await SpeechRecognition.available();

        if (!availability.available) {
          setMessages((previous) => [
            ...previous,
            {
              id: Date.now(),
              sender: "ai",
              text:
                "Speech recognition is not available on this phone. Please check that Google speech recognition is installed/enabled.",
              error: true,
            },
          ]);
          return;
        }

        setListening(true);
        setMessage("");

        const result = await SpeechRecognition.start({
          language: "en-IN",
          maxResults: 1,
          prompt: "Speak your SmartHome command or question",
          partialResults: false,
          popup: true,
        });

        setListening(false);

        const spokenText =
          result?.matches?.[0]?.trim() || "";

        console.log("VOICE RESULT:", spokenText);

        if (!spokenText) {
          setMessages((previous) => [
            ...previous,
            {
              id: Date.now(),
              sender: "ai",
              text:
                "I couldn't hear you. Tap the microphone and speak again.",
              error: true,
            },
          ]);
          return;
        }

        setMessage(spokenText);

        // IMPORTANT: use the same pipeline as typed messages.
        // This means voice works for both device commands and Gemini questions.
        await sendMessage(spokenText);

        return;
      }

      // =================================================
      // WEB FALLBACK - Chrome / Edge
      // =================================================
      const BrowserSpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (!BrowserSpeechRecognition) {
        setMessages((previous) => [
          ...previous,
          {
            id: Date.now(),
            sender: "ai",
            text:
              "Voice recognition is not supported here. Use the Android APK or Google Chrome/Microsoft Edge.",
            error: true,
          },
        ]);
        return;
      }

      if (listening) {
        recognitionRef.current?.stop();
        setListening(false);
        return;
      }

      const recognition = new BrowserSpeechRecognition();

      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setMessage("");
      };

      recognition.onresult = (event) => {
        const spokenText =
          event.results?.[0]?.[0]?.transcript?.trim() || "";

        setListening(false);

        if (spokenText) {
          setMessage(spokenText);
          sendMessage(spokenText);
        }
      };

      recognition.onerror = (event) => {
        console.error(
          "Browser speech recognition error:",
          event.error
        );
        setListening(false);

        let errorText;

        if (event.error === "not-allowed") {
          errorText =
            "Microphone access was denied. " +
            "Please allow microphone permission in your browser settings and reload the page. " +
            "Note: Voice requires HTTPS or localhost — it will NOT work over a plain HTTP IP address in Chrome.";
        } else if (event.error === "no-speech") {
          errorText =
            "No speech was detected. Please try again and speak clearly.";
        } else if (event.error === "network") {
          errorText =
            "Network error during voice recognition. Please check your internet connection.";
        } else {
          errorText =
            `Voice recognition error: ${event.error || "unknown error"}.`;
        }

        setMessages((previous) => [
          ...previous,
          {
            id: Date.now(),
            sender: "ai",
            text: errorText,
            error: true,
          },
        ]);
      };

      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Voice recognition error:", error);
      setListening(false);
      recognitionRef.current = null;

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          sender: "ai",
          text:
            "Voice recognition failed. Please allow microphone permission and try again.",
          error: true,
        },
      ]);
    }
  };

  /* =====================================================
     STOP SPEAKING
  ===================================================== */

  const stopSpeaking = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await TextToSpeech.stop();
      } else if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      console.error("Stop speaking error:", error);
    }

    setSpeaking(false);
  };

  /* =====================================================
     TOGGLE VOICE
  ===================================================== */

  const toggleVoice = () => {

    if (voiceEnabled) {

      stopSpeaking();

      setVoiceEnabled(false);

    } else {

      setVoiceEnabled(true);

    }

  };


  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();

    sendMessage();

  };


  /* =====================================================
     QUICK COMMANDS
  ===================================================== */

  const quickCommands = [
    {
      label: "Home status",
      icon: Home,
      command:
        "What is my home status?",
    },

    {
      label: "Turn on light",
      icon: Lightbulb,
      command:
        "Turn on the light",
    },

    {
      label: "Turn off light",
      icon: Lightbulb,
      command:
        "Turn off the light",
    },

    {
      label: "Turn on fan",
      icon: Fan,
      command:
        "Turn on the fan",
    },

    {
      label: "Turn off fan",
      icon: Fan,
      command:
        "Turn off the fan",
    },

    {
      label: "Everything off",
      icon: Power,
      command:
        "Turn everything off",
    },
  ];


  /* =====================================================
     CLEAR CHAT
  ===================================================== */

  const clearChat = () => {

    stopSpeaking();

    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text:
          "Chat cleared. How can I help you control your SmartHome?",
      },
    ]);

  };


  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {

    return () => {

      recognitionRef.current?.stop();

      if (Capacitor.isNativePlatform()) {
        SpeechRecognition.stop().catch(() => {});
        TextToSpeech.stop().catch(() => {});
      } else {
        window.speechSynthesis?.cancel();
      }

    };

  }, []);


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="ai-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="ai-page-header">

        <div className="ai-title-section">

          <div className="ai-title-icon">

            <Sparkles size={26} />

          </div>

          <div>

            <div className="ai-label">
              SMART HOME AI
            </div>

            <h1>
              Ask AI
            </h1>

            <p>
              Talk to your intelligent home assistant.
            </p>

          </div>

        </div>


        <div className="ai-status">

          <span className="ai-status-dot"></span>

          Gemini Online

        </div>

      </div>


      {/* =================================================
          AI CARD
      ================================================= */}

      <section className="ai-card">


        {/* -----------------------------------------------
            HEADER
        ----------------------------------------------- */}

        <div className="ai-card-header">

          <div className="ai-profile">

            <div className="ai-avatar">

              <Sparkles size={22} />

            </div>

            <div>

              <strong>
                SmartHome AI
              </strong>

              <span>

                {speaking
                  ? "Speaking..."
                  : listening
                  ? "Listening..."
                  : loading
                  ? "Thinking..."
                  : "Ready to help"}

              </span>

            </div>

          </div>


          <div className="ai-header-actions">

            <button
              className={
                voiceEnabled
                  ? "voice-status-button active"
                  : "voice-status-button"
              }
              onClick={toggleVoice}
              title={
                voiceEnabled
                  ? "Voice response ON"
                  : "Voice response OFF"
              }
            >

              {voiceEnabled ? (
                <Volume2 size={16} />
              ) : (
                <VolumeX size={16} />
              )}

            </button>


            <div className="ai-online">

              <Wifi size={14} />

              Online

            </div>

          </div>

        </div>


        {/* =================================================
            VOICE STATUS
        ================================================= */}

        {(listening || speaking) && (

          <div
            className={
              listening
                ? "voice-state listening"
                : "voice-state speaking"
            }
          >

            <div className="voice-animation">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>

            <span>

              {listening
                ? "Listening to you..."
                : "SmartHome AI is speaking..."}

            </span>

          </div>

        )}


        {/* =================================================
            CHAT
        ================================================= */}

        <div className="ai-chat">

          {messages.map(
            (item) => (

              <div
                key={item.id}
                className={
                  item.sender === "user"
                    ? "chat-row user-row"
                    : "chat-row ai-row"
                }
              >

                {item.sender === "ai" && (

                  <div className="chat-avatar ai-chat-avatar">

                    <Bot size={17} />

                  </div>

                )}


                <div
                  className={
                    item.sender === "user"
                      ? "chat-message user-message"
                      : item.error
                      ? "chat-message ai-message error-message"
                      : "chat-message ai-message"
                  }
                >

                  {item.text}

                </div>


                {item.sender === "user" && (

                  <div className="chat-avatar user-chat-avatar">

                    <User size={17} />

                  </div>

                )}

              </div>

            )
          )}


          {/* THINKING */}

          {loading && (

            <div className="chat-row ai-row">

              <div className="chat-avatar ai-chat-avatar">

                <Bot size={17} />

              </div>

              <div className="chat-message ai-message typing-message">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>

          )}


          <div ref={chatEndRef}></div>

        </div>


        {/* =================================================
            QUICK COMMANDS
        ================================================= */}

        <div className="quick-command-section">

          <div className="quick-command-title">

            <Sparkles size={14} />

            Quick commands

          </div>


          <div className="quick-command-list">

            {quickCommands.map(
              (item) => {

                const Icon =
                  item.icon;

                return (

                  <button
                    key={item.label}
                    className="quick-command"
                    onClick={() =>
                      sendMessage(
                        item.command
                      )
                    }
                    disabled={loading}
                  >

                    <Icon size={16} />

                    <span>
                      {item.label}
                    </span>

                  </button>

                );

              }
            )}

          </div>

        </div>


        {/* =================================================
            INPUT
        ================================================= */}

        <form
          className="ai-input-area"
          onSubmit={handleSubmit}
        >

          <button
            type="button"
            className={
              listening
                ? "ai-mic-button listening"
                : "ai-mic-button"
            }
            onClick={
              startVoiceRecognition
            }
            disabled={loading}
            title={
              listening
                ? "Stop listening"
                : "Speak to SmartHome AI"
            }
          >

            {listening ? (
              <MicOff size={20} />
            ) : (
              <Mic size={20} />
            )}

          </button>


          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            placeholder={
              listening
                ? "Listening..."
                : "Ask SmartHome AI..."
            }
            disabled={loading}
          />


          <button
            type="submit"
            className="ai-send-button"
            disabled={
              loading ||
              !message.trim()
            }
          >

            <Send size={19} />

          </button>

        </form>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="ai-footer">

          <span>
            🎤 Voice • Gemini AI • SmartHome
          </span>


          <div className="ai-footer-actions">

            {speaking && (

              <button
                className="stop-speaking-button"
                onClick={stopSpeaking}
              >

                <VolumeX size={14} />

                Stop

              </button>

            )}


            <button
              className="clear-chat-button"
              onClick={clearChat}
              disabled={loading}
            >

              <Trash2 size={14} />

              Clear

            </button>

          </div>

        </div>

      </section>

    </div>

  );
}

export default AI;