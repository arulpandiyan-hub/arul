import { useState } from "react";

import {
  Settings,
  Moon,
  Sun,
  Wifi,
  Cpu,
  Bell,
  Mic,
  Sparkles,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);

  const Toggle = ({ enabled, onChange }) => (
    <button
      className={
        enabled
          ? "settings-toggle on"
          : "settings-toggle"
      }
      onClick={onChange}
      aria-label="Toggle setting"
    >
      <span />
    </button>
  );

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>

          <div className="section-label">
            APP CONFIGURATION
          </div>

          <h1>
            Settings
          </h1>

          <p>
            Customize your SmartHome experience.
          </p>

        </div>

        <div className="settings-icon">
          <Settings size={26} />
        </div>

      </div>


      {/* CONNECTION STATUS */}

      <section className="settings-connection">

        <div className="settings-connection-icon">
          <Wifi size={22} />
        </div>

        <div className="settings-connection-content">

          <strong>
            ESP32 Controller
          </strong>

          <span>
            Connected and ready
          </span>

        </div>

        <div className="settings-online">
          <span />
          ONLINE
        </div>

      </section>


      {/* APPEARANCE */}

      <section className="settings-section">

        <div className="settings-section-heading">

          <div>
            <span>APPEARANCE</span>
            <h2>Theme</h2>
          </div>

          {darkMode ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}

        </div>


        <div className="theme-options">

          <button
            className={
              darkMode
                ? "theme-option selected"
                : "theme-option"
            }
            onClick={() => setDarkMode(true)}
          >

            <Moon size={20} />

            <div>
              <strong>Dark Mode</strong>
              <span>Comfortable for night use</span>
            </div>

            {darkMode && (
              <CheckCircle2 size={18} />
            )}

          </button>


          <button
            className={
              !darkMode
                ? "theme-option selected"
                : "theme-option"
            }
            onClick={() => setDarkMode(false)}
          >

            <Sun size={20} />

            <div>
              <strong>Light Mode</strong>
              <span>Bright and clean interface</span>
            </div>

            {!darkMode && (
              <CheckCircle2 size={18} />
            )}

          </button>

        </div>

      </section>


      {/* SMART FEATURES */}

      <section className="settings-section">

        <div className="settings-section-heading">

          <div>
            <span>SMART FEATURES</span>
            <h2>Automation</h2>
          </div>

          <Sparkles size={20} />

        </div>


        <div className="settings-list">

          <div className="settings-row">

            <div className="settings-row-icon blue">
              <Bell size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                Notifications
              </strong>

              <span>
                Receive device and system alerts
              </span>

            </div>

            <Toggle
              enabled={notifications}
              onChange={() =>
                setNotifications(!notifications)
              }
            />

          </div>


          <div className="settings-row">

            <div className="settings-row-icon purple">
              <Mic size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                Voice Control
              </strong>

              <span>
                Allow voice commands
              </span>

            </div>

            <Toggle
              enabled={voiceEnabled}
              onChange={() =>
                setVoiceEnabled(!voiceEnabled)
              }
            />

          </div>


          <div className="settings-row">

            <div className="settings-row-icon violet">
              <Sparkles size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                AI Assistant
              </strong>

              <span>
                Enable Gemini AI features
              </span>

            </div>

            <Toggle
              enabled={aiEnabled}
              onChange={() =>
                setAiEnabled(!aiEnabled)
              }
            />

          </div>

        </div>

      </section>


      {/* DEVICE */}

      <section className="settings-section">

        <div className="settings-section-heading">

          <div>
            <span>DEVICE</span>
            <h2>Controller</h2>
          </div>

          <Cpu size={20} />

        </div>


        <div className="settings-list">

          <div className="settings-row clickable">

            <div className="settings-row-icon green">
              <Cpu size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                ESP32 Controller
              </strong>

              <span>
                SmartHome ESP32
              </span>

            </div>

            <ChevronRight size={18} />

          </div>


          <div className="settings-row clickable">

            <div className="settings-row-icon blue">
              <Wifi size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                Network
              </strong>

              <span>
                Connected
              </span>

            </div>

            <ChevronRight size={18} />

          </div>


          <div className="settings-row clickable">

            <div className="settings-row-icon purple">
              <Smartphone size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                Mobile Application
              </strong>

              <span>
                SmartHome APK
              </span>

            </div>

            <ChevronRight size={18} />

          </div>

        </div>

      </section>


      {/* SYSTEM */}

      <section className="settings-section">

        <div className="settings-section-heading">

          <div>
            <span>SYSTEM</span>
            <h2>Application</h2>
          </div>

          <RefreshCw size={20} />

        </div>


        <div className="settings-list">

          <div className="settings-row clickable">

            <div className="settings-row-icon blue">
              <RefreshCw size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                Check Connection
              </strong>

              <span>
                Test ESP32 connection
              </span>

            </div>

            <ChevronRight size={18} />

          </div>


          <div className="settings-row clickable">

            <div className="settings-row-icon green">
              <CheckCircle2 size={19} />
            </div>

            <div className="settings-row-content">

              <strong>
                System Status
              </strong>

              <span>
                All systems ready
              </span>

            </div>

            <ChevronRight size={18} />

          </div>

        </div>

      </section>


      {/* APP INFO */}

      <div className="settings-footer">

        <div className="settings-footer-logo">
          <Settings size={19} />
        </div>

        <div>

          <strong>
            SmartHome AI
          </strong>

          <span>
            Smart Home Assistant • Version 1.0.0
          </span>

        </div>

      </div>

    </div>
  );
}

export default SettingsPage;