from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware


from app.routes import (
    auth,
    complaints,
    departments,
    analytics,
    clustering
)



app=FastAPI(
    title="Smart City Complaint System"
)



origins = [
    "https://smart-city-service-portal-1.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows your live frontend domain to make requests
    allow_credentials=True,
    allow_methods=["*"],    # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],    # Allows Content-Type, Authorization, etc.
)



app.include_router(
    auth.router,
    prefix="/auth"
)


app.include_router(
    complaints.router,
    prefix="/complaints"
)


app.include_router(
    departments.router,
    prefix="/departments"
)


app.include_router(
    analytics.router,
    prefix="/analytics"
)


app.include_router(
    clustering.router,
    prefix="/clusters"
)



@app.get("/")

def home():

    return {
        "status":
        "Backend running successfully"
    }
