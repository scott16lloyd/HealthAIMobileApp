# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Make port available to the world outside this container
EXPOSE 8080

# Define environment variable (adjust as needed)
ENV NAME HealthAI

# Run app.py when the container launches
CMD ["python", "Application.py"]
