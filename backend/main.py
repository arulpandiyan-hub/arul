from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Smart Home Automation API",
    description="Smart Home control API for React, ESP32 and Gemini AI",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# DEVICE STATE
# =========================================================

devices = {
    "light": False,
    "fan": False,
}


# =========================================================
# REQUEST MODEL
# =========================================================

class DeviceCommand(BaseModel):
    state: bool


# =========================================================
# HOME / API TEST
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Smart Home Automation API is running"
    }


# =========================================================
# GET ALL DEVICES
# =========================================================

@app.get("/devices")
def get_devices():

    return {
        "light": devices["light"],
        "fan": devices["fan"],
    }


# =========================================================
# CONTROL DEVICE
#
# React sends:
#
# POST /devices/light
# {
#     "state": true
# }
#
# =========================================================

@app.post("/devices/{device}")
def control_device(
    device: str,
    command: DeviceCommand
):

    # Check device

    if device not in devices:

        raise HTTPException(
            status_code=404,
            detail=f"Device '{device}' not found"
        )


    # Update state

    devices[device] = command.state


    # Status text

    status = (
        "ON"
        if command.state
        else "OFF"
    )


    return {
        "success": True,
        "device": device,
        "state": command.state,
        "status": status,
        "message": f"{device.capitalize()} turned {status}",
    }


# =========================================================
# OLD-STYLE CONTROL ENDPOINT
#
# Also supports:
#
# POST /devices/light/on
# POST /devices/light/off
#
# This keeps compatibility with your previous code.
# =========================================================

@app.post("/devices/{device}/{action}")
def control_device_action(
    device: str,
    action: str
):

    if device not in devices:

        raise HTTPException(
            status_code=404,
            detail=f"Device '{device}' not found"
        )


    if action not in ["on", "off"]:

        raise HTTPException(
            status_code=400,
            detail="Action must be 'on' or 'off'"
        )


    devices[device] = (
        action == "on"
    )


    return {
        "success": True,
        "device": device,
        "state": devices[device],
        "status": (
            "ON"
            if devices[device]
            else "OFF"
        ),
        "message": f"{device.capitalize()} turned {action.upper()}",
    }


# =========================================================
# QUICK ACTIONS
# =========================================================

@app.post("/quick-actions/all-lights-on")
def all_lights_on():

    devices["light"] = True

    return {
        "success": True,
        "light": True,
        "message": "All lights turned ON"
    }


@app.post("/quick-actions/all-lights-off")
def all_lights_off():

    devices["light"] = False

    return {
        "success": True,
        "light": False,
        "message": "All lights turned OFF"
    }


@app.post("/quick-actions/everything-off")
def everything_off():

    devices["light"] = False
    devices["fan"] = False

    return {
        "success": True,
        "light": False,
        "fan": False,
        "message": "Everything turned OFF"
    }


# =========================================================
# CURRENT SENSOR
#
# For now this is a placeholder.
# Later ESP32/current sensor will provide the real value.
# =========================================================

@app.get("/current")
def get_current():

    return {
        "current": 0.00,
        "unit": "A"
    }


# =========================================================
# SYSTEM STATUS
# =========================================================

@app.get("/status")
def get_status():

    return {
        "backend": "online",
        "esp32": "not_connected",
        "light": devices["light"],
        "fan": devices["fan"],
    }