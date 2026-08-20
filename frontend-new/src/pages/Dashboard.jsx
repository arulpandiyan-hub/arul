import {
  Lightbulb,
  Fan,
  Zap,
  Mic,
  Sparkles,
  Wifi,
  ShieldCheck,
  ChevronRight,
  Power,
} from "lucide-react";

import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="eyebrow">
            <span className="eyebrow-star">✦</span>
            INTELLIGENT LIVING
          </div>

          <h1>
            Your home.
            <span>Your control.</span>
          </h1>

          <p className="hero-text">
            Control your devices, automate your home,
            and interact with your AI assistant from one
            beautiful dashboard.
          </p>

          <div className="hero-actions">

            <Link
              to="/devices"
              className="primary-button"
            >
              <Power size={18} />
              Control Devices
            </Link>

            <Link
              to="/ai"
              className="secondary-button"
            >
              <Sparkles size={18} />
              Ask AI
            </Link>

          </div>

        </div>


        {/* HOME ORB */}

        <div className="home-orb-area">

          <div className="orb-ring ring-one"></div>
          <div className="orb-ring ring-two"></div>
          <div className="orb-ring ring-three"></div>

          <div className="home-orb">

            <div className="house-shape">

              <div className="roof"></div>

              <div className="house-body">
                <div className="house-door"></div>
              </div>

            </div>

          </div>

          <div className="orb-status">
            <span></span>
            HOME ONLINE
          </div>

        </div>

      </section>


      {/* HOME STATUS */}

      <section className="status-grid">

        <div className="status-card">

          <div className="status-card-icon blue">
            <Lightbulb size={23} />
          </div>

          <div className="status-card-content">

            <span>ACTIVE DEVICES</span>

            <strong>0</strong>

            <small>
              of 2 devices
            </small>

          </div>

        </div>


        <div className="status-card">

          <div className="status-card-icon purple">
            <Zap size={23} />
          </div>

          <div className="status-card-content">

            <span>POWER STATUS</span>

            <strong>Ready</strong>

            <small>
              System operating normally
            </small>

          </div>

        </div>


        <div className="status-card">

          <div className="status-card-icon green">
            <Wifi size={23} />
          </div>

          <div className="status-card-content">

            <span>CONNECTION</span>

            <strong>Online</strong>

            <small>
              ESP32 connected
            </small>

          </div>

        </div>

      </section>


      {/* DEVICES */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <div className="section-label">
              CONTROL CENTER
            </div>

            <h2>
              Your Devices
            </h2>
          </div>

          <Link
            to="/devices"
            className="view-link"
          >
            View all
            <ChevronRight size={17} />
          </Link>

        </div>


        <div className="dashboard-device-grid">

          {/* LIGHT */}

          <Link
            to="/devices"
            className="dashboard-device-card light-card"
          >

            <div className="dashboard-device-top">

              <div className="dashboard-device-icon light">
                <Lightbulb
                  size={31}
                  strokeWidth={1.8}
                />
              </div>

              <div className="device-off">
                <span></span>
                OFF
              </div>

            </div>

            <div className="dashboard-device-info">

              <h3>
                Living Room Light
              </h3>

              <p>
                Main lighting system
              </p>

            </div>

            <div className="device-preview-control">

              <span>
                Turn ON
              </span>

              <ChevronRight size={19} />

            </div>

          </Link>


          {/* FAN */}

          <Link
            to="/devices"
            className="dashboard-device-card fan-card"
          >

            <div className="dashboard-device-top">

              <div className="dashboard-device-icon fan">
                <Fan
                  size={31}
                  strokeWidth={1.8}
                />
              </div>

              <div className="device-off">
                <span></span>
                OFF
              </div>

            </div>

            <div className="dashboard-device-info">

              <h3>
                Living Room Fan
              </h3>

              <p>
                Smart cooling system
              </p>

            </div>

            <div className="device-preview-control">

              <span>
                Turn ON
              </span>

              <ChevronRight size={19} />

            </div>

          </Link>

        </div>

      </section>


      {/* QUICK ACCESS */}

      <section className="dashboard-section">

        <div className="section-header">

          <div>
            <div className="section-label">
              SMART FEATURES
            </div>

            <h2>
              Quick Access
            </h2>
          </div>

        </div>


        <div className="quick-access-grid">

          <Link
            to="/voice"
            className="quick-access-card voice"
          >

            <div className="quick-access-icon">
              <Mic size={24} />
            </div>

            <div>
              <h3>
                Voice Control
              </h3>

              <p>
                Talk to your home
              </p>
            </div>

            <ChevronRight />

          </Link>


          <Link
            to="/ai"
            className="quick-access-card ai"
          >

            <div className="quick-access-icon">
              <Sparkles size={24} />
            </div>

            <div>
              <h3>
                Gemini AI
              </h3>

              <p>
                Ask your home anything
              </p>
            </div>

            <ChevronRight />

          </Link>


          <Link
            to="/quick-actions"
            className="quick-access-card actions"
          >

            <div className="quick-access-icon">
              <Zap size={24} />
            </div>

            <div>
              <h3>
                Quick Actions
              </h3>

              <p>
                Control everything fast
              </p>
            </div>

            <ChevronRight />

          </Link>

        </div>

      </section>


      {/* BOTTOM STATUS */}

      <section className="dashboard-bottom-grid">

        <Link
          to="/security"
          className="security-mini-card"
        >

          <div className="security-mini-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <span>HOME SECURITY</span>

            <h3>
              Home Protected
            </h3>

            <p>
              No security alerts detected
            </p>
          </div>

          <div className="security-check">
            ✓
          </div>

        </Link>


        <div className="assistant-mini-card">

          <div className="assistant-mini-icon">
            <Sparkles size={25} />
          </div>

          <div>
            <span>AI ASSISTANT</span>

            <h3>
              Ready to help
            </h3>

            <p>
              Ask me to control your home
            </p>
          </div>

          <Link to="/ai">
            <ChevronRight />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;