FROM python:3.12.3-slim-bullseye

ENV POETRY_VERSION 1.8.0

# Install system dependencies
RUN pip install "poetry==$POETRY_VERSION"

# Set work directory
WORKDIR /app

# Copy only requirements to cache them in docker layer
COPY pyproject.toml /app/

# Disable the creation of virtual environments
RUN poetry config virtualenvs.create false

# Skip poetry install completely
# Install all required packages directly with versions that match your pyproject.toml
RUN poetry lock --no-update && poetry install --no-root --no-dev

# Copy the current directory contents into the container at /app
COPY ./ /app/

# No CMD here - it's provided by docker-compose