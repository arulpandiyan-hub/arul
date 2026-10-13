from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

import requests
import os
import re
import threading


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")


# =========================================================
# GEMINI
# =========================================================

gemini_client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="SmartHome API",
    description="Smart Home Automation API",
    version="3.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ESP32
# =========================================================

ESP32_IP = "10.40.59.193"


# =========================================================
# DEVICE STATE
# =========================================================

devices = {
    "light": False,
    "fan": False
}


# =========================================================
# REQUEST MODELS
# =========================================================

class DeviceState(BaseModel):
    state: bool


class AIRequest(BaseModel):
    message: str


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "SmartHome API is running",
        "esp32_ip": ESP32_IP,
        "devices": devices
    }


# =========================================================
# ESP32 STATUS
# =========================================================

def get_esp32_status():

    try:

        response = requests.get(
            f"http://{ESP32_IP}/",
            timeout=3
        )

        if response.status_code != 200:
            return False

        text = response.text

        # -------------------------
        # LIGHT
        # -------------------------

        light_match = re.search(
            r"Light:\s*(ON|OFF)",
            text,
            re.IGNORECASE
        )

        if light_match:

            devices["light"] = (
                light_match.group(1).upper() == "ON"
            )


        # -------------------------
        # FAN
        # -------------------------

        fan_match = re.search(
            r"Fan:\s*(ON|OFF)",
            text,
            re.IGNORECASE
        )

        if fan_match:

            devices["fan"] = (
                fan_match.group(1).upper() == "ON"
            )


        return True

    except requests.exceptions.RequestException:

        return False


# =========================================================
# SEND COMMAND TO ESP32
# =========================================================

def send_esp32_command(endpoint: str):

    try:

        response = requests.post(
            f"http://{ESP32_IP}{endpoint}",
            timeout=5
        )

        if response.status_code != 200:

            raise HTTPException(
                status_code=503,
                detail=(
                    f"ESP32 returned HTTP "
                    f"{response.status_code}"
                )
            )

        return response

    except requests.exceptions.RequestException as e:

        raise HTTPException(
            status_code=503,
            detail=f"Unable to connect to ESP32: {str(e)}"
        )


# =========================================================
# GET DEVICES
# =========================================================

@app.get("/devices")
def get_devices():

    get_esp32_status()

    return {
        "success": True,
        "esp32": "connected",
        "light": devices["light"],
        "fan": devices["fan"]
    }


# =========================================================
# STATUS
# =========================================================

@app.get("/status")
def get_status():

    get_esp32_status()

    return {
        "success": True,
        "esp32": "connected",
        "light": devices["light"],
        "fan": devices["fan"]
    }


# =========================================================
# LIGHT CONTROL
# =========================================================

@app.post("/devices/light")
def control_light(command: DeviceState):

    if command.state:

        response = send_esp32_command(
            "/light/on"
        )

        devices["light"] = True

    else:

        response = send_esp32_command(
            "/light/off"
        )

        devices["light"] = False


    return {
        "success": True,
        "device": "light",
        "state": devices["light"],
        "esp32_response": response.text
    }


# =========================================================
# FAN CONTROL
# =========================================================

@app.post("/devices/fan")
def control_fan(command: DeviceState):

    if command.state:

        response = send_esp32_command(
            "/fan/on"
        )

        devices["fan"] = True

    else:

        response = send_esp32_command(
            "/fan/off"
        )

        devices["fan"] = False


    return {
        "success": True,
        "device": "fan",
        "state": devices["fan"],
        "esp32_response": response.text
    }


# =========================================================
# LIGHT ON
# =========================================================

@app.post("/device/light/on")
def light_on():

    get_esp32_status()

    if devices["light"]:

        return {
            "success": True,
            "device": "light",
            "state": True,
            "already": True,
            "message": "The light is already on."
        }


    response = send_esp32_command(
        "/light/on"
    )

    devices["light"] = True

    return {
        "success": True,
        "device": "light",
        "state": True,
        "already": False,
        "message": "The light is now on.",
        "esp32_response": response.text
    }


