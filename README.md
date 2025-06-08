🚀 Task Manager App


A full-stack web application to manage tasks efficiently. Built with a Next.js frontend and Node.js/Express backend, using MongoDB for data storage. It features user authentication, task CRUD operations, assignment, filtering, and dashboard analytics — all wrapped in a modern and responsive UI styled with Tailwind CSS.

📂 Frontend: /task-management | Backend: /backend

🌟 Features
🔐 User Authentication
Register, login, and secure routes using JWT.

✅ Task Management (CRUD)
Create, update, delete, and read tasks with:
Status: To Do, In Progress, Completed
Priority: Low, Medium, High
Due Date & Description


- 👥 Task Assignment
   Assign tasks to registered users.

- 🔎 Search & Filter
  Filter tasks by status, priority, and due date.

- 📊 Dashboard Metrics
  View metrics: assigned tasks, created tasks, overdue tasks.

- 📱 Responsive UI
  Mobile-friendly design with a fixed navbar and smooth layouts.

- ⚠️ Error Handling & Feedback
  Toast notifications for success/errors & loading spinners.

🛠️ Tech Stack
Frontend (task-management/)

- Next.js — React framework with SSR & Routing
- Redux Toolkit — State management
- Tailwind CSS — Modern utility-first styling
- Axios — HTTP client
- React Toastify — Elegant notifications
- Backend (backend/)
- Node.js & Express — REST API server

MongoDB & Mongoose — NoSQL database
JWT — Authentication tokens
Bcrypt — Secure password hashing

📂 Repository Structure
   Task-Management-System/
  -  ├── backend/           # Node.js / Express backend
  -  └── task-management/   # Next.js frontend


🚀 Getting Started

✅ Prerequisites
   - Node.js (v16 or higher)
   - MongoDB (Local or Atlas)

- Git
🔥 Setup Instructions
1. Clone the Repository
   git clone https://github.com/SanjuSanjaytech/Task-Management-System.git
   cd Task-Management-System

2. Backend Setup (/backend)
   cd backend
   npm install
   Create a .env file inside /backend:
   MONGO_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_jwt_secret
   PORT=5000
   🔄 Replace MONGO_URI and JWT_SECRET with your actual values.
   Run the backend:
   npm run dev
   Server ➡️ http://localhost:5000
   Check terminal for "MongoDB connected" message.

3. Frontend Setup (/task-management)
   cd ../task-management
   npm install
   Create a .env.local file inside /task-management:

   NEXT_PUBLIC_API_URL=http://localhost:5000
   Run the frontend:

   npm run dev
   App ➡️ http://localhost:3000

🧪 Testing the Application

Feature	URL
- 🔐 Register	/register → http://localhost:3000/register
- 🔐 Login	/login → http://localhost:3000/login
- 📊 Dashboard	/dashboard → http://localhost:3000/dashboard
- 📋 Tasks	/tasks → http://localhost:3000/tasks

📱 Mobile Test: Resize browser or open DevTools → Mobile View.

🎯 Design Decisions

- Separation of Concerns: Cleanly divided frontend & backend.
- Tailwind CSS: For fast, responsive, and consistent UI.
- Redux Toolkit: Simplifies async actions & state management.
- Modular Components: Reusable UI blocks (e.g., TaskForm, TaskList, SearchBar).

⚠️ Assumptions & Trade-offs

- JWT in LocalStorage: Simpler but less secure (vs. HTTP-only cookies).
- No Real-Time Updates: Uses API polling; avoids WebSocket complexity.
- Basic Validation: Only essential field checks.
- No Automated Tests: Focused on core functionality (assignment scope).

🐛 Troubleshooting

Issue	Fix:

- ❌ MongoDB not connecting	Check MONGO_URI & ensure MongoDB is running.
- ❌ API 404/500 errors	Ensure backend is running at localhost:5000.
- ❌ Styling broken	Verify Tailwind setup in globals.css.
- ❌ Auth not working	Clear localStorage and re-login.



📚 Future Improvements

- ✅ Role-based access (Admin/User)
- ✅ Real-time updates (WebSockets)
- ✅ Advanced validation (Yup/Zod)
- ✅ Unit & Integration Tests (Jest/Testing Library)
- ✅ Dark Mode toggle

🤝 Contributing

- Fork this repo
- Create your feature branch (git checkout -b feat/my-feature)
- Commit your changes (git commit -m "Add my feature")
- Push to the branch (git push origin feat/my-feature)
- Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Feel free to fork, modify, and use it freely!

## 👨‍💻 Author

Sanjay — [GitHub Profile](https://github.com/SanjuSanjaytech)


👨‍💻 Author
Sanjay — GitHub

