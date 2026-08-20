
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [current, setCurrent] = useState(0);
  const [connection, setConnection] = useState(false);

  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState(
    'Say "turn on the light"'
  );

  const [time, setTime] = useState(new Date());

  // -----------------------------
  // CLOCK
  // -----------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // -----------------------------
  // GET DEVICE STATUS
  // -----------------------------

  const getDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/devices`);

      if (!response.ok) {
        throw new Error("Unable to connect to FastAPI");
      }

      const data = await response.json();

      setLightOn(data.light);
      setFanOn(data.fan);

      setConnection(true);
    } catch (error) {
      console.error("Device status error:", error);
      setConnection(false);
    }
  };

  // -----------------------------
  // GET CURRENT SENSOR
  // -----------------------------

  const getCurrent = async () => {
    try {
      const response = await fetch(`${API_URL}/current`);

      if (!response.ok) {
        throw new Error("Unable to get current");
      }

      const data = await response.json();

      setCurrent(Number(data.current) || 0);
    } catch (error) {
      console.error("Current error:", error);
    }
  };

  // -----------------------------
  // INITIAL DATA + AUTO REFRESH
  // -----------------------------

  useEffect(() => {
    getDevices();
    getCurrent();

    const interval = setInterval(() => {
      getDevices();
      getCurrent();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // CONTROL LIGHT
  // -----------------------------

  const controlLight = async (desiredState = null) => {
    const newState =
      desiredState === null
        ? !lightOn
        : desiredState;

    const action = newState ? "on" : "off";

    try {
      const response = await fetch(
        `${API_URL}/devices/light/${action}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Light request failed");
      }

      const data = await response.json();

      console.log("Light response:", data);

      setLightOn(data.status === "ON");
      setConnection(true);
    } catch (error) {
      console.error("Light control error:", error);
      setConnection(false);
    }
  };

  // -----------------------------
  // CONTROL FAN
  // -----------------------------

  const controlFan = async (desiredState = null) => {
    const newState =
      desiredState === null
        ? !fanOn
        : desiredState;

    const action = newState ? "on" : "off";

    try {
      const response = await fetch(
        `${API_URL}/devices/fan/${action}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Fan request failed");
      }

      const data = await response.json();

      console.log("Fan response:", data);

      setFanOn(data.status === "ON");
      setConnection(true);
    } catch (error) {
      console.error("Fan control error:", error);
      setConnection(false);
    }
  };

  // -----------------------------
  // VOICE CONTROL
  // -----------------------------

  const startVoiceControl = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceText(
        "Voice control is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);
    setVoiceText("Listening...");

    recognition.start();

    recognition.onresult = async (event) => {
      const command =
        event.results[0][0].transcript.toLowerCase();

      console.log("Voice command:", command);

      setVoiceText(`"${command}"`);

      // LIGHT ON
      if (
        command.includes("light") &&
        command.includes("on")
      ) {
        await controlLight(true);
        return;
      }

      // LIGHT OFF
      if (
        command.includes("light") &&
        command.includes("off")
      ) {
        await controlLight(false);
        return;
      }

      // FAN ON
      if (
        command.includes("fan") &&
        command.includes("on")
      ) {
        await controlFan(true);
        return;
      }

      // FAN OFF
      if (
        command.includes("fan") &&
        command.includes("off")
      ) {
        await controlFan(false);
        return;
      }

      // BOTH ON
      if (
        command.includes("all") &&
        command.includes("on")
      ) {
        await controlLight(true);
        await controlFan(true);
        return;
      }

      // BOTH OFF
      if (
        command.includes("all") &&
        command.includes("off")
      ) {
        await controlLight(false);
        await controlFan(false);
        return;
      }

      setVoiceText(
        `Command not recognized: "${command}"`
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Voice recognition error:",
        event.error
      );

      setListening(false);

      setVoiceText(
        "Voice error. Please try again."
      );
    };
  };

  // -----------------------------
  // ACTIVE DEVICE COUNT
  // -----------------------------

  const activeDevices =
    (lightOn ? 1 : 0) +
    (fanOn ? 1 : 0);

  return (
    <div className="app">

      {/* BACKGROUND */}

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            ⌂
          </div>

          <div>
            <h1>
              Smart<span>Home</span>
            </h1>

            <p>
              HOME AUTOMATION SYSTEM
            </p>
          </div>

        </div>

        <div className="header-right">

          <div className="clock">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          <div className="online">

            <span
              className={
                connection
                  ? ""
                  : "offline-dot"
              }
            ></span>

            {connection
              ? "ONLINE"
              : "OFFLINE"}

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="container">

        {/* HERO */}

        <section className="hero">

          <div className="hero-text">

            <p className="eyebrow">
              ✦ INTELLIGENT LIVING
            </p>

            <h2>
              Your home.
              <br />
              <span>Your control.</span>
            </h2>

            <p className="hero-description">
              Control your appliances, monitor energy
              usage, and interact with your smart home
              using your voice.
            </p>

          </div>

          <div className="hero-circle">

            <div className="house-symbol">
              ⌂
            </div>

            <div className="circle-ring ring-one"></div>

            <div className="circle-ring ring-two"></div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="stats">

          <div className="stat-card">

            <div className="stat-icon blue">
              ◉
            </div>

            <div>

              <p>
                DEVICES
              </p>

              <h3>
                02
              </h3>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">
              ⚡
            </div>

            <div>

              <p>
                CURRENT
              </p>

              <h3>
                {current.toFixed(2)}
                <small> A</small>
              </h3>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>

              <p>
                ACTIVE
              </p>

              <h3>
                {activeDevices}
              </h3>

            </div>

          </div>

        </section>

        {/* ================= DEVICES ================= */}

        <section className="section">

          <div className="section-title">

            <div>

              <p>
                CONTROL CENTER
              </p>

              <h2>
                Your Devices
              </h2>

            </div>

            <span>
              2 DEVICES
            </span>

          </div>

          <div className="devices">

            {/* LIGHT */}

            <div
              className={
                lightOn
                  ? "device device-active"
                  : "device"
              }
            >

              <div className="device-header">

                <div
                  className={
                    lightOn
                      ? "device-icon icon-active"
                      : "device-icon"
                  }
                >
                  💡
                </div>

                <div
                  className={
                    lightOn
                      ? "device-status active"
                      : "device-status"
                  }
                >

                  <span></span>

                  {lightOn
                    ? "ACTIVE"
                    : "OFF"}

                </div>

              </div>

              <div className="device-info">

                <h3>
                  Living Room Light
                </h3>

                <p>
                  Main lighting system
                </p>

              </div>

              <button
                className={
                  lightOn
                    ? "device-button button-off"
                    : "device-button"
                }
                onClick={() =>
                  controlLight()
                }
              >

                <span>
                  {lightOn
                    ? "Turn OFF"
                    : "Turn ON"}
                </span>

                <b>
                  →
                </b>

              </button>

            </div>

            {/* FAN */}

            <div
              className={
                fanOn
                  ? "device device-active"
                  : "device"
              }
            >

              <div className="device-header">

                <div
                  className={
                    fanOn
                      ? "device-icon icon-active"
                      : "device-icon"
                  }
                >
                  🌀
                </div>

                <div
                  className={
                    fanOn
                      ? "device-status active"
                      : "device-status"
                  }
                >

                  <span></span>

                  {fanOn
                    ? "ACTIVE"
                    : "OFF"}

                </div>

              </div>

              <div className="device-info">

                <h3>
                  Living Room Fan
                </h3>

                <p>
                  Smart cooling system
                </p>

              </div>

              <button
                className={
                  fanOn
                    ? "device-button button-off"
                    : "device-button"
                }
                onClick={() =>
                  controlFan()
                }
              >

                <span>
                  {fanOn
                    ? "Turn OFF"
                    : "Turn ON"}
                </span>

                <b>
                  →
                </b>

              </button>

            </div>

          </div>

        </section>

        {/* ================= VOICE CONTROL ================= */}

        <section className="voice">

          <div className="voice-left">

            <div
              className={
                listening
                  ? "mic mic-listening"
                  : "mic"
              }
            >
              🎙️
            </div>

            <div>

              <p className="voice-label">
                VOICE CONTROL
              </p>

              <h2>
                Talk to your home
              </h2>

              <p>
                Try:
                <strong>
                  "Turn on the light"
                </strong>
              </p>

            </div>

          </div>

          <div className="voice-right">

            <button
              className={
                listening
                  ? "voice-button listening"
                  : "voice-button"
              }
              onClick={startVoiceControl}
            >

              {listening
                ? "Listening..."
                : "Start Listening"}

            </button>

            <div className="voice-result">
              {voiceText}
            </div>

          </div>

        </section>

        {/* ================= ENERGY MONITOR ================= */}

        <section className="monitor">

          <div className="monitor-header">

            <div>

              <p>
                ENERGY MONITOR
              </p>

              <h2>
                Current Consumption
              </h2>

            </div>

            <div className="live">

              <span></span>

              LIVE

            </div>

          </div>

          <div className="energy">

            <div className="energy-number">

              {current.toFixed(2)}

              <span>
                A
              </span>

            </div>

            <div className="energy-bars">

              <div style={{ height: "35%" }}></div>
              <div style={{ height: "50%" }}></div>
              <div style={{ height: "25%" }}></div>
              <div style={{ height: "60%" }}></div>
              <div style={{ height: "40%" }}></div>
              <div style={{ height: "70%" }}></div>
              <div style={{ height: "45%" }}></div>
              <div style={{ height: "30%" }}></div>
              <div style={{ height: "55%" }}></div>
              <div style={{ height: "35%" }}></div>

            </div>

          </div>

          <p className="sensor-text">
            Real-time current sensor data
          </p>

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <footer>

        <span>
          SMART HOME
        </span>

        <p>
          Home Automation System • React + FastAPI + Arduino
        </p>

      </footer>

    </div>
  );
}

export default App;
const getDevices = async () => {
  const response = await fetch(`${API_URL}/devices`);
  const data = await response.json();

  console.log(data);
};
const controlLight = async () => {
  const action = lightOn ? "off" : "on";

  const response = await fetch(
    `${API_URL}/devices/light/${action}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  console.log(data);

  setLightOn(data.status === "ON");
};
