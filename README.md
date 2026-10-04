# 🚀 Taskify — Full-Stack Animated Todo Mobile App

A high-performance, feature-rich Full-Stack Mobile Application built with **React Native (Expo SDK 52)**, **Node.js / Express.js**, and **MongoDB Atlas**. Featuring a futuristic dark synthwave design, native 60fps animations, real-time live search, priority management, dark/light theme switching, and secure JWT multi-user isolation.

---

## ✨ Features & Highlights

### 🎨 **Crazy Animated UI & Aesthetics**
- **👁️ Crazy Password Eye Toggle:** Custom spring squeeze & pop blinking eye toggle (`🔒` / `🔓`) with glowing active border indicators.
- **🌌 Cyberpunk Dark Mesh Theme:** Glowing background orbs that continuously pulse/breathe at 60fps using React Native's Native Driver `Animated` API.
- **💎 Glassmorphism Cards:** Modern dark glass form cards with glowing indigo borders and soft shadows.

### 📱 **Main Dashboard & Task Management**
- **👤 Personalized Header:** Displays `"Welcome, [Name] 👋"`, custom user initials avatar badge, and live task statistics (`X Pending • Y Done`).
- **🎯 Priority Levels:** Task categorization with `HIGH 🔴`, `MEDIUM 🟡`, and `LOW 🟢` color badges.
- **📅 Due Dates:** Set deadlines or due dates for tasks (`📅 YYYY-MM-DD` / `Today`).
- **🔍 Live Search Bar:** Filter tasks instantly by title or description as you type.
- **🏷️ Category Filter Pills:** Instant tab switching for `All`, `Pending ⏳`, `Completed ✅`, and `High Priority 🔴`.
- **⚡ Floating Action Button (FAB):** Quick task creation button in the bottom right corner.
- **🔔 Animated Toast Notifications:** Slide-down banner snackbars for instant feedback on task creation, completion, editing, and deletion.
- **🌙 Dark & Light Theme Toggle:** One-tap header switch to toggle between Dark Mode and Light Mode (persisted locally using `AsyncStorage`).

---

## 🛠️ Tech Stack

### **Mobile App**
- **Framework:** React Native (Expo SDK 52)
- **Navigation:** React Navigation v7 (`@react-navigation/native-stack`)
- **State & Context:** React Context API (`AuthContext`, `ThemeContext`, `ToastContext`)
- **Persistence:** `@react-native-async-storage/async-storage`
- **Networking:** Axios
- **Animations:** React Native `Animated` API with `useNativeDriver: true`

### **Backend Server**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) + `bcryptjs` password hashing
- **Validation:** `express-validator`

---

## 📁 Project Structure

```text
Todo Mobile App/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # User registration & login logic
│   │   └── todoController.js     # User-owned Todo CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # Mongoose User schema
│   │   └── Todo.js               # Mongoose Todo schema (with priority & dueDate)
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes (/api/auth)
│   │   └── todoRoutes.js         # Protected Todo routes (/api/todos)
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomButton.js   # Animated spring button component
│   │   │   ├── CustomInput.js    # Animated focus input & crazy eye toggle
│   │   │   └── TodoItem.js       # Animated task card with priority badges
│   │   ├── context/
│   │   │   ├── AuthContext.js    # Authentication & JWT token manager
│   │   │   ├── ThemeContext.js   # Dark/Light theme switcher
│   │   │   └── ToastContext.js   # Animated notification banner manager
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js   # Main app navigation stack
│   │   │   └── AuthNavigator.js  # Auth navigation stack
│   │   ├── screens/
│   │   │   ├── AddTodoScreen.js  # Task creation screen with priority/date selector
│   │   │   ├── EditTodoScreen.js # Task edit screen
│   │   │   ├── LoginScreen.js    # Crazy animated login screen
│   │   │   ├── RegisterScreen.js # Crazy animated registration screen
│   │   │   └── TodoScreen.js     # Main dashboard with search, filters & stats
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with Auth headers
│   │   │   └── todoService.js    # Todo API endpoints service
│   │   └── utils/
│   │       └── config.js         # Auto-detecting API Base URL helper
│   ├── App.js                    # Root application component
│   ├── app.json                  # Expo project configuration
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (or local MongoDB server)
- **Expo Go** app on your physical mobile phone OR an **Android Studio / iOS Simulator**

---

### 2. Backend Setup & Startup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify your `.env` configuration file in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://saaddevpk_db_user:tOSjMJ1tAXCXhPYO@ac-egswxen-shard-00-00.jnphx2b.mongodb.net:27017,ac-egswxen-shard-00-01.jnphx2b.mongodb.net:27017,ac-egswxen-shard-00-02.jnphx2b.mongodb.net:27017/todo_assignment?ssl=true&replicaSet=atlas-mrrnov-shard-0&authSource=admin&appName=todomobileapp
   JWT_SECRET=my_super_secret_jwt_key_123
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   *The backend will run at `http://localhost:5000`.*

---

### 3. Mobile App Setup & Startup

1. Open a second terminal and navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch Expo Development Server:
   ```bash
   npm start
   ```

4. **Run on Device / Emulator:**
   - **Physical Mobile Device:** Open **Expo Go** app and scan the QR code displayed in the terminal.
   - **Android Emulator:** Press `a` in the terminal.
   - **iOS Simulator:** Press `i` in the terminal.

---

## 📡 API Reference

### 🔐 Auth Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive signed JWT token | ❌ |

### 📝 Todo Endpoints (`/api/todos`)

All Todo endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/todos` | Fetch all todos for logged-in user | ✅ |
| `POST` | `/api/todos` | Create a new todo (`title`, `description`, `priority`, `dueDate`) | ✅ |
| `PUT` | `/api/todos/:id` | Update an existing todo | ✅ |
| `PATCH` | `/api/todos/:id/toggle` | Toggle todo completion status | ✅ |
| `DELETE` | `/api/todos/:id` | Delete a todo | ✅ |

---

## 🔒 Security & Data Isolation

- **Password Encryption:** All user passwords are encrypted using `bcrypt` (10 salt rounds) before database insertion.
- **JWT Protection:** State transition endpoints require valid JWT authentication.
- **Strict Data Ownership:** Every database query enforces `{ _id: todoId, user: req.user.id }`. User A can never access, modify, or delete User B's tasks even if they know the object ID.

---

## 👨‍💻 License & Author

Developed for university/college coursework and demonstration. Open-source and free to customize!
