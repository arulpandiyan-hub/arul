import { useState } from "react";

import {
  Lightbulb,
  Power,
  Zap,
  Fan,
  Home,
  CheckCircle2,
} from "lucide-react";

function QuickActions() {
  const [lightsOn, setLightsOn] = useState(false);
  const [everythingOff, setEverythingOff] = useState(false);

  const handleAllLights = () => {
    setLightsOn(!lightsOn);
    setEverythingOff(false);
  };

  const handleEverythingOff = () => {
    setEverythingOff(true);
    setLightsOn(false);
  };

  return (
    <div className="quick-page">

      {/* HEADER */}

      <div className="quick-header">

        <div>
          <div className="section-label">
            SMART CONTROL
          </div>

          <h1>Quick Actions</h1>

          <p>
            Control multiple devices with one tap.
          </p>
        </div>

        <div className="quick-status">
          <CheckCircle2 size={18} />
          <span>READY</span>
        </div>

      </div>


      {/* MAIN ACTIONS */}

      <div className="quick-action-grid">

        {/* ALL LIGHTS */}

        <button
          className={
            lightsOn
              ? "quick-action-card lights selected"
              : "quick-action-card lights"
          }
          onClick={handleAllLights}
        >

          <div className="quick-card-top">

            <div className="quick-icon">
              <Lightbulb size={32} />
            </div>

            <div className="quick-card-check">
              {lightsOn ? "ACTIVE" : "READY"}
            </div>

          </div>

          <div className="quick-card-content">

            <h2>
              All Lights
            </h2>

            <p>
              Turn every connected light
              {lightsOn ? " ON" : " ON"}.
            </p>

          </div>

          <div className="quick-action-button">

            <Power size={17} />

            {lightsOn
              ? "Lights are ON"
              : "Turn All Lights ON"}

          </div>

        </button>


        {/* ALL LIGHTS OFF */}

        <button
          className="quick-action-card lights-off"
          onClick={() => {
            setLightsOn(false);
            setEverythingOff(false);
          }}
        >

          <div className="quick-card-top">

            <div className="quick-icon">
              <Lightbulb size={32} />
            </div>

            <div className="quick-card-check">
              READY
            </div>

          </div>

          <div className="quick-card-content">

            <h2>
              All Lights OFF
            </h2>

            <p>
              Switch every connected light off.
            </p>

          </div>

          <div className="quick-action-button red">

            <Power size={17} />

            Turn All Lights OFF

          </div>

        </button>


        {/* EVERYTHING OFF */}

        <button
          className={
            everythingOff
              ? "quick-action-card everything selected"
              : "quick-action-card everything"
          }
          onClick={handleEverythingOff}
        >

          <div className="quick-card-top">

            <div className="quick-icon">
              <Home size={32} />
            </div>

            <div className="quick-card-check">
              {everythingOff ? "ACTIVE" : "READY"}
            </div>

          </div>

          <div className="quick-card-content">

            <h2>
              Everything OFF
            </h2>

            <p>
              Turn off all connected devices.
            </p>

          </div>

          <div className="quick-action-button red">

            <Power size={17} />

            {everythingOff
              ? "Everything is OFF"
              : "Turn Everything OFF"}

          </div>

        </button>


        {/* FAN */}

        <button
          className="quick-action-card fan-action"
        >

          <div className="quick-card-top">

            <div className="quick-icon">
              <Fan size={32} />
            </div>

            <div className="quick-card-check">
              READY
            </div>

          </div>

          <div className="quick-card-content">

            <h2>
              Fan Control
            </h2>

            <p>
              Quickly access your smart fan.
            </p>

          </div>

          <div className="quick-action-button blue">

            <Zap size={17} />

            Open Fan Control

          </div>

        </button>

      </div>


      {/* ACTIVITY */}

      <div className="quick-activity">

        <div className="quick-activity-header">

          <div>
            <div className="section-label">
              AUTOMATION STATUS
            </div>

            <h2>
              Quick Control
            </h2>
          </div>

          <span className="activity-online">
            <span></span>
            SYSTEM ONLINE
          </span>

        </div>


        <div className="quick-info-grid">

          <div className="quick-info-card">

            <Lightbulb size={19} />

            <div>
              <span>LIGHTS</span>
              <strong>
                {lightsOn ? "ON" : "OFF"}
              </strong>
            </div>

          </div>


          <div className="quick-info-card">

            <Fan size={19} />

            <div>
              <span>FAN</span>
              <strong>READY</strong>
            </div>

          </div>


          <div className="quick-info-card">

            <Zap size={19} />

            <div>
              <span>ESP32</span>
              <strong>CONNECTED</strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuickActions;