import { useEffect, useState } from "react";
import { Lightbulb, Fan, Wifi, WifiOff, RefreshCw } from "lucide-react";

const API = "http://127.0.0.1:8000";

function Devices() {
  const [devices, setDevices] = useState({
    light: false,
    fan: false,
  });

  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDevices = async () => {
    try {
      setError("");

      const response = await fetch(`${API}/devices`);

      if (!response.ok) {
        throw new Error("Backend returned an error");
      }

      const data = await response.json();

      setDevices({
        light: Boolean(data.light),
        fan: Boolean(data.fan),
      });

      setConnected(true);
    } catch (err) {
      console.error(err);

      setConnected(false);
      setError("Cannot connect to FastAPI");
    }
  };

  useEffect(() => {
    loadDevices();

    const timer = setInterval(loadDevices, 3000);

    return () => clearInterval(timer);
  }, []);

  const controlDevice = async (device, state) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/devices/${device}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            state,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Device command failed");
      }

      const data = await response.json();

      setDevices((current) => ({
        ...current,
        [device]:
          data.state !== undefined
            ? Boolean(data.state)
            : state,
      }));

      setConnected(true);
    } catch (err) {
      console.error(err);

      setError(
        `Failed to control ${device}. Check FastAPI.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="devices-page">

      <div className="devices-header">

        <div>
          <div className="section-label">
            SMART DEVICES
          </div>

          <h1>Devices</h1>

          <p>
            Control your connected home devices.
          </p>
        </div>

        <button
          className="refresh-devices"
          onClick={loadDevices}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      <div
        className={
          connected
            ? "device-connection connected"
            : "device-connection"
        }
      >

        {connected ? (
          <Wifi size={19} />
        ) : (
          <WifiOff size={19} />
        )}

        <div>
          <strong>
            {connected
              ? "Backend Connected"
              : "Backend Offline"}
          </strong>

          <span>
            {connected
              ? "FastAPI is responding"
              : "Cannot reach 127.0.0.1:8000"}
          </span>
        </div>

        <span className="connection-status">
          {connected ? "ONLINE" : "OFFLINE"}
        </span>

      </div>


      {error && (
        <div className="device-error">
          {error}
        </div>
      )}


      <div className="devices-grid">

        {/* LIGHT */}

        <div
          className={
            devices.light
              ? "device-card light-on"
              : "device-card"
          }
        >

          <div className="device-card-top">

            <div className="device-icon light">
              <Lightbulb size={30} />
            </div>

            <div
              className={
                devices.light
                  ? "device-status on"
                  : "device-status"
              }
            >
              <span />
              {devices.light ? "ON" : "OFF"}
            </div>

          </div>


          <h2>
            Living Room Light
          </h2>

          <p>
            Main room lighting
          </p>


          <div className="device-control">

            <button
              className={
                devices.light
                  ? "device-button active"
                  : "device-button"
              }
              disabled={loading}
              onClick={() =>
                controlDevice(
                  "light",
                  !devices.light
                )
              }
            >

              <Lightbulb size={18} />

              {devices.light
                ? "Turn OFF"
                : "Turn ON"}

            </button>

          </div>

        </div>


        {/* FAN */}

        <div
          className={
            devices.fan
              ? "device-card fan-on"
              : "device-card"
          }
        >

          <div className="device-card-top">

            <div className="device-icon fan">
              <Fan size={30} />
            </div>

            <div
              className={
                devices.fan
                  ? "device-status on"
                  : "device-status"
              }
            >
              <span />
              {devices.fan ? "ON" : "OFF"}
            </div>

          </div>


          <h2>
            Living Room Fan
          </h2>

          <p>
            Main room ventilation
          </p>


          <div className="device-control">

            <button
              className={
                devices.fan
                  ? "device-button active"
                  : "device-button"
              }
              disabled={loading}
              onClick={() =>
                controlDevice(
                  "fan",
                  !devices.fan
                )
              }
            >

              <Fan size={18} />

              {devices.fan
                ? "Turn OFF"
                : "Turn ON"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Devices;