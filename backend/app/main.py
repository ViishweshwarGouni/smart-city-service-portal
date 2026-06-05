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



app.add_middleware(

CORSMiddleware,

allow_origins=["*"],

allow_methods=["*"],

allow_headers=["*"]

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
