Task Management System
A full-stack web application for managing tasks, featuring a Next.js frontend and a Node.js/Express backend with MongoDB. The app allows users to register, log in, create, update, delete, and assign tasks, filter tasks by status, priority, or due date, and view a dashboard with task metrics. The UI is modern and responsive, styled with Tailwind CSS.
Repository Structure

backend/: Contains the Node.js/Express backend with MongoDB integration.
task-management/: Contains the Next.js frontend with Redux and Tailwind CSS.

Features

User Authentication: Register and log in with name, email, and password. JWT-based authentication secures protected routes.
Task Management: Create, read, update, and delete tasks with attributes like title, description, status (To Do, In Progress, Completed), priority (Low, Medium, High), and due date.
Task Assignment: Assign tasks to registered users.
Search and Filter: Filter tasks by status, priority, and due date.
Dashboard: View metrics for assigned, created, and overdue tasks in a card-based layout.
Responsive UI: Fixed navbar, mobile-friendly menu, and consistent Tailwind CSS styling.
Error Handling: Toast notifications for success and error messages, with loading spinners for async operations.

Technologies Used

Frontend (task-management/):
Next.js: React framework for server-side rendering and routing.
Redux (with @reduxjs/toolkit): State management for authentication and tasks.
Tailwind CSS: Utility-first CSS for modern, responsive styling.
Axios: HTTP client for API requests.
React Toastify: Notification system for user feedback.


Backend (backend/):
Node.js/Express: RESTful API server.
MongoDB/Mongoose: NoSQL database for users and tasks.
JWT (jsonwebtoken): Token-based authentication.
Bcrypt: Password hashing for security.


Development Tools:
Git/GitHub: Version control and repository hosting.


Setup Instructions
Prerequisites

Node.js (v16 or higher)
MongoDB (local instance or MongoDB Atlas)
Git

Clone the Repository
git clone https://github.com/SanjuSanjaytech/Task-Management-System.git
cd Task-Management-System

Backend Setup (backend/)

Navigate to Backend:cd backend


Install Dependencies:npm install


Configure Environment Variables:
Create a .env file in backend/:MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret
PORT=5000


Replace MONGO_URI with your MongoDB connection string.
Replace your_jwt_secret with a random string (e.g., mysecretkey123).


Run the Backend:npm run dev


The server runs at http://localhost:5000.
Confirm MongoDB connection (MongoDB connected in terminal).



Frontend Setup (task-management/)

Navigate to Frontend:cd ../task-management


Install Dependencies:npm install


Configure Environment Variables:
Create a .env.local file in task-management/:NEXT_PUBLIC_API_URL=http://localhost:5000


Update NEXT_PUBLIC_API_URL if the backend is deployed.


Run the Frontend:npm run dev


The app runs at http://localhost:3000.
Open http://localhost:3000 in your browser.



Testing the Application

Register: Go to http://localhost:3000/register to create a user.
Log In: Visit http://localhost:3000/login to sign in.
Dashboard: Check http://localhost:3000/dashboard for task metrics.
Tasks: Create, edit, delete, assign, and filter tasks at http://localhost:3000/tasks.
Mobile View: Resize the browser to test the responsive navbar and layouts.



Approach Explanation
The Task Management System is a full-stack application with a client-server architecture, designed for modularity and user experience.
Frontend (task-management/)

Next.js: Provides file-based routing and server-side rendering. Pages include dashboard.js, tasks.js, login.js, and register.js.
Redux: Manages state for authentication (authSlice.js) and tasks (taskSlice.js) with async thunks for API calls.
Tailwind CSS: Enables rapid UI development with a modern, responsive design (fixed navbar, card-based layouts, hover effects).
Axios: Handles API requests with token authentication (api.js).
React Toastify: Displays user-friendly notifications.

Backend (backend/)

Node.js/Express: Serves a RESTful API with endpoints for authentication (/api/auth), tasks (/api/tasks), and users (/api/users).
MongoDB/Mongoose: Stores data with schemas (User.js, Task.js) for validation.
JWT and Bcrypt: Secure authentication with tokens and hashed passwords.
Middleware: Protects routes with authentication middleware (authMiddleware.js).

Design Decisions

Separation of Concerns: Frontend and backend are organized in separate directories (task-management/ and backend/) for clarity.
Responsive UI: Tailwind CSS ensures a mobile-friendly navbar (Layout.js) and layouts.
Error Handling: Toast notifications and loading spinners improve user experience.
Modular Components: Reusable components (TaskForm.js, TaskList.js, SearchBar.js) enhance maintainability.

Assumptions

Local MongoDB: Assumes a local MongoDB instance or MongoDB Atlas for backend/.
Basic User Model: Users have name, email, and password fields.
Single Role: All users can create, assign, and manage tasks (no admin roles).
Assignment Scope: Focuses on core features (authentication, task CRUD, dashboard, search/filter).
Development Environment: Assumes Node.js, Git, and basic terminal knowledge.

Trade-Offs

Local Storage for JWT: Uses localStorage for simplicity, less secure than HTTP-only cookies.
No Real-Time Features: Relies on API polling instead of WebSockets for simplicity.
Basic Validation: Includes minimal validation (required fields, email format) to meet assignment scope.
No Tests: Omits unit tests to prioritize functionality, suitable for an assignment.
Tailwind vs. Custom CSS: Tailwind speeds up development but increases CSS size.


Troubleshooting

MongoDB Errors: Ensure MongoDB is running or check MONGO_URI in backend/.env.
API Issues: Verify backend is running (http://localhost:5000) and NEXT_PUBLIC_API_URL is correct in task-management/.env.local.
Styling Problems: Check globals.css in task-management/.
Auth Issues: Clear localStorage (localStorage.removeItem('token')) and re-login.

For support, open an issue on the GitHub repository.
