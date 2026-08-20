import { useEffect, useRef, useState } from "react";

import {
  Mic,
  History,
  Lightbulb,
  Fan,
  Home,
  Sparkles,
  Wifi,
  CheckCircle2,
} from "lucide-react";

function Voice() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [commands, setCommands] = useState([
    {
      icon: "light",
      text: "Turn on the living room light",
      result: "Light turned ON",
      time: "10:24 AM",
    },
    {
      icon: "fan",
      text: "Turn off the fan",
      result: "Fan turned OFF",
      time: "10:23 AM",
    },
    {
      icon: "home",
      text: "Turn everything off",
      result: "All devices turned OFF",
      time: "10:21 AM",
    },
  ]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let text = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        text += event.results[i][0].transcript;
      }

      setTranscript(text);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // Prevent duplicate start errors.
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const handleVoiceButton = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getCommandIcon = (type) => {
    if (type === "light") {
      return <Lightbulb size={22} />;
    }

    if (type === "fan") {
      return <Fan size={22} />;
    }

    return <Home size={22} />;
  };

  return (
    <div className="voice-page">

      {/* HEADER */}

      <div className="voice-header">

        <div>

          <div className="voice-label">
            VOICE CONTROL
          </div>

          <h1>
            Voice Control
          </h1>

          <p>
            Control your home using your voice.
          </p>

        </div>


        <div className="voice-header-status">

          <div className="ready-status">
            <span></span>
            {listening ? "LISTENING" : "READY"}
          </div>

          <div className="esp-status">

            <Wifi size={20} />

            <div>
              <strong>
                ESP32
              </strong>

              <span>
                ONLINE
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* MICROPHONE AREA */}

      <section className={
        listening
          ? "voice-main listening"
          : "voice-main"
      }>

        <button
          className="microphone-orb"
          onClick={handleVoiceButton}
          aria-label={
            listening
              ? "Stop listening"
              : "Start listening"
          }
        >

          <div className="mic-ring ring-a"></div>
          <div className="mic-ring ring-b"></div>
          <div className="mic-ring ring-c"></div>

          <div className="mic-circle">

            <Mic
              size={72}
              strokeWidth={1.5}
            />

          </div>

        </button>


        <h2>
          {listening
            ? "Listening..."
            : "Tap to Start Listening"}
        </h2>

        <p className="voice-subtitle">
          {listening
            ? "I'm listening to your command"
            : "I'm ready to help you!"}
        </p>


        {/* TRANSCRIPT */}

        {transcript && (
          <div className="voice-transcript">

            <span>
              You said
            </span>

            <strong>
              "{transcript}"
            </strong>

          </div>
        )}


        <button
          className="start-listening-button"
          onClick={handleVoiceButton}
        >

          <Mic size={21} />

          {listening
            ? "Stop Listening"
            : "Start Listening"}

        </button>


        <div className="voice-example">

          <Sparkles size={16} />

          Try saying:

          <strong>
            "Turn on the living room light"
          </strong>

        </div>

      </section>


      {/* RECENT COMMANDS */}

      <section className="recent-commands">

        <div className="recent-header">

          <div className="recent-title">

            <History size={22} />

            <h2>
              Recent Commands
            </h2>

          </div>

          <button>
            View All
          </button>

        </div>


        <div className="command-list">

          {commands.map((command, index) => (

            <div
              className="command-item"
              key={index}
            >

              <div
                className={
                  `command-icon ${command.icon}`
                }
              >
                {getCommandIcon(command.icon)}
              </div>


              <div className="command-content">

                <strong>
                  {command.text}
                </strong>

                <span>
                  {command.result}
                </span>

              </div>


              <div className="command-time">

                <span>
                  {command.time}
                </span>

                <strong>
                  SUCCESS
                </strong>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* VOICE TIPS */}

      <section className="voice-tips">

        <div className="tips-title">

          <Sparkles size={20} />

          Voice Tips

        </div>

        <div className="tips-list">

          <span>
            "Turn on the light"
          </span>

          <i>|</i>

          <span>
            "Turn off the fan"
          </span>

          <i>|</i>

          <span>
            "Turn everything off"
          </span>

          <i>|</i>

          <span>
            "What is the status?"
          </span>

        </div>

      </section>


      {/* CONNECTION FOOTER */}

      <div className="voice-connection">

        <CheckCircle2 size={18} />

        <span>
          Voice control system ready
        </span>

        <strong>
          ESP32 CONNECTED
        </strong>

      </div>

    </div>
  );
}

export default Voice;