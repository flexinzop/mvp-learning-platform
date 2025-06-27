from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import pandas as pd
import os

app = FastAPI()

# Add CORS middleware for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint to serve the main page
@app.get("/")
async def read_root():
    try:
        return FileResponse("../public/index.html")
    except:
        return {"message": "Learning Platform API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Test endpoint to verify API is working
@app.get("/api/test")
async def test_api():
    return {
        "message": "API is working!",
        "chart_library": "Chart.js",
        "courses_count": len(courses),
        "flashcards_count": len(flashcards)
    }

# === Mock data (copiado do seu api-routes.js) ===
courses = [
    {
        "id": 1,
        "title": "Agente Administrativo da Polícia Civil do Distrito Federal - PCDF",
        "description": "Com todas as matérias de conhecimentos básicos e específicos.",
        "thumbnail": "/1.png",
        "progress": 75,
        "category": "offensive"
    },
    {
        "id": 2,
        "title": "Delegado da Polícia Federal",
        "description": "Para aqueles que buscam o cargo de Delegado Federal, com formação em direito, com preparação completa de todas as matérias.",
        "thumbnail": "/2.png",
        "progress": 60,
        "category": "defensive"
    },
    {
        "id": 3,
        "title": "SEFAZ/GO – Auditor",
        "description": "Pacote atualizado com a publicação do edital.",
        "thumbnail": "/3.png",
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

# === Chart Data ===
monthly_access_data = {
    "months": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    "access": [45, 52, 38, 67, 73, 89, 95, 82, 78, 91, 104, 87]
}

course_completion_data = [
    {"course": "PCDF", "progress": 75, "color": "#FF6B6B"},
    {"course": "Delegado PF", "progress": 60, "color": "#4ECDC4"},
    {"course": "SEFAZ/GO", "progress": 85, "color": "#45B7D1"}
]

# === Endpoints HTMX ===

@app.get("/api/courses", response_class=HTMLResponse)
async def get_courses():
    html = ""
    for c in courses:
        html += f'''
        <div class="course-card" data-category="{c["category"]}" onclick="openCourseModal({c["id"]}, '{c["title"]}')">
          <img src="{c["thumbnail"]}" alt="{c["title"]}" class="course-thumbnail">
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

# === Chart Data Endpoints (with Chart.js) ===

@app.get("/api/charts/pie-chart")
async def get_pie_chart():
    """Generate course completion pie chart data for Chart.js"""
    return {
        "type": "doughnut",
        "data": {
            "labels": [item["course"] for item in course_completion_data],
            "datasets": [{
                "data": [item["progress"] for item in course_completion_data],
                "backgroundColor": [item["color"] for item in course_completion_data],
                "borderWidth": 3,
                "borderColor": "#fff",
                "hoverBorderWidth": 4,
                "hoverBorderColor": "#fff"
            }]
        },
        "options": {
            "responsive": True,
            "maintainAspectRatio": False,
            "plugins": {
                "title": {
                    "display": True,
                    "text": "Progresso dos Cursos",
                    "font": {
                        "size": 18,
                        "weight": "bold"
                    },
                    "padding": 20
                },
                "legend": {
                    "position": "right",
                    "labels": {
                        "font": {
                            "size": 12
                        },
                        "padding": 15,
                        "usePointStyle": True
                    }
                },
                "tooltip": {
                    "enabled": True,
                    "backgroundColor": "rgba(0, 0, 0, 0.8)",
                    "titleColor": "#fff",
                    "bodyColor": "#fff",
                    "borderColor": "#3457F3",
                    "borderWidth": 1,
                    "cornerRadius": 8,
                    "displayColors": True,
                    "callbacks": {
                        "label": "function(context) { return context.label + ': ' + context.parsed + '%'; }"
                    }
                }
            },
            "animation": {
                "duration": 1000,
                "easing": "easeInOutQuart"
            },
            "hover": {
                "animationDuration": 200
            }
        }
    }

@app.get("/api/charts/bar-chart")
async def get_bar_chart():
    """Generate monthly access bar chart data for Chart.js"""
    return {
        "type": "bar",
        "data": {
            "labels": monthly_access_data["months"],
            "datasets": [{
                "label": "Acessos",
                "data": monthly_access_data["access"],
                "backgroundColor": "#3457F3",
                "borderColor": "#3457F3",
                "borderWidth": 1,
                "borderRadius": 8,
                "hoverBackgroundColor": "#1e3a8a",
                "hoverBorderColor": "#1e3a8a",
                "hoverBorderWidth": 2
            }]
        },
        "options": {
            "responsive": True,
            "maintainAspectRatio": False,
            "plugins": {
                "title": {
                    "display": True,
                    "text": "Acesso Mensal aos Flashcards",
                    "font": {
                        "size": 18,
                        "weight": "bold"
                    },
                    "padding": 20
                },
                "legend": {
                    "display": False
                },
                "tooltip": {
                    "enabled": True,
                    "backgroundColor": "rgba(0, 0, 0, 0.8)",
                    "titleColor": "#fff",
                    "bodyColor": "#fff",
                    "borderColor": "#3457F3",
                    "borderWidth": 1,
                    "cornerRadius": 8,
                    "displayColors": False
                }
            },
            "scales": {
                "y": {
                    "beginAtZero": True,
                    "title": {
                        "display": True,
                        "text": "Acessos",
                        "font": {
                            "size": 14,
                            "weight": "bold"
                        }
                    },
                    "grid": {
                        "color": "rgba(0, 0, 0, 0.1)",
                        "drawBorder": False
                    },
                    "ticks": {
                        "font": {
                            "size": 12
                        }
                    }
                },
                "x": {
                    "title": {
                        "display": True,
                        "text": "Mês",
                        "font": {
                            "size": 14,
                            "weight": "bold"
                        }
                    },
                    "grid": {
                        "display": False
                    },
                    "ticks": {
                        "font": {
                            "size": 12
                        }
                    }
                }
            },
            "animation": {
                "duration": 1000,
                "easing": "easeInOutQuart"
            },
            "hover": {
                "animationDuration": 200
            }
        }
    }

@app.get("/api/charts/summary-stats")
async def get_summary_stats():
    """Get summary statistics"""
    return {
        "cards_reviewed": 342,
        "consecutive_days": 7,
        "accuracy_rate": 73,
        "pending_cards": 15
    }

# === Servindo Front-end estático ===
# Monta tudo que estiver em /public na raiz, e usa index.html por padrão
# app.mount("/", StaticFiles(directory="public", html=True), name="static")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# Export the app for Vercel
app.debug = True
