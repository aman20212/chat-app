# AI Chat App — FastAPI + React (Ollama / Groq)

A full-stack chat application with a switchable backend — talk to a local LLM via **Ollama** or a hosted one via **Groq's free API** — built as a hands-on project in a self-directed GenAI/Agentic AI engineering upskilling track.

## Stack

- **Backend:** FastAPI (Python), async (`httpx`), Pydantic request validation
- **Frontend:** React + Vite, styled with Tailwind CSS v4

## Features

- Toggle between a locally-running Ollama model and Groq's hosted API from the UI
- Async backend — handles concurrent requests without blocking on the LLM call
- Clean error handling — a downed model shows an error message in the UI instead of crashing
- Guards against firing a second request while one is already in flight
- Clear-chat button

## Running it locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GROQ_API_KEY="your-groq-api-key"   # get a free key at console.groq.com
uvicorn main:app --reload
```

Requires [Ollama](https://ollama.com) installed and running locally if you want to use the local provider (`ollama pull qwen2.5:1.5b` or any model of your choice).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Architecture

```
React (Vite frontend) → FastAPI backend → routes by "provider" field:
                                             ├── "ollama" → local Ollama API
                                             └── "groq"   → Groq's hosted API
```