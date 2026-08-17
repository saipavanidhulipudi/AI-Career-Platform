from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import json

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# MODELS
# =========================================================

class CareerRequest(BaseModel):
    education: str
    skills: List[str]
    interests: List[str]
    goal: str


class SkillGapRequest(BaseModel):
    career: str
    skills: List[str]


class LearningRoadmapRequest(BaseModel):
    career: str
    skills: List[str]


class InterviewRequest(BaseModel):
    career: str


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "AI Career Platform Backend is Running!"
    }


# =========================================================
# CAREER RECOMMENDATION
# =========================================================

@app.post("/api/career-recommendation")
def career_recommendation(data: CareerRequest):

    skills = [skill.lower() for skill in data.skills]
    interests = [interest.lower() for interest in data.interests]
    goal = data.goal.lower()

    recommendations = []

    if (
        "python" in skills
        or "machine learning" in skills
        or "ai" in skills
        or "artificial intelligence" in interests
    ):
        recommendations.append({
            "career": "AI Engineer",
            "reason": "Your Python, AI and Machine Learning interests match this career."
        })

    if (
        "sql" in skills
        or "data analysis" in interests
        or "analytics" in interests
    ):
        recommendations.append({
            "career": "Data Analyst",
            "reason": "Your interest in data and SQL matches this career."
        })

    if (
        "machine learning" in skills
        or "statistics" in skills
        or "data science" in interests
    ):
        recommendations.append({
            "career": "Data Scientist",
            "reason": "Your Machine Learning and Data Science interests match this career."
        })

    if (
        "html" in skills
        or "css" in skills
        or "javascript" in skills
        or "react" in skills
    ):
        recommendations.append({
            "career": "Full Stack Developer",
            "reason": "Your web development skills match this career."
        })

    if not recommendations:
        recommendations.append({
            "career": "AI Engineer",
            "reason": "AI Engineer is a strong career option based on your profile."
        })

    return {
        "success": True,
        "education": data.education,
        "goal": data.goal,
        "recommendations": recommendations
    }


# =========================================================
# SKILL GAP ANALYSIS
# =========================================================

@app.post("/api/skill-gap")
def skill_gap(data: SkillGapRequest):

    career = data.career.lower()
    current_skills = [skill.lower() for skill in data.skills]

    required_skills = {
        "ai engineer": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "PyTorch",
            "Generative AI",
            "LangChain",
            "RAG"
        ],

        "data scientist": [
            "Python",
            "Statistics",
            "Pandas",
            "NumPy",
            "Machine Learning",
            "SQL",
            "Data Visualization"
        ],

        "data analyst": [
            "Excel",
            "SQL",
            "Python",
            "Pandas",
            "Power BI",
            "Data Visualization"
        ],

        "full stack developer": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Git"
        ]
    }

    skills_required = required_skills.get(
        career,
        required_skills["ai engineer"]
    )

    missing_skills = []

    for skill in skills_required:
        if skill.lower() not in current_skills:
            missing_skills.append(skill)

    return {
        "success": True,
        "career": data.career,
        "current_skills": data.skills,
        "required_skills": skills_required,
        "missing_skills": missing_skills,
        "skill_gap_count": len(missing_skills)
    }


# =========================================================
# LEARNING ROADMAP
# =========================================================

