# Use a lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install torch torchvision tensorflow transformers


# Copy application code
COPY . .

# Run Flask app
CMD ["python", "app.py"]
