# Shelly Gate Notifications

Scripts for sending Shelly App push notifications when a gate changes between **open** and **closed**, with a configurable delay to prevent false notifications caused by vibration or sensor bounce.

Two sensor configurations are included:

- **Plus Add-on** — for a wired door/window or magnetic contact connected to a Shelly Plus Add-on.
- **BLU Door/Window** — for the Shelly BLU Door/Window sensor using Bluetooth / BTHome.

Both versions use the same confirmation logic: when a state changes, the script waits for a configurable number of seconds and only sends the notification if the sensor is still in that state.

## Features

- Configurable confirmation delay.
- Optional notification when the gate opens.
- Optional notification when the gate closes.
- Separate Shelly Cloud Scenes for open and closed notifications.
- Ignores short false state changes caused by gate vibration.
- Runs directly on the Shelly device.
- No Home Assistant or third-party notification service required.

## Repository structure

```
shelly-gate-notifications/
│
├── README.md
│
├── plus-addon/
│   ├── gate-notifications-addon.js
│   └── README.md
│
└── blu-door-window/
    ├── gate-notifications-blu.js
    └── README.md
```

## Which version should I use?

### Plus Add-on

Use this version if your gate sensor is a wired contact connected to the Shelly Plus Add-on.

[Open the Plus Add-on documentation](./plus-addon/README.md)

### BLU Door/Window

Use this version if you are using a Shelly BLU Door/Window sensor.

[Open the BLU Door/Window documentation](./blu-door-window/README.md)

## How the confirmation works

For example, when opening:

```
CLOSED
   ↓
OPEN
   ↓
wait 5 seconds
   ↓
still OPEN?
   ├── YES → send notification
   └── NO  → cancel notification
```

This is particularly useful with gates where mechanical movement can temporarily make the sensor report:

```
CLOSED → OPEN → CLOSED
```

during the closing movement.

If the temporary OPEN state lasts less than the configured delay, no notification is sent.

## Requirements

- Compatible Shelly Gen2/Gen3/Gen4 device with scripting support.
- Shelly Cloud account.
- Shelly App.
- A Shelly Scene for the OPEN notification.
- A Shelly Scene for the CLOSED notification if close notifications are enabled.

The scripts were developed and tested on a **Shelly 1 Gen4 with firmware 2.0.0**.

## Security

The scripts require the Shelly Cloud server and Authorization Cloud Key to trigger the notification Scenes.

**Never publish your personal Authorization Cloud Key or Scene IDs in a public repository.**

The scripts therefore contain placeholders such as:

```javascript
const CLOUD_SERVER = "https://O_TEU_SERVER.shelly.cloud";
const AUTH_KEY = "O_TEU_AUTH_KEY";
const SCENE_OPEN_ID = O_TEU_SCENE_OPEN_ID;
const SCENE_CLOSE_ID = O_TEU_SCENE_CLOSE_ID;
```

Replace these values locally on your Shelly.

## License

This project is provided as-is for personal and educational use. Use the scripts at your own risk and adapt them to your hardware and installation.
