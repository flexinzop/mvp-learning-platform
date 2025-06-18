# api/hello.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def hello():
    return {"message":"✅ Vercel + FastAPI OK!"}