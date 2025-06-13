from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# === Mock data (copiado do seu api-routes.js) ===
courses = [
    {
        "id": 1,
        "title": "Web Application Security",
        "description": "Learn about common web vulnerabilities, SQL injection, XSS, and secure coding practices.",
        "thumbnail": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=250&h=100&fit=crop",
        "progress": 75,
        "category": "offensive"
    },
    {
        "id": 2,
        "title": "Network Defense & Monitoring",
        "description": "Master network security fundamentals, firewalls, IDS/IPS, and threat detection techniques.",
        "thumbnail": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=250&h=100&fit=crop",
        "progress": 60,
        "category": "defensive"
    },
    {
        "id": 3,
        "title": "Network Fundamentals",
        "description": "Understand networking protocols, OSI model, TCP/IP, routing, and network troubleshooting.",
        "thumbnail": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=250&h=100&fit=crop",
        "progress": 85,
        "category": "general"
    }
]

flashcards = {
    1: [
        {
            "id": 1,
            "question": "What is SQL Injection?",
            "answer": "SQL injection is a code injection technique...rting malicious SQL statements into entry fields for execution."
        },
        {
            "id": 2,
            "question": "What is Cross-Site Scripting (XSS)?",
            "answer": "XSS is a security vulnerability that allows...otentially stealing data or performing actions on their behalf."
        }
    ],
    2: [
        {
            "id": 1,
            "question": "What is a Firewall?",
            "answer": "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on security rules."
        },
        {
            "id": 2,
            "question": "What is IDS/IPS?",
            "answer": "IDS (Intrusion Detection System) and IPS (Intrusion Prevention System) monitor network or system activities for malicious actions or policy violations."
        }
    ],
    3: [
        {
            "id": 1,
            "question": "What is the OSI Model?",
            "answer": "The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes network communication in seven layers, from physical to application."
        },
        {
            "id": 2,
            "question": "What is TCP/IP?",
            "answer": "TCP/IP is a suite of communication protocols used to interconnect network devices on the internet and private networks."
        }
    ]
}

progress_data = {"offensive": 75, "defensive": 60, "general": 85}

# === Endpoints HTMX ===

@app.get("/api/courses", response_class=HTMLResponse)
async def get_courses():
    html = ""
    for c in courses:
        html += f'''
        <div class="course-card" data-category="{c["category"]}" onclick="openCourseModal({c["id"]}, '{c["title"]}')">
          <img src="{c["thumbnail"]}" alt="{c["title"]}">
          <div class="course-info">
            <h3>{c["title"]}</h3>
            <p>{c["description"]}</p>
          </div>
          <div class="course-progress">
            <span class="progress-label">{c["progress"]}%</span>
            <div class="progress-bar-vertical">
              <div class="progress-fill" style="height: {c["progress"]}%;"></div>
            </div>
          </div>
        </div>'''
    return html


@app.get("/api/flashcards/{course_id}")
async def get_flashcards(course_id: int):
    data = flashcards.get(course_id)
    if not data:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"flashcards": data}

@app.get("/api/progress")
async def get_progress():
    return progress_data

# === Servindo Front-end estático ===
# Monta tudo que estiver em /public na raiz, e usa index.html por padrão
app.mount("/", StaticFiles(directory="public", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
