# Frontend for Academic Advising Tool

## Description

This frontend component of the Academic Advising Tool provides a user interface for managing academic advising tasks. It is developed using React, Next.js, and Shadcn for UI components. The application allows for user management including fetching, creating, editing, and deleting users via a responsive interface.

## System Requirements

- Node.js
- A modern web browser

## Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd [repository-directory]/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

Before starting the frontend, make sure the backend server is running:
```bash
# Navigate to the backend directory and run:
cd ../backend
npm run start:dev
```

Once the backend is running, start the frontend server:
```bash
# Navigate back to the frontend directory
cd ../frontend
npm run dev
```

This command starts the development server on `http://localhost:3000`, where you can interact with the application.

## Building the Application

To build the application for production:
```bash
npm run build
```
This will compile your application and get it ready for deployment.

## Application Structure

- **app/**: Contains the main pages and components of the application, organized by functionality (e.g., create, edit, settings).
- **components/**: Reusable UI components used across different parts of the application.
- **lib/**: Helper functions and libraries.
- **public/**: Static assets like images and icons.
- **styles/**: CSS and Tailwind configuration files for styling the application.

## Features

- **User Management**: Create, fetch, edit, and delete user information through interactive forms and tables.
- **Responsive UI**: Built using Shadcn UI components to ensure the interface is responsive and intuitive.
- **Real-time Data**: Interacts with the backend to fetch and reflect updates in real-time.
