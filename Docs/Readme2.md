# Purpos MVP — Progress Document

## Goal

Build a Bengaluru-first web platform where founders, builders, professionals, and service providers can discover people with a meaningful reason to connect.

## Current user flow

```text
Landing page
  → Create your purpose
  → Fill profile and intent form
  → Publish purpose
  → See confirmation
  → Discover Bengaluru connection cards
  → Request a connection

  Run locally
Terminal 1 — frontend
npm run dev

Open http://localhost:5173.
Terminal 2 — backend
source .venv/Scripts/activate
uvicorn backend.main:app --reload --port 8001

Open API documentation at http://localhost:8001/docs.

