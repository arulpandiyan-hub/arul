import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import {
  Menu,
  X,
  Home,
  Lightbulb,
  Mic,
  Sparkles,
  Bell,
  ShieldCheck,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Voice from "./pages/Voice";
import AI from "./pages/AI";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import SettingsPage from "./pages/SettingsPage";

import "./App.css";

function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved theme
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      return false;
    }

    return true;
  });


  // Change theme
  const changeTheme = (value) => {

    setDarkMode(value);

    localStorage.setItem(
      "theme",
      value ? "dark" : "light"
    );

  };


  const menuItems = [

    {
      path: "/",
      name: "Home",
      icon: Home,
    },

    {
      path: "/devices",
      name: "Devices",
      icon: Lightbulb,
    },

    {
      path: "/voice",
      name: "Voice Control",
      icon: Mic,
    },

    {
      path: "/ai",
      name: "Ask AI",
      icon: Sparkles,
    },

    {
      path: "/notifications",
      name: "Notifications",
      icon: Bell,
    },

    {
      path: "/security",
      name: "Security",
      icon: ShieldCheck,
    },

    {
      path: "/settings",
      name: "Settings",
      icon: Settings,
    },

  ];


  return (

    <BrowserRouter>

      {/* IMPORTANT:
          dark/light class is now on the entire app
      */}

      <div
        className={
          darkMode
            ? "app dark"
            : "app light"
        }
      >


        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="app-header">

          <button
            className="header-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>


          <NavLink
            to="/"
            className="app-brand"
          >

            <div className="brand-logo">
              <Home size={20} />
            </div>

            <div className="brand-text">

              <strong>
                SmartHome
              </strong>

              <span>
                AI Home Assistant
              </span>

            </div>

          </NavLink>


          {/* HEADER THEME BUTTON */}

          <button
            className="header-theme-button"
            onClick={() =>
              changeTheme(!darkMode)
            }
            aria-label="Change theme"
          >

            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}

          </button>

        </header>


        {/* =================================================
            SIDE MENU
        ================================================= */}

        <aside
          className={
            menuOpen
              ? "app-side-menu open"
              : "app-side-menu"
          }
        >

          <div className="side-menu-header">

            <div className="side-brand">

              <div className="brand-logo">
                <Home size={20} />
              </div>

              <div className="brand-text">

                <strong>
                  SmartHome
                </strong>

                <span>
                  AI Home Assistant
                </span>

              </div>

            </div>


            <button
              className="close-menu-button"
              onClick={() =>
                setMenuOpen(false)
              }
            >

              <X size={21} />

            </button>

          </div>


          <div className="side-menu-label">
            SMART HOME
          </div>


          <nav className="side-navigation">

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    isActive
                      ? "side-nav-link active"
                      : "side-nav-link"
                  }
                >

                  <Icon size={20} />

                  <span>
                    {item.name}
                  </span>

                </NavLink>

              );

            })}

          </nav>


          <div className="side-menu-status">

            <span className="online-dot"></span>

            <div>

              <strong>
                System Online
              </strong>

              <span>
                ESP32 Connected
              </span>

            </div>

          </div>

        </aside>


        {/* =================================================
            OVERLAY
        ================================================= */}

        {menuOpen && (

          <div
            className="app-overlay"
            onClick={() =>
              setMenuOpen(false)
            }
          />

        )}


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="app-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/devices"
              element={<Devices />}
            />

            <Route
              path="/voice"
              element={<Voice />}
            />

            <Route
              path="/ai"
              element={<AI />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/security"
              element={<Security />}
            />

            <Route
              path="/settings"
              element={
                <SettingsPage
                  darkMode={darkMode}
                  setDarkMode={changeTheme}
                />
              }
            />

          </Routes>

        </main>


        {/* =================================================
            MOBILE BOTTOM NAVIGATION
        ================================================= */}

        <nav className="bottom-navigation">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "bottom-nav-item active"
                : "bottom-nav-item"
            }
          >

            <Home size={21} />

            <span>
              Home
            </span>

          </NavLink>


          <NavLink
            to="/devices"
            className={({ isActive }) =>
              isActive
                ? "bottom-nav-item active"
                : "bottom-nav-item"
            }
          >

            <Lightbulb size={21} />

            <span>
              Devices
            </span>

          </NavLink>


          <NavLink
            to="/ai"
            className={({ isActive }) =>
              isActive
                ? "bottom-nav-item ai-nav active"
                : "bottom-nav-item ai-nav"
            }
          >

            <Sparkles size={21} />

            <span>
              AI
            </span>

          </NavLink>


          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "bottom-nav-item active"
                : "bottom-nav-item"
            }
          >

            <Settings size={21} />

            <span>
              More
            </span>

          </NavLink>

        </nav>

      </div>

    </BrowserRouter>
  );
}

export default App;