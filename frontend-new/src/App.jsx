import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Home,
  Lightbulb,
  Zap,
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
import QuickActions from "./pages/QuickActions";
import Voice from "./pages/Voice";
import AI from "./pages/AI";
import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import SettingsPage from "./pages/SettingsPage";

import "./App.css";


function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(true);


  /*
  =====================================================
  NAVIGATION MENU
  =====================================================
  */

  const menuItems = [

    {
      path: "/",
      name: "Dashboard",
      icon: Home,
    },

    {
      path: "/devices",
      name: "Devices",
      icon: Lightbulb,
    },

    {
      path: "/quick-actions",
      name: "Quick Actions",
      icon: Zap,
    },

    {
      path: "/voice",
      name: "Voice Control",
      icon: Mic,
    },

    {
      path: "/ai",
      name: "AI Assistant",
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


  /*
  =====================================================
  CLOSE MENU
  =====================================================
  */

  const closeMenu = () => {
    setMenuOpen(false);
  };


  /*
  =====================================================
  TOGGLE THEME
  =====================================================
  */

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };


  return (

    <BrowserRouter>

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

        <header className="header">


          {/* HAMBURGER BUTTON */}

          <button
            className="menu-button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >

            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}

          </button>


          {/* BRAND */}

          <div className="brand">

            <div className="brand-icon">

              <Home
                size={22}
                strokeWidth={2}
              />

            </div>


            <div>

              <h2>
                SmartHome
              </h2>

              <span>
                AI Home Assistant
              </span>

            </div>

          </div>


          {/* THEME BUTTON */}

          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >

            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}

          </button>

        </header>


        {/* =================================================
            SIDE NAVIGATION
        ================================================= */}

        <aside
          className={
            menuOpen
              ? "side-menu open"
              : "side-menu"
          }
        >


          {/* MENU TITLE */}

          <div className="menu-title">
            SMART HOME
          </div>


          {/* NAVIGATION */}

          <nav>

            {menuItems.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "menu-link active"
                      : "menu-link"
                  }
                >

                  <Icon
                    size={20}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.name}
                  </span>

                </NavLink>

              );

            })}

          </nav>


          {/* CONNECTION STATUS */}

          <div className="menu-footer">

            <div className="connection-dot"></div>

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
            MENU OVERLAY
        ================================================= */}

        {menuOpen && (

          <div
            className="menu-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />

        )}


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="page-container">

          <Routes>


            {/* DASHBOARD */}

            <Route
              path="/"
              element={<Dashboard />}
            />


            {/* DEVICES */}

            <Route
              path="/devices"
              element={<Devices />}
            />


            {/* QUICK ACTIONS */}

            <Route
              path="/quick-actions"
              element={<QuickActions />}
            />


            {/* VOICE */}

            <Route
              path="/voice"
              element={<Voice />}
            />


            {/* AI */}

            <Route
              path="/ai"
              element={<AI />}
            />


            {/* NOTIFICATIONS */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />


            {/* SECURITY */}

            <Route
              path="/security"
              element={<Security />}
            />


            {/* SETTINGS */}

            <Route
              path="/settings"
              element={<SettingsPage />}
            />


            {/* UNKNOWN URL */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>

  );
}


export default App;