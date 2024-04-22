# app.py

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify the correct origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models for requests
class RunConfig(BaseModel):
    miles: int
    chunks: int
    speeds: List[List[float]]

# Calculate the total distance
def calculate_total_distance(miles: int, chunks: int):
    total_distance = miles * chunks * (1 / chunks)
    return total_distance

# Calculate the total time
def calculate_total_time(speeds, chunks):
    chunk_minutes = []
    for chunk_speeds in speeds:
        speeds_per_minute = [speed / 60 for speed in chunk_speeds]
        chunk_total_minutes = sum(1 / speed for speed in speeds_per_minute) / chunks
        chunk_minutes.append(chunk_total_minutes)
    total_time_minutes = sum(chunk_minutes)
    return total_time_minutes

# Calculate the pace
def calculate_pace(total_time, total_distance):
    pace = total_distance / (total_time / 60)
    return pace

@app.get("/api/")
def landing_page():
    return {"message": "Welcome to the running configuration API"}

@app.post("/api/run_config/")
def run_config_page(miles: int = Form(...), chunks: int = Form(...)):
    return {"miles": miles, "chunks": chunks}

@app.post("/api/calculate_run/")
def calculate_run(run_config: RunConfig):
    print("\n\n", run_config, "\n\n")
    total_distance = calculate_total_distance(run_config.miles, run_config.chunks)
    total_time = calculate_total_time(run_config.speeds, run_config.chunks)
    pace = calculate_pace(total_time, total_distance)
    return {
        "total_distance": total_distance,
        "total_time": total_time,
        "pace": pace,
        "miles": run_config.miles,
        "chunks": run_config.chunks,
        "speeds": run_config.speeds
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
