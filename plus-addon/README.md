# Gate Notifications — Plus Add-on

Shelly Script for sending a Shelly App push notification when a gate is confirmed open or closed.

This version is designed for a **wired gate sensor connected through the Shelly Plus Add-on**.

## Features

- Configurable confirmation delay.
- Optional open notification.
- Optional close notification.
- Separate Scenes for opening and closing.
- Ignores short false OPEN states caused by gate vibration.
- Runs directly on the Shelly.

## Hardware

Tested with:

- Shelly 1 Gen4
- Shelly Plus Add-on
- Wired gate sensor
- Firmware 2.0.0

The sensor state used by this script is:

```
input:100
```

If your hardware exposes the sensor on another input, change the corresponding `input:100` references in the script.

## Shelly Cloud Scenes

Create two Scenes in the Shelly App:

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

When the gate reports OPEN:

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

When the gate reports CLOSED, the same process is used in reverse.

This means a typical vibration during closing:

```
CLOSED → OPEN → CLOSED
```

will not trigger an opening notification if the temporary OPEN state is shorter than the configured delay.

## Installation

1. Open the Shelly Web UI.
2. Go to **Scripts**.
3. Create a new script.
4. Copy `gate-notifications-addon.js` into the script editor.
5. Set the Cloud server, Authorization Cloud Key and Scene IDs.
6. Adjust `OPEN_DELAY`, `NOTIFY_OPEN` and `NOTIFY_CLOSE`.
7. Save and start the script.
8. Test both states.

## Notes

The script is event-driven and does not continuously poll the sensor. The sensor state is confirmed again when the timer expires before a notification is sent.
