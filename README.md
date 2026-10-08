# Research Journal

A web application for tracking medications in clinical development. Users can browse research data on a dashboard, search and filter the medication list, view each medication with its clinic on a map, and chat with other researchers in real time.

Live demo: https://arina-vas.github.io/researchJournal/
API: https://researchjournal.onrender.com

## Features

- **Authentication** — sign up and sign in with email and password. Short-lived access tokens (15 min) and rotating refresh tokens in an `httpOnly` cookie. Refresh tokens are stored as SHA-256 hashes, and up to 5 sessions per user are kept, one per device.
- **Dashboard** — charts for total tests per month, testing progress by phase, tested vs. non-tested participants, status by date and drug approval rate.
- **Medications table**
  - search by name (debounced, 3+ characters);
  - filters by clinic, successful/unsuccessful reaction and date range;
  - sorting by name, clinic, start/end date and reaction;
  - pagination with page size selection and "Show all".
- **Medication details** — description, tags and clinic location on Google Maps with a "Get direction" link.
- **Chat** — one-to-one dialogs over WebSocket: message history, live delivery and automatic reconnection with token refresh.
- **UI** — light and dark themes, responsive layout, keyboard-accessible table rows, custom 404 page.
- **Security** — rate limiting on login and registration, `helmet` headers, CORS restricted to the client origin, and request and response validation with shared Zod schemas.

## Project structure

npm workspaces monorepo:

```
researchJournal/
├── client/   # React SPA (Vite)
├── server/   # Express REST API + WebSocket server
└── shared/   # Zod schemas, types and constants shared by client and server
```

## Tech stack and dependencies

### Client (`client`)
| Package | Purpose |
|---|---|
| `react`, `react-dom` 19 | UI |
| `@tanstack/react-router` | File-based routing with code splitting |
| `@tanstack/react-query` | Server state and caching |
| `axios` | HTTP client with token refresh interceptor |
| `recharts` | Dashboard charts |
| `@vis.gl/react-google-maps` | Clinic map |
| `react-toastify` | Notifications |
| `zod` | Response validation (via `@research/shared`) |

Dev: `vite`, `typescript`, `eslint`, `@tanstack/router-plugin`, `@vitejs/plugin-react`, `vite-plugin-svgr`.

### Server (`server`)
| Package | Purpose |
|---|---|
| `express` 5 | REST API |
| `ws` | WebSocket chat |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | Access and refresh tokens |
| `bcrypt` | Password hashing |
| `cookie-parser`, `cors`, `helmet` | HTTP middleware |
| `express-rate-limit` | Brute-force protection for auth endpoints |
| `dotenv` | Environment variables |
| `zod` | Request validation (via `@research/shared`) |
| `tsx` | Runs TypeScript directly in development and production |

### Shared (`shared`)
`zod`: one contract for both sides, covering auth, medications, filters, chat events and ids.

## Getting started

### Prerequisites
- Node.js 22+
- npm 10+
- MongoDB: a local instance or a MongoDB Atlas cluster with the `medications` and `locations` collections populated. There is no seed script, so the medication data must already exist in the database.

### 1. Install dependencies
From the repository root:
```bash
npm install
```
This installs all three workspaces and links `@research/shared` into the client and server.

### 2. Configure environment variables

`server/.env`:
```env
PORT=3001
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_ACCESS_SECRET=<random string>
JWT_REFRESH_SECRET=<another random string>
```

`client/.env`:
```env
VITE_API_URL=http://localhost:3001/api/
VITE_WS_URL=ws://localhost:3001/ws
VITE_GOOGLE_MAPS_API_KEY=<Google Maps API key>
VITE_MAP_ID=<Google Maps map id>
```

A JWT secret can be generated with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Run in development
In two terminals from the repository root:
```bash
npm run dev --workspace server
```
```bash
npm run dev --workspace client
```
- API and WebSocket: http://localhost:3001 (`/api`, `/ws`)
- Client: http://localhost:5173

### 4. Build and lint the client
```bash
npm run build --workspace client
npm run lint --workspace client
```

### 5. Run the server in production
```bash
npm ci --workspace server --workspace shared
NODE_ENV=production npm start --workspace server
```
With `NODE_ENV=production` the refresh cookie is `Secure` and `SameSite=None`, so the client and API can run on different domains over HTTPS.

## Deployment

- **Client** — GitHub Pages via `.github/workflows/deploy.yml`, on push to `main` when `client/`, `shared/` or the lockfile changes. The build uses the `/researchJournal/` base path. Required repository secrets: `VITE_API_URL`, `VITE_WS_URL`, `MAP_ID`, `GOOGLE_MAPS_API_KEY`.
- **Server** — any Node host with long-running processes and WebSocket support, for example Render. Build: `npm ci --workspace server --workspace shared`. Start: `npm start --workspace server`. Set `NODE_ENV=production` and `CLIENT_URL` to the client origin, for example `https://arina-vas.github.io`.

## API overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Sign in |
| POST | `/api/auth/refresh` | cookie | Rotate the refresh token, get a new access token |
| POST | `/api/auth/logout` | cookie | End the current session |
| GET | `/api/auth/me` | Bearer | Current user |
| DELETE | `/api/auth/delete` | Bearer | Delete the account and its chat history |
| GET | `/api/medications` | Bearer | List with filters, sorting and pagination |
| GET | `/api/medications/:id` | Bearer | Medication details |
| GET | `/api/locations`, `/api/locations/:id` | Bearer | Clinics |
| GET | `/api/users`, `/api/users/:userId` | Bearer | Users for the chat |
| GET | `/api/messages/:room` | Bearer | Room history (reserved for pagination) |
| WS | `/ws?token=<access token>` | token | Chat events: `JOIN_ROOM`, `LEAVE_ROOM`, `SEND_MESSAGE` |
