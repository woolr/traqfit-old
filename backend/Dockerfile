# backend/Dockerfile

# Use an official Python image
FROM python:3.11

# Set the working directory
WORKDIR app/

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code to the container
COPY . .

# Specify the port that the application will listen on
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