@app.post("/api/learning-roadmap")
def learning_roadmap(data: LearningRoadmapRequest):

    career = data.career.lower()

    roadmaps = {

        "ai engineer": [
            {
                "step": 1,
                "title": "Python Fundamentals",
                "topics": [
                    "Python Basics",
                    "Functions",
                    "OOP",
                    "File Handling"
                ]
            },
            {
                "step": 2,
                "title": "Machine Learning",
                "topics": [
                    "Supervised Learning",
                    "Unsupervised Learning",
                    "Scikit-learn",
                    "Model Evaluation"
                ]
            },
            {
                "step": 3,
                "title": "Deep Learning",
                "topics": [
                    "Neural Networks",
                    "CNN",
                    "RNN",
                    "Transformers"
                ]
            },
            {
                "step": 4,
                "title": "Generative AI",
                "topics": [
                    "LLMs",
                    "Prompt Engineering",
                    "Embeddings",
                    "Vector Databases"
                ]
            },
            {
                "step": 5,
                "title": "AI Applications",
                "topics": [
                    "LangChain",
                    "RAG",
                    "FastAPI",
                    "Docker"
                ]
            }
        ],

        "data scientist": [
            {
                "step": 1,
                "title": "Python for Data Science",
                "topics": [
                    "Python",
                    "NumPy",
                    "Pandas"
                ]
            },
            {
                "step": 2,
                "title": "Statistics",
                "topics": [
                    "Probability",
                    "Statistics",
                    "Hypothesis Testing"
                ]
            },
            {
                "step": 3,
                "title": "Machine Learning",
                "topics": [
                    "Regression",
                    "Classification",
                    "Clustering"
                ]
            },
            {
                "step": 4,
                "title": "Data Visualization",
                "topics": [
                    "Matplotlib",
                    "Seaborn",
                    "Power BI"
                ]
            }
        ],

        "data analyst": [
            {
                "step": 1,
                "title": "Excel",
                "topics": [
                    "Formulas",
                    "Pivot Tables",
                    "Charts"
                ]
            },
            {
                "step": 2,
                "title": "SQL",
                "topics": [
                    "SELECT",
                    "JOIN",
                    "GROUP BY",
                    "Subqueries"
                ]
            },
            {
                "step": 3,
                "title": "Python",
                "topics": [
                    "Pandas",
                    "NumPy",
                    "Data Cleaning"
                ]
            },
            {
                "step": 4,
                "title": "Visualization",
                "topics": [
                    "Power BI",
                    "Dashboards",
                    "Data Storytelling"
                ]
            }
        ],

        "full stack developer": [
            {
                "step": 1,
                "title": "Frontend Basics",
                "topics": [
                    "HTML",
                    "CSS",
                    "JavaScript"
                ]
            },
            {
                "step": 2,
                "title": "React",
                "topics": [
                    "Components",
                    "Props",
                    "State",
                    "Hooks"
                ]
            },
            {
                "step": 3,
                "title": "Backend",
                "topics": [
                    "Node.js",
                    "Express.js",
                    "REST APIs"
                ]
            },
            {
                "step": 4,
                "title": "Database",
                "topics": [
                    "MongoDB",
                    "SQL",
                    "Database Design"
                ]
            },
            {
                "step": 5,
                "title": "Deployment",
                "topics": [
                    "Git",
                    "Docker",
                    "Cloud Deployment"
                ]
            }
        ]
    }

    roadmap = roadmaps.get(
        career,
        roadmaps["ai engineer"]
    )

    return {
        "success": True,
        "career": data.career,
        "roadmap": roadmap
    }


# =========================================================
# RESUME ANALYSIS
# =========================================================

from fastapi import UploadFile, File
import re


@app.post("/api/resume-analysis")
async def resume_analysis(file: UploadFile = File(...)):

    filename = file.filename

    content = await file.read()

    file_size = len(content)

    # Basic PDF validation
    if not filename.lower().endswith(".pdf"):
        return {
            "success": False,
            "message": "Please upload a PDF resume."
        }

    # Try extracting text from PDF
    try:
        import io
        import PyPDF2

        pdf_reader = PyPDF2.PdfReader(
            io.BytesIO(content)
        )

        resume_text = ""

        for page in pdf_reader.pages:
            text = page.extract_text()

            if text:
                resume_text += text + "\n"

    except Exception as error:

        return {
            "success": False,
            "filename": filename,
            "file_size": file_size,
            "message": "Could not read the PDF.",
            "error": str(error)
        }

    # -----------------------------------------------------
    # BASIC SKILL DETECTION
    # -----------------------------------------------------

    known_skills = [
        "Python",
        "Java",
        "C",
        "C++",
        "JavaScript",
        "React",
        "HTML",
        "CSS",
        "SQL",
        "MongoDB",
        "Machine Learning",
        "Deep Learning",
        "Generative AI",
        "Artificial Intelligence",
        "Data Science",
        "Data Analysis",
        "TensorFlow",
        "PyTorch",
        "LangChain",
        "RAG",
        "FastAPI",
        "Node.js",
        "Express.js",
        "Git",
        "GitHub",
        "Docker"
    ]

    skills = []

    resume_lower = resume_text.lower()

    for skill in known_skills:

        if skill.lower() in resume_lower:
            skills.append(skill)

    # -----------------------------------------------------
    # EDUCATION
    # -----------------------------------------------------

    education = []

    education_keywords = [
        "B.Tech",
        "BTech",
        "Bachelor of Technology",
        "M.Tech",
        "MTech",
        "B.Sc",
        "BCA",
        "MCA",
        "MBA",
        "Intermediate",
        "12th",
        "10th"
    ]

    for item in education_keywords:

        if item.lower() in resume_lower:
            education.append(item)

    # -----------------------------------------------------
    # EXPERIENCE
    # -----------------------------------------------------

    experience = []

    experience_keywords = [
        "internship",
        "intern",
        "experience",
        "developer",
        "engineer",
        "trainee"
    ]

    for item in experience_keywords:

        if item.lower() in resume_lower:
            experience.append(item.title())

    # -----------------------------------------------------
    # PROJECTS
    # -----------------------------------------------------

    projects = []

    if "project" in resume_lower:
        projects.append(
            "Projects mentioned in resume"
        )

    # -----------------------------------------------------
    # SUGGESTIONS
    # -----------------------------------------------------

    suggestions = []

    if len(skills) < 5:
        suggestions.append(
            "Add more technical skills."
        )

    if "project" not in resume_lower:
        suggestions.append(
            "Add your projects with technologies used."
        )

    if not any(
        word in resume_lower
        for word in [
            "achievement",
            "result",
            "increased",
            "improved",
            "%"
        ]
    ):
        suggestions.append(
            "Add measurable achievements."
        )

    suggestions.append(
        "Keep your resume ATS friendly."
    )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {

        "success": True,

        "filename": filename,

        "file_size": file_size,

        "message": "Resume analyzed successfully.",

        "analysis": {

            "skills": skills,

            "education": education,

            "experience": experience,

            "projects": projects,

            "suggestions": suggestions

        }

    }
