import { useEffect, useState } from "react";

import {
  Lightbulb,
  Fan,
  Zap,
  Power,
  Sparkles,
  ArrowRight,
  Wifi,
  Clock3,
} from "lucide-react";

import "./Dashboard.css";

// =====================================================
// FASTAPI BACKEND
// =====================================================

const API = "http://10.40.59.177:8000";


function Dashboard() {

  // ===================================================
  // STATE
  // ===================================================

  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);

  const [loading, setLoading] = useState(false);

  const [backendOnline, setBackendOnline] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());


  // ===================================================
  // REAL-TIME CLOCK
  // ===================================================

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };

  }, []);


  // ===================================================
  // GREETING
  // ===================================================

  const getGreeting = () => {

    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good evening";
    }

    return "Good night";
  };


  const formattedTime =
    currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });


  const formattedDate =
    currentTime.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });


  // ===================================================
  // GET DEVICE STATUS
  // ===================================================

  const getDeviceStatus = async () => {

    try {

      const response = await fetch(
        `${API}/devices`,
        {
          method: "GET",
          cache: "no-store",
        }
      );


      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }


      const data = await response.json();


      console.log(
        "ESP32 device status:",
        data
      );


      if (
        typeof data.light === "boolean"
      ) {
        setLightOn(data.light);
      }


      if (
        typeof data.fan === "boolean"
      ) {
        setFanOn(data.fan);
      }


      setBackendOnline(true);

    }

    catch (error) {

      console.error(
        "Backend connection error:",
        error
      );

      setBackendOnline(false);
    }

  };


  // ===================================================
  // CHECK BACKEND
  // ===================================================

  useEffect(() => {

    getDeviceStatus();


    const statusTimer =
      setInterval(() => {

        getDeviceStatus();

      }, 3000);


    return () => {
      clearInterval(statusTimer);
    };

  }, []);


  // ===================================================
  // CONTROL DEVICE
  // ===================================================

  const controlDevice = async (
    device,
    state
  ) => {

    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const action =
        state ? "on" : "off";


      console.log(
        `Sending ${device} ${action}`
      );


      const response =
        await fetch(
          `${API}/device/${device}/${action}`,
          {
            method: "POST",
          }
        );


      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        "Device response:",
        data
      );


      if (device === "light") {

        setLightOn(state);

      }


      if (device === "fan") {

        setFanOn(state);

      }


      setBackendOnline(true);

    }

    catch (error) {

      console.error(
        "Device control error:",
        error
      );

      setBackendOnline(false);

    }

    finally {

      setLoading(false);

    }

  };


  // ===================================================
  // LIGHT
  // ===================================================

  const toggleLight = () => {

    controlDevice(
      "light",
      !lightOn
    );

  };


  // ===================================================
  // FAN
  // ===================================================

  const toggleFan = () => {

    controlDevice(
      "fan",
      !fanOn
    );

  };


  // ===================================================
  // ALL ON
  // ===================================================

  const allOn = async () => {

    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const lightResponse =
        await fetch(
          `${API}/device/light/on`,
          {
            method: "POST",
          }
        );


      if (!lightResponse.ok) {
        throw new Error(
          `Light HTTP ${lightResponse.status}`
        );
      }


      const fanResponse =
        await fetch(
          `${API}/device/fan/on`,
          {
            method: "POST",
          }
        );


      if (!fanResponse.ok) {
        throw new Error(
          `Fan HTTP ${fanResponse.status}`
        );
      }


      setLightOn(true);
      setFanOn(true);

      setBackendOnline(true);

    }

    catch (error) {

      console.error(
        "All ON error:",
        error
      );

      setBackendOnline(false);

    }

    finally {

      setLoading(false);

    }

  };


  // ===================================================
  // ALL OFF
  // ===================================================

  const allOff = async () => {

    if (loading) {
      return;
    }


    setLoading(true);


    try {

      const lightResponse =
        await fetch(
          `${API}/device/light/off`,
          {
            method: "POST",
          }
        );


      if (!lightResponse.ok) {
        throw new Error(
          `Light HTTP ${lightResponse.status}`
        );
      }


      const fanResponse =
        await fetch(
          `${API}/device/fan/off`,
          {
            method: "POST",
          }
        );


      if (!fanResponse.ok) {
        throw new Error(
          `Fan HTTP ${fanResponse.status}`
        );
      }


      setLightOn(false);
      setFanOn(false);

      setBackendOnline(true);

    }

    catch (error) {

      console.error(
        "All OFF error:",
        error
      );

      setBackendOnline(false);

    }

    finally {

      setLoading(false);

    }

  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="dashboard-page">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="dashboard-topbar">

        <div className="brand-area">

          <div className="brand-icon">
            <Sparkles size={20} />
          </div>


          <div>

            <span className="brand-title">
              SmartHome
            </span>

            <span className="brand-subtitle">
              Home automation
            </span>

          </div>

        </div>


        <div
          className={
            backendOnline
              ? "online-badge"
              : "online-badge offline"
          }
        >

          <span className="online-dot"></span>

          {backendOnline
            ? "Online"
            : "Offline"}

        </div>

      </div>


      {/* =================================================
          WELCOME
      ================================================= */}

      <section className="welcome-card">

        <div className="welcome-content">

          <span className="welcome-small">
            YOUR SMART HOME
          </span>


          <h1>
            {getGreeting()}
          </h1>


          <p>
            Welcome back. Your home is ready.
          </p>


          <div className="time-row">

            <Clock3 size={16} />

            <strong>
              {formattedTime}
            </strong>

            <span>
              {formattedDate}
            </span>

          </div>

        </div>


        <div className="welcome-glow">

          <Sparkles size={52} />

        </div>

      </section>


      {/* =================================================
          DEVICES
      ================================================= */}

      <section className="home-section">

        <div className="section-title-row">

          <div>

            <span className="section-kicker">
              YOUR DEVICES
            </span>

            <h2>
              Living Room
            </h2>

          </div>


          <div className="connection-status">

            <Wifi size={15} />

            {backendOnline
              ? "Connected"
              : "Disconnected"}

          </div>

        </div>


        <div className="device-grid">


          {/* =================================================
              LIGHT
          ================================================= */}

          <div
            className={
              `device-card light-device ${lightOn ? "active" : ""
              }`
            }
          >

            <div className="device-header">

              <div
                className={
                  `device-icon ${lightOn ? "active" : ""
                  }`
                }
              >

                <Lightbulb size={26} />

              </div>


              <span
                className={
                  `device-status ${lightOn ? "active" : ""
                  }`
                }
              >

                {lightOn
                  ? "ON"
                  : "OFF"}

              </span>

            </div>


            <div className="device-main">

              <h3>
                Light
              </h3>


              <p>

                {lightOn
                  ? "Living room is illuminated"
                  : "Light is currently off"}

              </p>

            </div>


            <button
              className={
                `device-toggle ${lightOn ? "active" : ""
                }`
              }
              onClick={toggleLight}
              disabled={loading}
              aria-label="Toggle light"
            >

              <span></span>

            </button>

          </div>


          {/* =================================================
              FAN
          ================================================= */}

          <div
            className={
              `device-card fan-device ${fanOn ? "active" : ""
              }`
            }
          >

            <div className="device-header">

              <div
                className={
                  `device-icon fan ${fanOn ? "active" : ""
                  }`
                }
              >

                <Fan size={26} />

              </div>


              <span
                className={
                  `device-status ${fanOn ? "active" : ""
                  }`
                }
              >

                {fanOn
                  ? "ON"
                  : "OFF"}

              </span>

            </div>


            <div className="device-main">

              <h3>
                Fan
              </h3>


              <p>

                {fanOn
                  ? "Living room fan is running"
                  : "Fan is currently off"}

              </p>

            </div>


            <button
              className={
                `device-toggle ${fanOn ? "active" : ""
                }`
              }
              onClick={toggleFan}
              disabled={loading}
              aria-label="Toggle fan"
            >

              <span></span>

            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="home-section">

        <div className="section-title-row">

          <div>

            <span className="section-kicker">
              FAST CONTROL
            </span>

            <h2>
              Quick Actions
            </h2>

          </div>


          <Zap size={20} />

        </div>


        <div className="quick-actions">


          {/* ALL ON */}

          <button
            className="quick-card"
            onClick={allOn}
            disabled={loading}
          >

            <div className="quick-icon">

              <Zap size={21} />

            </div>


            <div>

              <strong>
                All ON
              </strong>

              <span>
                Turn everything on
              </span>

            </div>

          </button>


          {/* ALL OFF */}

          <button
            className="quick-card"
            onClick={allOff}
            disabled={loading}
          >

            <div className="quick-icon off">

              <Power size={21} />

            </div>


            <div>

              <strong>
                All OFF
              </strong>

              <span>
                Turn everything off
              </span>

            </div>

          </button>

        </div>

      </section>


      {/* =================================================
          AI CARD
      ================================================= */}

      <section className="ai-home-card">

        <div className="ai-orb">

          <Sparkles size={28} />

        </div>


        <div className="ai-home-content">

          <span>
            SMART ASSISTANT
          </span>


          <h2>
            Ask SmartHome AI
          </h2>


          <p>
            Control your home naturally
            with AI and voice.
          </p>


          <a
            href="/ai"
            className="ai-home-button"
          >

            Ask AI

            <ArrowRight size={17} />

          </a>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="home-footer">

        <span className="footer-dot"></span>

        {backendOnline
          ? "SmartHome is connected and ready"
          : "SmartHome backend is offline"}

      </div>


    </div>

  );

}


export default Dashboard;