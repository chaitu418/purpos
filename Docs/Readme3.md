| Command | Runs | Purpose | Port |
|---|---|---|---|
| `docker compose up -d db` | PostgreSQL in Docker | Stores purpose data permanently | `5434` |
| `uvicorn backend.main:app --reload --port 8001` | FastAPI Python backend | Receives API requests and reads/writes PostgreSQL | `8001` |
| `npm run dev` | React/Vite frontend | Displays the Purpos website in the browser | `5173` |

Browser
  ↓
React frontend — npm run dev — 5173
  ↓
FastAPI backend — uvicorn — 8001
  ↓
PostgreSQL Docker container — docker compose — 5434



