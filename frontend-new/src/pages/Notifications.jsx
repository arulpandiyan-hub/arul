import { useState } from "react";

import {
  Bell,
  Lightbulb,
  Fan,
  Zap,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Clock3,
} from "lucide-react";

function Notifications() {

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "light",
      title: "Light turned ON",
      message: "Living room light was switched ON.",
      time: "Just now",
      unread: true,
    },

    {
      id: 2,
      type: "fan",
      title: "Fan turned OFF",
      message: "Living room fan was switched OFF.",
      time: "5 min ago",
      unread: true,
    },

    {
      id: 3,
      type: "power",
      title: "Power status",
      message: "Power supply is currently available.",
      time: "12 min ago",
      unread: false,
    },

    {
      id: 4,
      type: "esp",
      title: "ESP32 connected",
      message: "Your smart-home controller is online.",
      time: "25 min ago",
      unread: false,
    },

    {
      id: 5,
      type: "ai",
      title: "AI command completed",
      message: "Voice command was successfully processed.",
      time: "32 min ago",
      unread: false,
    },

    {
      id: 6,
      type: "security",
      title: "Home system checked",
      message: "All connected devices are operating normally.",
      time: "1 hour ago",
      unread: false,
    },
  ]);


  const unreadCount =
    notifications.filter(
      (item) => item.unread
    ).length;


  const markAllRead = () => {

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );

  };


  const clearAll = () => {
    setNotifications([]);
  };


  const getIcon = (type) => {

    switch (type) {

      case "light":
        return <Lightbulb size={21} />;

      case "fan":
        return <Fan size={21} />;

      case "power":
        return <Zap size={21} />;

      case "esp":
        return <Wifi size={21} />;

      case "ai":
        return <Sparkles size={21} />;

      case "security":
        return <ShieldCheck size={21} />;

      case "offline":
        return <WifiOff size={21} />;

      default:
        return <Bell size={21} />;

    }

  };


  return (

    <div className="notifications-page">


      {/* HEADER */}

      <div className="notifications-header">

        <div>

          <div className="section-label">
            ACTIVITY CENTER
          </div>

          <h1>
            Notifications
          </h1>

          <p>
            Stay updated with everything happening
            in your smart home.
          </p>

        </div>


        <div className="notification-count">

          <Bell size={19} />

          <div>

            <strong>
              {unreadCount}
            </strong>

            <span>
              UNREAD
            </span>

          </div>

        </div>

      </div>


      {/* ACTION BAR */}

      <div className="notification-actions">

        <button
          onClick={markAllRead}
        >

          <CheckCheck size={17} />

          Mark all as read

        </button>


        <button
          className="clear-button"
          onClick={clearAll}
        >

          <Trash2 size={17} />

          Clear all

        </button>

      </div>


      {/* STATUS SUMMARY */}

      <div className="notification-summary">

        <div className="summary-card">

          <div className="summary-icon green">
            <Wifi size={19} />
          </div>

          <div>

            <span>
              SYSTEM
            </span>

            <strong>
              ONLINE
            </strong>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon blue">
            <Bell size={19} />
          </div>

          <div>

            <span>
              EVENTS
            </span>

            <strong>
              {notifications.length}
            </strong>

          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon purple">
            <Sparkles size={19} />
          </div>

          <div>

            <span>
              AI
            </span>

            <strong>
              READY
            </strong>

          </div>

        </div>

      </div>


      {/* NOTIFICATION LIST */}

      <div className="notification-section">

        <div className="notification-section-title">

          <div>

            <span>
              RECENT ACTIVITY
            </span>

            <h2>
              Home Events
            </h2>

          </div>

          <Clock3 size={20} />

        </div>


        {notifications.length === 0 ? (

          <div className="empty-notifications">

            <div>
              <Bell size={30} />
            </div>

            <h3>
              No notifications
            </h3>

            <p>
              Your home activity will appear here.
            </p>

          </div>

        ) : (

          <div className="notification-list">

            {notifications.map((item) => (

              <div
                key={item.id}
                className={
                  item.unread
                    ? "notification-item unread"
                    : "notification-item"
                }
              >

                <div
                  className={
                    `notification-icon ${item.type}`
                  }
                >

                  {getIcon(item.type)}

                </div>


                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {item.title}
                    </h3>

                    {item.unread && (
                      <span className="new-badge">
                        NEW
                      </span>
                    )}

                  </div>


                  <p>
                    {item.message}
                  </p>


                  <span className="notification-time">
                    {item.time}
                  </span>

                </div>


                {item.unread && (
                  <div className="unread-dot"></div>
                )}

              </div>

            ))}

          </div>

        )}

      </div>


      {/* FUTURE REAL-TIME NOTICE */}

      <div className="notification-info">

        <div className="notification-info-icon">

          <Bell size={20} />

        </div>

        <div>

          <strong>
            Real-time notifications
          </strong>

          <p>
            Device events from your ESP32 will
            appear here automatically when the
            FastAPI connection is enabled.
          </p>

        </div>

      </div>

    </div>

  );
}

export default Notifications;