# =========================================================
# LIGHT OFF
# =========================================================

@app.post("/device/light/off")
def light_off():

    get_esp32_status()

    if not devices["light"]:

        return {
            "success": True,
            "device": "light",
            "state": False,
            "already": True,
            "message": "The light is already off."
        }


    response = send_esp32_command(
        "/light/off"
    )

    devices["light"] = False

    return {
        "success": True,
        "device": "light",
        "state": False,
        "already": False,
        "message": "The light is now off.",
        "esp32_response": response.text
    }


# =========================================================
# FAN ON
# =========================================================

@app.post("/device/fan/on")
def fan_on():

    get_esp32_status()

    if devices["fan"]:

        return {
            "success": True,
            "device": "fan",
            "state": True,
            "already": True,
            "message": "The fan is already running."
        }


    response = send_esp32_command(
        "/fan/on"
    )

    devices["fan"] = True

    return {
        "success": True,
        "device": "fan",
        "state": True,
        "already": False,
        "message": "The fan is now running.",
        "esp32_response": response.text
    }


# =========================================================
# FAN OFF
# =========================================================

@app.post("/device/fan/off")
def fan_off():

    get_esp32_status()

    if not devices["fan"]:

        return {
            "success": True,
            "device": "fan",
            "state": False,
            "already": True,
            "message": "The fan is already off."
        }


    response = send_esp32_command(
        "/fan/off"
    )

    devices["fan"] = False

    return {
        "success": True,
        "device": "fan",
        "state": False,
        "already": False,
        "message": "The fan is now off.",
        "esp32_response": response.text
    }


# =========================================================
# ALL DEVICES ON
# =========================================================

@app.post("/devices/all/on")
def all_on():

    send_esp32_command("/light/on")
    send_esp32_command("/fan/on")

    devices["light"] = True
    devices["fan"] = True

    return {
        "success": True,
        "light": True,
        "fan": True,
        "message": "All devices are now on."
    }


# =========================================================
# ALL DEVICES OFF
# =========================================================

@app.post("/devices/all/off")
def all_off():

    send_esp32_command("/light/off")
    send_esp32_command("/fan/off")

    devices["light"] = False
    devices["fan"] = False

    return {
        "success": True,
        "light": False,
        "fan": False,
        "message": "Everything is now off."
    }


# =========================================================
# HOME STATUS
# =========================================================

def home_status_response():

    esp32_online = get_esp32_status()

    if devices["light"] and devices["fan"]:

        message = (
            "Your home is online. "
            "The light is on and the fan is running."
        )

    elif devices["light"] and not devices["fan"]:

        message = (
            "Your home is online. "
            "The light is on and the fan is off."
        )

    elif not devices["light"] and devices["fan"]:

        message = (
            "Your home is online. "
            "The light is off and the fan is running."
        )

    else:

        message = (
            "Your home is online. "
            "The light and fan are both off."
        )


    return {
        "success": True,
        "message": message,
        "esp32_online": esp32_online,
        "light": devices["light"],
        "fan": devices["fan"]
    }


# =========================================================
# BASIC COMMAND DETECTION
# =========================================================

