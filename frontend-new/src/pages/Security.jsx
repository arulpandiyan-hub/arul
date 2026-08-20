import { useState } from "react";

import {
  ShieldCheck,
  Shield,
  Wifi,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Smartphone,
  Cpu,
} from "lucide-react";

function Security() {
  const [armed, setArmed] = useState(false);

  const securityItems = [
    {
      icon: Wifi,
      title: "Network",
      value: "Connected",
      status: "SECURE",
      type: "green",
    },
    {
      icon: Cpu,
      title: "ESP32 Controller",
      value: "Online",
      status: "CONNECTED",
      type: "blue",
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      value: "Available",
      status: "READY",
      type: "purple",
    },
  ];

  return (
    <div className="security-page">

      {/* HEADER */}

      <div className="security-header">

        <div>
          <div className="section-label">
            HOME PROTECTION
          </div>

          <h1>Security</h1>

          <p>
            Monitor the safety and connection status
            of your smart home.
          </p>
        </div>

        <div className="security-header-status">
          <span></span>
          SYSTEM SECURE
        </div>

      </div>


      {/* MAIN SECURITY CARD */}

      <section
        className={
          armed
            ? "security-main armed"
            : "security-main"
        }
      >

        <div className="security-glow"></div>

        <div className="security-shield">

          {armed ? (
            <ShieldCheck
              size={58}
              strokeWidth={1.5}
            />
          ) : (
            <Shield
              size={58}
              strokeWidth={1.5}
            />
          )}

        </div>

        <div className="security-main-content">

          <span className="security-small-label">
            HOME SECURITY
          </span>

          <h2>
            {armed
              ? "Security Armed"
              : "Home is Secure"}
          </h2>

          <p>
            {armed
              ? "Security monitoring is active."
              : "No security issues detected."}
          </p>

        </div>

        <button
          className={
            armed
              ? "security-toggle active"
              : "security-toggle"
          }
          onClick={() => setArmed(!armed)}
        >

          {armed ? (
            <Lock size={18} />
          ) : (
            <Unlock size={18} />
          )}

          {armed ? "DISARM" : "ARM SECURITY"}

        </button>

      </section>


      {/* STATUS GRID */}

      <div className="security-grid">

        {securityItems.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              className="security-status-card"
              key={index}
            >

              <div
                className={
                  `security-status-icon ${item.type}`
                }
              >
                <Icon size={21} />
              </div>

              <div className="security-status-content">

                <span>
                  {item.title}
                </span>

                <strong>
                  {item.value}
                </strong>

                <small
                  className={item.type}
                >
                  <i></i>
                  {item.status}
                </small>

              </div>

            </div>
          );

        })}

      </div>


      {/* ACTIVITY */}

      <section className="security-activity">

        <div className="security-section-heading">

          <div>
            <span>
              SECURITY ACTIVITY
            </span>

            <h2>
              Recent Status
            </h2>
          </div>

          <Activity size={20} />

        </div>


        <div className="security-timeline">

          <div className="security-event">

            <div className="event-icon green">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <strong>
                System check completed
              </strong>

              <span>
                All connected devices are responding normally.
              </span>
            </div>

            <time>
              Just now
            </time>

          </div>


          <div className="security-event">

            <div className="event-icon blue">
              <Wifi size={17} />
            </div>

            <div>
              <strong>
                ESP32 connection active
              </strong>

              <span>
                Smart-home controller is connected.
              </span>
            </div>

            <time>
              2 min ago
            </time>

          </div>


          <div className="security-event">

            <div className="event-icon purple">
              <Smartphone size={17} />
            </div>

            <div>
              <strong>
                Mobile access available
              </strong>

              <span>
                Your SmartHome application is ready.
              </span>
            </div>

            <time>
              5 min ago
            </time>

          </div>

        </div>

      </section>


      {/* WARNING */}

      <div className="security-notice">

        <AlertTriangle size={19} />

        <div>

          <strong>
            Security monitoring
          </strong>

          <p>
            Hardware-level security alerts will be
            enabled when the ESP32 and backend are
            connected.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Security;