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
    splits: int
    speeds: List[List[float]]

# Calculate the total distance
def calculate_total_distance(miles: int, splits: int):
    total_distance = miles * splits * (1 / splits)
    return total_distance

# Calculate the total time
def calculate_total_time(speeds, splits):
    split_minutes = []
    for split_speeds in speeds:
        speeds_per_minute = [speed / 60 for speed in split_speeds]
        split_total_minutes = sum(1 / speed for speed in speeds_per_minute) / splits
        split_minutes.append(split_total_minutes)
    total_time_minutes = sum(split_minutes)
    return total_time_minutes

# Calculate the pace
def calculate_pace(total_time, total_distance):
    pace = total_distance / (total_time / 60)
    return pace

@app.get("/api/")
def landing_page():
    return {"message": "Welcome to the running configuration API"}

@app.post("/api/run_config/")
def run_config_page(miles: int = Form(...), splits: int = Form(...)):
    return {"miles": miles, "splits": splits}

@app.post("/api/calculate_run/")
def calculate_run(run_config: RunConfig):
    print("\n\n", run_config, "\n\n")
    print("\n\nReceived request body:", run_config.json(), "\n\n")
    total_distance = calculate_total_distance(run_config.miles, run_config.splits)
    total_time = calculate_total_time(run_config.speeds, run_config.splits)
    pace = calculate_pace(total_time, total_distance)
    return {
        "total_distance": total_distance,
        "total_time": total_time,
        "pace": pace,
        "miles": run_config.miles,
        "splits": run_config.splits,
        "speeds": run_config.speeds
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level='debug')
