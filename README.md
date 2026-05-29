# Telehealth Platform

A production-style telehealth video consultation app built with **React** + **LiveKit** on the frontend and **Node.js** + **Express** + **LiveKit Server SDK** on the backend.

## Features

- **Token-based room join** – JWT access tokens for secure room entry  
- **Role-based access** – Host (camera/mic + screen share) or Viewer (watch-only)  
- **Video grid** – All participants in a responsive grid (no appending to `body`)  
- **Meeting controls** – Join, Leave, Mute/Unmute, Toggle camera, Screen share  
- **Remote participants** – Correct handling of remote video/audio in the grid  
- **In-call chat** – Text chat via LiveKit data channels (reliable, topic `"chat"`)  
- **RTMP streaming** – Start RTMP egress to external URLs (e.g. YouTube, CDN)  
- **Recording** – Start room composite recording  
- **Moderation** – Kick participant from the room  
- **Audit logging** – Join events and custom audit payloads logged to file  

## Project structure

```
telehealth_platform_stream_broadcast/
├── backend/
│   ├── config/
│   │   └── index.js          # Env and LiveKit config
│   ├── middleware/
│   │   ├── errorHandler.js  # Global error handler
│   │   └── logger.js        # Request logging
│   ├── routes/
│   │   ├── auth.js          # GET /getToken, GET /token
│   │   ├── streaming.js     # POST /stream/rtmp, /stream/record
│   │   ├── moderation.js    # POST /moderate/kick
│   │   └── audit.js         # POST /audit
│   ├── services/
│   │   └── livekit.js       # RoomServiceClient
│   ├── utils/
│   │   └── audit.js         # Append to audit log file
│   └── server.js            # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── JoinForm.jsx
│   │   │   ├── VideoGrid.jsx
│   │   │   ├── ParticipantTile.jsx
│   │   │   ├── MeetingControls.jsx
│   │   │   ├── HostControls.jsx   # RTMP, record, kick
│   │   │   └── ChatPanel.jsx
│   │   ├── hooks/
│   │   │   └── useLiveKitRoom.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js       # Dev proxy to backend
│   └── package.json
└── README.md
```

## Setup

### Windows quick start (recommended)

If you keep seeing `could not establish signal connection` after closing/reopening the project, use this one-command startup:

```powershell
cd "telehealth_platform_stream_broadcast (Unzipped Files)"
powershell -ExecutionPolicy Bypass -File .\start-app.ps1
```

What it does:
- starts Docker Desktop if needed
- ensures the LiveKit container is running on `ws://127.0.0.1:7880`
- starts backend (`npm start`) in a new terminal
- starts frontend (`npm run dev`) in a new terminal

For persistence across restarts:
- Docker Desktop -> Settings -> General -> enable **Start Docker Desktop when you log in**
- the LiveKit container is configured with restart policy `unless-stopped`

### Backend

1. Install dependencies:
   ```bash
   cd backend && npm install
   ```
2. Set environment variables (or use defaults):
   - `LIVEKIT_API_KEY` (default: `demo_key`)
   - `LIVEKIT_API_SECRET` or `LIVEKIT_SECRET` (default: `demo_secret`) — must match your LiveKit server
   - `LIVEKIT_URL` (default: `wss://demo.livekit.cloud`) — WebSocket URL clients use to connect
   - `PORT` (default: `3000`)
   - `AUDIT_LOG_PATH` (default: `audit.log`)
3. Start the server:
   ```bash
   npm start
   ```
   Or with auto-reload: `npm run dev`

### Frontend

1. Install dependencies:
   ```bash
   cd frontend && npm install
   ```
2. Start the dev server (proxies `/getToken`, `/token`, `/stream`, `/moderate`, `/audit`, `/health` to backend):
   ```bash
   npm run dev
   ```
3. Open the URL shown (e.g. `http://localhost:5173`).

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/getToken?room=&name=&role=` | Get LiveKit token and URL (room, participant name, optional role: host \| viewer) |
| GET | `/token?name=&room=&role=` | Legacy: same as /getToken |
| POST | `/stream/rtmp` | Body: `{ room, rtmpUrl }` – start RTMP egress |
| POST | `/stream/record` | Body: `{ room }` – start room recording |
| POST | `/moderate/kick` | Body: `{ room, identity }` – remove participant |
| POST | `/audit` | Body: any JSON – append to audit log |
| GET | `/health` | Health check |

## Notes

- **Chat**: Messages are sent with LiveKit `publishData` using topic `"chat"` and reliable delivery; the backend does not handle chat.
- **RTMP / Recording**: Require a LiveKit server with Egress configured (e.g. cloud or self-hosted with egress).
- **Production**: Use real `LIVEKIT_API_KEY`, `LIVEKIT_SECRET`, and `LIVEKIT_URL`; serve the frontend build and ensure API routes are proxied or exposed at the same origin.
