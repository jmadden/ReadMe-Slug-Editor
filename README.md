# ReadMe Slug Editor

A monorepo with a React client and Node.js server for browsing and editing ReadMe.io document slugs via the ReadMe Dashboard API.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

- **Node.js** v22 or higher
- **npm** v7 or higher (bundled with Node.js v22)
- **Git** (to clone the repo)
- A ReadMe.io account and **Dashboard API Key**

---

## Installation

```bash
# Clone the repo
git clone https://github.com/jmadden/ReadMe-Slug-Editor.git
cd ReadMe-Slug-Editor

# Install dependencies for root, client & server
npm install
```

That single npm install will install your root deps (including concurrently) and then descend into both client/ and server/ workspaces to install each one’s dependencies.

## Configuration

1. Server

The server exposes an API that proxies your ReadMe Dashboard calls. It expects your ReadMe API key in either:
• An x-api-key header on incoming requests
• Or (if you prefer env-vars) you can add a small change in server/server.js to read from process.env.API_KEY

To run with an env-file, create server/.env:

```bash
# server/.env
# (if you wire this into your code)
PORT=5001
API_BASE_URL=https://dash.readme.com/api/v1
API_KEY=your_readme_dashboard_api_key_here
```

2. Client

The React client needs to know where your server lives. Create a client/.env:

```ini
# client/.env
REACT_APP_API_URL=http://localhost:5001
```

## Available Scripts

All scripts assume you’re in the root folder.

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run start:server` | `cd server && npm start` (runs your Node.js server)      |
| `npm run start:client` | `cd client && npm start` (runs your React app)           |
| `npm start`            | Runs both server & client in parallel via `concurrently` |
| `npm run build:client` | `cd client && npm run build` (production bundle)         |
| `npm run lint`         | (optional) lint both client & server codebases           |

## Project Structure

```
ReadMe-Slug-Editor/
├── client/              # React front-end
│   ├── public/
│   ├── src/
│   └── package.json     # "start": "react-scripts start", etc.
├── server/              # Node.js back-end
│   ├── server.js        # Express routes for ReadMe API proxy
│   └── package.json     # "start": "node server.js", etc.
├── package.json         # root: defines workspaces & orchestrates scripts
├── package-lock.json
└── .gitignore
```

## Contributing

1. Fork the repo
2. Create a feature branch (git checkout -b feat/whatever)
3. Install & run (npm install && npm start)
4. Make your changes & test
5. Submit a PR against main

Please follow the existing coding style and add tests where appropriate.