def detect_command(message: str):

    text = message.lower().strip()


    # -----------------------------------------
    # HOME STATUS
    # -----------------------------------------

    status_words = [
        "home status",
        "status of my home",
        "status",
        "home condition",
        "home state",
        "what is happening at home",
        "what is going on at home",
        "is my home",
        "how is my home",
        "are my devices",
        "device status",
        "devices status"
    ]

    for word in status_words:

        if word in text:
            return "status"


    # -----------------------------------------
    # EVERYTHING OFF
    # -----------------------------------------

    everything_words = [
        "everything off",
        "turn everything off",
        "switch everything off",
        "all devices off",
        "turn all devices off",
        "switch all devices off"
    ]

    for word in everything_words:

        if word in text:
            return "all_off"


    # -----------------------------------------
    # LIGHT
    # -----------------------------------------

    light_words = [
        "light",
        "lights",
        "lamp"
    ]

    on_words = [
        "turn on",
        "switch on",
        "enable",
        "start",
        "on"
    ]

    off_words = [
        "turn off",
        "switch off",
        "disable",
        "stop",
        "off"
    ]

    has_light = any(
        word in text
        for word in light_words
    )

    has_on = any(
        word in text
        for word in on_words
    )

    has_off = any(
        word in text
        for word in off_words
    )


    if has_light and has_on:
        return "light_on"


    if has_light and has_off:
        return "light_off"


    # -----------------------------------------
    # FAN
    # -----------------------------------------

    fan_words = [
        "fan",
        "fans"
    ]

    has_fan = any(
        word in text
        for word in fan_words
    )


    if has_fan and has_on:
        return "fan_on"


    if has_fan and has_off:
        return "fan_off"


    return None


# =========================================================
# TIME PARSER
# =========================================================

def parse_duration(text: str):

    text = text.lower()

    # Examples:
    # 15 seconds
    # 30 second
    # 2 minutes
    # 1 minute
    # 1 hour

    patterns = [

        (
            r"(\d+(?:\.\d+)?)\s*seconds?",
            1
        ),

        (
            r"(\d+(?:\.\d+)?)\s*secs?",
            1
        ),

        (
            r"(\d+(?:\.\d+)?)\s*minutes?",
            60
        ),

        (
            r"(\d+(?:\.\d+)?)\s*mins?",
            60
        ),

        (
            r"(\d+(?:\.\d+)?)\s*hours?",
            3600
        ),

        (
            r"(\d+(?:\.\d+)?)\s*hrs?",
            3600
        )
    ]


    for pattern, multiplier in patterns:

        match = re.search(
            pattern,
            text
        )

        if match:

            value = float(match.group(1))

            seconds = value * multiplier

            return int(seconds)


    return None


# =========================================================
# DELAYED DEVICE ACTION
# =========================================================

def delayed_device_action(
    device: str,
    action: str
):

    try:

        if device == "fan":

            if action == "on":

                response = send_esp32_command(
                    "/fan/on"
                )

                devices["fan"] = True

                print(
                    "TIMER: Fan turned ON"
                )

            elif action == "off":

                response = send_esp32_command(
                    "/fan/off"
                )

                devices["fan"] = False

                print(
                    "TIMER: Fan turned OFF"
                )


        elif device == "light":

            if action == "on":

                response = send_esp32_command(
                    "/light/on"
                )

                devices["light"] = True

                print(
                    "TIMER: Light turned ON"
                )

            elif action == "off":

                response = send_esp32_command(
                    "/light/off"
                )

                devices["light"] = False

                print(
                    "TIMER: Light turned OFF"
                )


    except Exception as e:

        print(
            "TIMER ERROR:",
            repr(e)
        )


# =========================================================
# SCHEDULE TIMER
# =========================================================

def schedule_device_action(
    device: str,
    action: str,
    delay_seconds: int
):

    timer = threading.Timer(
        delay_seconds,
        delayed_device_action,
        args=(device, action)
    )

    timer.daemon = True

    timer.start()

    return timer


# =========================================================
# DETECT TIMED COMMAND
# =========================================================

def detect_timed_command(message: str):

    text = message.lower().strip()

    duration = parse_duration(text)

    if duration is None:
        return None


    # -----------------------------------------
    # DEVICE
    # -----------------------------------------

    if "fan" in text:

        device = "fan"

    elif (
        "light" in text
        or "lights" in text
        or "lamp" in text
    ):

        device = "light"

    else:

        return None


    # -----------------------------------------
    # ACTION
    # -----------------------------------------

    if (
        "turn on" in text
        or "switch on" in text
        or "start" in text
        or "enable" in text
    ):

        action = "on"

    elif (
        "turn off" in text
        or "switch off" in text
        or "stop" in text
        or "disable" in text
    ):

        action = "off"

    else:

        return None


    # -----------------------------------------
    # "FOR" VS "AFTER"
    # -----------------------------------------

    if re.search(
        r"\bfor\s+\d",
        text
    ):

        timing = "for"

    elif re.search(
        r"\bafter\s+\d",
        text
    ):

        timing = "after"

    else:

        return None


    return {
        "device": device,
        "action": action,
        "seconds": duration,
        "timing": timing
    }