# =========================================================
# INTERVIEW PREPARATION
# =========================================================

@app.post("/api/interview-preparation")
def interview_preparation(data: InterviewRequest):

    career = data.career.lower().strip()

    interview_data = {

        "ai engineer": {

            "technical": [
                {
                    "question": "What is Artificial Intelligence?",
                    "answer": "Artificial Intelligence is the field of computer science that enables machines to perform tasks that normally require human intelligence."
                },
                {
                    "question": "What is Machine Learning?",
                    "answer": "Machine Learning is a subset of AI where machines learn patterns from data and use those patterns to make predictions or decisions."
                },
                {
                    "question": "What is the difference between AI and Machine Learning?",
                    "answer": "AI is the broader concept of creating intelligent machines, while Machine Learning is a technique used to achieve AI by learning from data."
                },
                {
                    "question": "What is supervised learning?",
                    "answer": "Supervised learning is a machine learning approach where a model learns from labelled training data."
                },
                {
                    "question": "What is overfitting?",
                    "answer": "Overfitting occurs when a machine learning model performs very well on training data but poorly on unseen data."
                },
                {
                    "question": "What is a neural network?",
                    "answer": "A neural network is a computational model inspired by the human brain that consists of interconnected layers of neurons."
                },
                {
                    "question": "What is Generative AI?",
                    "answer": "Generative AI is a type of AI that can generate new content such as text, images, code, audio and other data."
                },
                {
                    "question": "What is an LLM?",
                    "answer": "An LLM, or Large Language Model, is an AI model trained on large amounts of text to understand and generate human-like language."
                },
                {
                    "question": "What is RAG?",
                    "answer": "RAG stands for Retrieval-Augmented Generation. It retrieves relevant information from a knowledge source and provides it to an LLM to generate a more accurate response."
                },
                {
                    "question": "What is an embedding?",
                    "answer": "An embedding is a numerical representation of data such as text that captures its semantic meaning."
                }
            ],

            "hr": [
                {
                    "question": "Tell me about yourself.",
                    "answer": "I am a B.Tech Artificial Intelligence student with an interest in AI, Machine Learning and Generative AI. I enjoy building practical projects and continuously improving my technical skills."
                },
                {
                    "question": "Why do you want to become an AI Engineer?",
                    "answer": "I am interested in Artificial Intelligence and enjoy solving real-world problems using technology. AI Engineering allows me to combine programming, machine learning and problem solving."
                },
                {
                    "question": "What are your strengths?",
                    "answer": "My strengths are quick learning, problem solving, consistency and willingness to learn new technologies."
                },
                {
                    "question": "What is your weakness?",
                    "answer": "Sometimes I spend extra time trying to make my work perfect. I am improving this by prioritizing tasks and managing my time better."
                },
                {
                    "question": "Why should we hire you?",
                    "answer": "I have a strong interest in AI, I am willing to learn, and I can apply my knowledge by building practical projects. I am also adaptable and comfortable learning new technologies."
                }
            ]
        },

        "data scientist": {

            "technical": [
                {
                    "question": "What is Data Science?",
                    "answer": "Data Science is the process of extracting useful insights and knowledge from structured and unstructured data using statistics, programming and machine learning."
                },
                {
                    "question": "What is the difference between classification and regression?",
                    "answer": "Classification predicts categories or classes, while regression predicts continuous numerical values."
                },
                {
                    "question": "What is data preprocessing?",
                    "answer": "Data preprocessing involves cleaning, transforming and preparing raw data before using it for analysis or machine learning."
                },
                {
                    "question": "What is feature engineering?",
                    "answer": "Feature engineering is the process of creating or transforming input features to improve the performance of a machine learning model."
                },
                {
                    "question": "What is cross-validation?",
                    "answer": "Cross-validation is a technique used to evaluate model performance by splitting data into multiple training and validation sets."
                }
            ],

            "hr": [
                {
                    "question": "Tell me about yourself.",
                    "answer": "I am a B.Tech student interested in Data Science, Python, SQL and Machine Learning. I enjoy working with data and building projects that solve real-world problems."
                },
                {
                    "question": "Why Data Science?",
                    "answer": "I enjoy analysing data, finding patterns and using those insights to solve problems. Data Science combines programming, statistics and AI, which interests me."
                },
                {
                    "question": "What are your strengths?",
                    "answer": "My strengths are analytical thinking, problem solving, willingness to learn and consistency."
                },
                {
                    "question": "Why should we hire you?",
                    "answer": "I have a strong foundation in Python, data analysis and machine learning, and I am motivated to learn and contribute to real-world projects."
                }
            ]
        },

        "data analyst": {

            "technical": [
                {
                    "question": "What does a Data Analyst do?",
                    "answer": "A Data Analyst collects, cleans, analyses and visualizes data to help organizations make better decisions."
                },
                {
                    "question": "What is SQL?",
                    "answer": "SQL is a language used to store, retrieve, manipulate and analyze data in relational databases."
                },
                {
                    "question": "What is a JOIN in SQL?",
                    "answer": "A JOIN combines rows from two or more tables based on a related column."
                },
                {
                    "question": "What is a pivot table?",
                    "answer": "A pivot table is a tool used to summarize and analyze large datasets by grouping and aggregating data."
                },
                {
                    "question": "What is data visualization?",
                    "answer": "Data visualization is the graphical representation of data using charts, graphs and dashboards."
                }
            ],

            "hr": [
                {
                    "question": "Tell me about yourself.",
                    "answer": "I am a B.Tech student interested in data analysis, Python and SQL. I enjoy working with datasets, finding useful insights and presenting information clearly."
                },
                {
                    "question": "Why do you want to become a Data Analyst?",
                    "answer": "I enjoy analysing information and finding patterns that can help in decision making. Data Analytics allows me to combine technical and analytical skills."
                },
                {
                    "question": "What are your strengths?",
                    "answer": "My strengths are analytical thinking, attention to detail and willingness to learn."
                },
                {
                    "question": "Why should we hire you?",
                    "answer": "I have a strong interest in data, I am improving my Python and SQL skills, and I am eager to apply them to real-world business problems."
                }
            ]
        },

        "full stack developer": {

            "technical": [
                {
                    "question": "What is HTML?",
                    "answer": "HTML stands for HyperText Markup Language and is used to structure content on web pages."
                },
                {
                    "question": "What is CSS?",
                    "answer": "CSS is used to style and design HTML elements on web pages."
                },
                {
                    "question": "What is JavaScript?",
                    "answer": "JavaScript is a programming language used to add interactivity and dynamic behaviour to web applications."
                },
                {
                    "question": "What is React?",
                    "answer": "React is a JavaScript library used to build user interfaces using reusable components."
                },
                {
                    "question": "What is Node.js?",
                    "answer": "Node.js is a JavaScript runtime that allows JavaScript to run outside the browser, commonly used for backend development."
                },
                {
                    "question": "What is REST API?",
                    "answer": "A REST API is an interface that allows applications to communicate using HTTP methods such as GET, POST, PUT and DELETE."
                },
                {
                    "question": "What is MongoDB?",
                    "answer": "MongoDB is a NoSQL database that stores data in flexible document-based structures."
                }
            ],

            "hr": [
                {
                    "question": "Tell me about yourself.",
                    "answer": "I am a B.Tech student interested in Full Stack Development. I enjoy building web applications and learning technologies such as React, Node.js and databases."
                },
                {
                    "question": "Why do you want to become a Full Stack Developer?",
                    "answer": "I enjoy creating complete applications and understanding both frontend and backend development."
                },
                {
                    "question": "What are your strengths?",
                    "answer": "My strengths are problem solving, learning quickly and experimenting with new technologies."
                },
                {
                    "question": "Why should we hire you?",
                    "answer": "I have a strong interest in web development, enjoy building projects and am willing to continuously learn and improve."
                }
            ]
        }
    }

    result = interview_data.get(
        career,
        interview_data["ai engineer"]
    )

    return {
        "success": True,
        "career": data.career,
        "technical_questions": result["technical"],
        "hr_questions": result["hr"],
        "total_questions": (
            len(result["technical"]) +
            len(result["hr"])
        )
    }