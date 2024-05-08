# Academic Advising Software Tool

**Author**: Gilberto Arellano
**Student ID**: 1801074

## Overview

The application is accessible via [garellano.dev](https://garellano.dev). I have managed to deploy the database using AWS EC2, although I am still having trouble setting up the process manager to the server running.

### Backend

The backend is built with TypeScript and uses Jest for testing and SonarQube to monitor code quality. It handles all the server-side logic, database interactions, and API services for CRUD operations on user data.

### Frontend

The frontend is developed using React with Next.js and styled with Shadcn/UI components. It provides an interactive user interface to perform operations like fetching, creating, editing, and deleting user data, reflecting changes made via API calls to the backend.

## Features

- **Database Management**: Manages a relational database schema to store user data effectively.
- **CRUD Operations**: Supports creating, reading, updating, and deleting user data through a clean and intuitive interface.
- **Responsive Design**: Ensures the application is usable on both desktop and mobile devices.
- **API Integration**: Seamlessly integrates the frontend and backend through RESTful APIs to handle data operations dynamically.

## Getting Started

To get started with this project, clone the repository and navigate into either the `backend` or `frontend` directory to find detailed README files specific to each part of the project.

### Prerequisites

- Node.js
- PostgreSQL (for the backend)
- Any modern web browser

### Installation

Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

Follow the setup instructions in the README files located in both the `backend` and `frontend` directories for specific setup and running instructions.