# =========================================================
# AI
# =========================================================

@app.post("/ai")
def ask_ai(request: AIRequest):

    message = request.message.strip()

    if not message:

        return {
            "success": False,
            "response": (
                "Please tell me what you "
                "would like me to do."
            )
        }


    try:

        # =================================================
        # FIRST: TIMED COMMAND
        # =================================================

        timed = detect_timed_command(message)


        if timed:

            device = timed["device"]
            action = timed["action"]
            seconds = timed["seconds"]
            timing = timed["timing"]


            device_name = (
                "Fan"
                if device == "fan"
                else "Light"
            )


            # =================================================
            # "FOR" COMMAND
            #
            # Example:
            # Turn on the fan for 15 seconds
            #
            # ON NOW
            # OFF AFTER 15 SECONDS
            # =================================================

            if timing == "for":

                if action == "on":

                    # Check real status
                    get_esp32_status()


                    if (
                        device == "fan"
                        and devices["fan"]
                    ):

                        reply = (
                            f"The fan is already running. "
                            f"I'll turn it off in "
                            f"{seconds} seconds."
                        )

                    elif (
                        device == "light"
                        and devices["light"]
                    ):

                        reply = (
                            f"The light is already on. "
                            f"I'll turn it off in "
                            f"{seconds} seconds."
                        )

                    else:

                        if device == "fan":

                            send_esp32_command(
                                "/fan/on"
                            )

                            devices["fan"] = True

                        else:

                            send_esp32_command(
                                "/light/on"
                            )

                            devices["light"] = True


                        reply = (
                            f"{device_name} turned on. "
                            f"I'll turn it off in "
                            f"{seconds} seconds."
                        )


                    # Schedule OFF
                    schedule_device_action(
                        device,
                        "off",
                        seconds
                    )


                    return {
                        "success": True,
                        "type": "timed_device",
                        "device": device,
                        "action": "on",
                        "duration": seconds,
                        "timing": "for",
                        "response": reply
                    }


                # -----------------------------------------
                # TURN OFF FOR X SECONDS
                # -----------------------------------------

                if action == "off":

                    get_esp32_status()


                    if device == "fan":

                        if not devices["fan"]:

                            return {
                                "success": True,
                                "type": "device",
                                "response":
                                    "The fan is already off."
                            }


                        send_esp32_command(
                            "/fan/off"
                        )

                        devices["fan"] = False


                    else:

                        if not devices["light"]:

                            return {
                                "success": True,
                                "type": "device",
                                "response":
                                    "The light is already off."
                            }


                        send_esp32_command(
                            "/light/off"
                        )

                        devices["light"] = False


                    # Turn back ON after duration
                    schedule_device_action(
                        device,
                        "on",
                        seconds
                    )


                    reply = (
                        f"{device_name} turned off. "
                        f"I'll turn it back on in "
                        f"{seconds} seconds."
                    )


                    return {
                        "success": True,
                        "type": "timed_device",
                        "device": device,
                        "action": "off",
                        "duration": seconds,
                        "timing": "for",
                        "response": reply
                    }


            # =================================================
            # "AFTER" COMMAND
            #
            # Example:
            # Turn on the fan after 15 seconds
            #
            # WAIT 15 SECONDS
            # THEN ON
            # =================================================

            if timing == "after":

                schedule_device_action(
                    device,
                    action,
                    seconds
                )


                action_text = (
                    "on"
                    if action == "on"
                    else "off"
                )


                reply = (
                    f"Okay. I'll turn the "
                    f"{device_name.lower()} "
                    f"{action_text} after "
                    f"{seconds} seconds."
                )


                return {
                    "success": True,
                    "type": "scheduled_device",
                    "device": device,
                    "action": action,
                    "delay": seconds,
                    "timing": "after",
                    "response": reply
                }


        # =================================================
        # NORMAL COMMAND
        # =================================================

        command = detect_command(message)


        # =================================================
        # HOME STATUS
        # =================================================

        if command == "status":

            result = home_status_response()

            return {
                "success": True,
                "type": "status",
                "response": result["message"],
                "light": result["light"],
                "fan": result["fan"],
                "esp32_online": result["esp32_online"]
            }


        # =================================================
        # LIGHT ON
        # =================================================

        if command == "light_on":

            result = light_on()


            if result.get("already"):

                reply = (
                    "The light is already on."
                )

            else:

                reply = (
                    "Done. The light is now on."
                )


            return {
                "success": True,
                "type": "device",
                "device": "light",
                "state": True,
                "response": reply
            }


        # =================================================
        # LIGHT OFF
        # =================================================

        if command == "light_off":

            result = light_off()


            if result.get("already"):

                reply = (
                    "The light is already off."
                )

            else:

                reply = (
                    "Done. The light is now off."
                )


            return {
                "success": True,
                "type": "device",
                "device": "light",
                "state": False,
                "response": reply
            }


        # =================================================
        # FAN ON
        # =================================================

        if command == "fan_on":

            result = fan_on()


            if result.get("already"):

                reply = (
                    "The fan is already running."
                )

            else:

                reply = (
                    "Done. The fan is now running."
                )


            return {
                "success": True,
                "type": "device",
                "device": "fan",
                "state": True,
                "response": reply
            }


        # =================================================
        # FAN OFF
        # =================================================

        if command == "fan_off":

            result = fan_off()


            if result.get("already"):

                reply = (
                    "The fan is already off."
                )

            else:

                reply = (
                    "Done. The fan is now off."
                )


            return {
                "success": True,
                "type": "device",
                "device": "fan",
                "state": False,
                "response": reply
            }


        # =================================================
        # EVERYTHING OFF
        # =================================================

        if command == "all_off":

            get_esp32_status()


            if (
                not devices["light"]
                and not devices["fan"]
            ):

                return {
                    "success": True,
                    "type": "device",
                    "response": (
                        "Everything is already off."
                    ),
                    "light": False,
                    "fan": False
                }


            all_off()


            return {
                "success": True,
                "type": "device",
                "response": (
                    "Done. The light and fan "
                    "are both turned off."
                ),
                "light": False,
                "fan": False
            }


        # =================================================
        # NORMAL GEMINI CONVERSATION
        # =================================================

        prompt = f"""
You are SmartHome AI, a friendly home assistant.

The user said:
"{message}"

You control:
- Living room light
- Living room fan

Current status:
Light: {"ON" if devices["light"] else "OFF"}
Fan: {"RUNNING" if devices["fan"] else "OFF"}

This message is NOT a direct SmartHome device command.

Respond naturally and briefly.

If the user asks about their home status,
describe the current light and fan status.

If the user asks something unrelated to
home automation, answer normally if it is
a simple conversation question.

Do not claim that you changed any device.

Keep the answer suitable for being spoken aloud.

Do not use markdown.
"""


        response = gemini_client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )


        ai_reply = (
            response.text.strip()
            if response.text
            else "I'm here to help with your SmartHome."
        )


        return {
            "success": True,
            "type": "conversation",
            "response": ai_reply
        }


    except HTTPException:

        raise


    except Exception as e:

        print(
            "AI ERROR:",
            repr(e)
        )

        return {
            "success": False,
            "type": "error",
            "response": (
                "I couldn't complete that request. "
                "Please try again."
            )
        }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    esp32_online = get_esp32_status()

    return {
        "success": True,
        "backend": "online",
        "esp32": (
            "online"
            if esp32_online
            else "offline"
        ),
        "esp32_ip": ESP32_IP,
        "light": devices["light"],
        "fan": devices["fan"],
        "gemini": "configured"
    }