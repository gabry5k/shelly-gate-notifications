# Gate Notifications — BLU Door/Window

Shelly Script for sending a Shelly App push notification when a gate is confirmed open or closed using a **Shelly BLU Door/Window** sensor.

The BLU sensor communicates with the Shelly device through Bluetooth / BTHome, so no wired sensor connection or Plus Add-on is required for the gate sensor.

## Features

- Configurable confirmation delay.
- Optional open notification.
- Optional close notification.
- Separate Scenes for opening and closing.
- Ignores short false state changes caused by vibration.
- BTHome sensor component ID is configurable at the top of the script.
- Runs directly on the Shelly.

## Hardware

Tested with:

- Shelly 1 Gen4
- Shelly BLU Door/Window
- Bluetooth / BTHome
- Firmware 2.0.0

The BLU Door/Window state is exposed through a BTHome sensor component.

In the device used for testing, the component was:

```
bthomesensor:202
```

The ID can be different on another installation.

## Finding the BTHome sensor ID

The ID used by the script is configured here:

```javascript
const SENSOR_ID = 202;
```

If your Shelly exposes the Door/Window state as, for example:

```
bthomesensor:203
```

change it to:

```javascript
const SENSOR_ID = 203;
```

The repository includes a tested example using `202`.

## Shelly Cloud Scenes

Create two Scenes in the Shelly App.

### Open Scene

Configure a push notification such as:

> 🚪 The gate is open!

Copy the Scene ID and place it in:

```javascript
const SCENE_OPEN_ID = O_TEU_SCENE_OPEN_ID;
```

### Close Scene

Configure a push notification such as:

> 🔒 The gate is closed!

Copy the Scene ID and place it in:

```javascript
const SCENE_CLOSE_ID = O_TEU_SCENE_CLOSE_ID;
```

## Configuration

The main settings are at the beginning of the script.

### Confirmation delay

```javascript
const OPEN_DELAY = 5;
```

The value is in seconds and applies to both opening and closing.

For example:

```javascript
const OPEN_DELAY = 10;
```

requires the sensor to remain in the new state for 10 seconds.

### Notifications

Only opening:

```javascript
const NOTIFY_OPEN  = true;
const NOTIFY_CLOSE = false;
```

Only closing:

```javascript
const NOTIFY_OPEN  = false;
const NOTIFY_CLOSE = true;
```

Opening and closing:

```javascript
const NOTIFY_OPEN  = true;
const NOTIFY_CLOSE = true;
```

Disable both:

```javascript
const NOTIFY_OPEN  = false;
const NOTIFY_CLOSE = false;
```

## Shelly Cloud configuration

Set these values:

```javascript
const CLOUD_SERVER = "https://O_TEU_SERVER.shelly.cloud";
const AUTH_KEY = "O_TEU_AUTH_KEY";
const SCENE_OPEN_ID = O_TEU_SCENE_OPEN_ID;
const SCENE_CLOSE_ID = O_TEU_SCENE_CLOSE_ID;
```

Do not publish your personal Authorization Cloud Key.

## How the debounce works

When the BLU sensor reports OPEN:

```
OPEN
 ↓
start timer
 ↓
5 seconds
 ↓
still OPEN?
 ├─ YES → run OPEN Scene
 └─ NO  → cancel notification
```

When the BLU sensor reports CLOSED, the same process is used in reverse.

This means a typical vibration during closing:

```
CLOSED → OPEN → CLOSED
```

will not trigger an opening notification if the temporary OPEN state is shorter than the configured delay.

## Installation

1. Make sure the BLU Door/Window sensor is paired with the Shelly device and visible as a BTHome sensor.
2. Open the Shelly Web UI.
3. Go to **Scripts**.
4. Create a new script.
5. Copy `gate-notifications-blu.js` into the script editor.
6. Set the BTHome `SENSOR_ID`.
7. Set the Cloud server, Authorization Cloud Key and Scene IDs.
8. Adjust `OPEN_DELAY`, `NOTIFY_OPEN` and `NOTIFY_CLOSE`.
9. Save and start the script.
10. Test both states.

## Notes

The script listens for BTHome status changes and does not continuously poll the sensor. The sensor state is checked again when the timer expires before a notification is sent.

The BTHome component ID is not guaranteed to be the same on every installation, so always check the component exposed by your own Shelly before changing `SENSOR_ID`.
