from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    provider: str
    messages: list

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        if request.provider == "ollama":
            reply = await call_ollama(request.messages)
        elif request.provider == "groq":
            reply = await call_groq(request.messages)
        else:
            return {"error": "unknown provider"}
        return {"reply": reply}
    except httpx.ConnectError:
        return {"error": f"Could not connect to {request.provider}. Is it running?"}
    except httpx.TimeoutException:
        return {"error": f"{request.provider} took too long to respond."}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}


async def call_ollama(messages):
    url = "http://localhost:11434/api/chat"
    payload = {"model": "qwen2.5:1.5b", "messages": messages, "stream": False}
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        data = response.json()
        return data["message"]["content"]


async def call_groq(messages):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {os.environ['GROQ_API_KEY']}"}
    payload = {"model": "openai/gpt-oss-20b", "messages": messages}
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        data = response.json()
        return data["choices"][0]["message"]["content"]