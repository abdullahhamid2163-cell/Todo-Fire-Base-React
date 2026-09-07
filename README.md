# Todo Fire Base React

A simple full-stack Todo app built with **React**, **Firebase Authentication**, and **Cloud Firestore**. Users can sign up, log in, and manage their own personal todo list — each user only sees their own tasks, in real time, with no page refresh needed.

---

## Features

- 🔐 Email/password authentication (Sign Up & Login) via Firebase Auth
- 🔒 Protected routes — the dashboard is only reachable when logged in
- 🌍 Global auth state via React Context (`useAuth`), no prop-drilling
- ✅ Create, edit, complete, and delete todos
- ⚡ Real-time sync with Firestore (`onSnapshot`) — no manual refresh
- 🧑‍🤝‍🧑 Per-user data — todos are filtered by the logged-in user's UID
- 🎨 Styled with `styled-components`

---

## Tech Stack

| Layer          | Technology              |
|----------------|--------------------------|
| Frontend       | React (Vite)             |
| Routing        | react-router-dom         |
| Styling        | styled-components         |
| Auth & Database| Firebase (Auth + Firestore) |

---

## Project Structure

```
Todo Fire Base React/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   ├── firebase/
│   │   │   ├── firebase.js         # Firebase config & initialization
│   │   │   ├── AuthContext.jsx     # Global auth state (Context + Provider)
│   │   │   └── ProtectedRoute.jsx  # Route guard for logged-in-only pages
│   │   └── home/
│   │       ├── dashboard.jsx
│   │       └── components/
│   │           ├── InputTodo.jsx
│   │           └── TodoList.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/todo-fire-base-react.git
cd todo-fire-base-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
3. Enable **Firestore Database** (start in test mode for development).
4. In Project Settings, register a new Web App and copy your Firebase config.
5. Paste your config into `src/modules/firebase/firebase.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

> 💡 For a real project, move these values into a `.env` file and read them with `import.meta.env.VITE_...` instead of hardcoding them.

### 4. Run the app

```bash
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

---

## How the App Works — Full Flow (Start to End)

### 1. App boots up

- `App.jsx` is the entry point. It wraps everything in `<AuthProvider>`.
- `AuthProvider` immediately calls Firebase's `onAuthStateChanged` listener, which checks: *"Is anyone currently logged in?"*
- While it's checking, a **"Loading..."** message is shown.
- Once Firebase responds, `AuthProvider` stores the result (`user` or `null`) in Context, making it available to the whole app via the `useAuth()` hook.

### 2. Routing decides what to show

Inside `<BrowserRouter>`, three routes exist:

| Path       | Component   | Access                        |
|------------|-------------|--------------------------------|
| `/login`   | `Login`     | Public                        |
| `/signup`  | `SignUp`    | Public                        |
| `/`        | `Dashboard` | Protected (wrapped in `ProtectedRoute`) |

- If a **logged-out** user tries to visit `/`, `ProtectedRoute` checks `useAuth()`, sees `user` is `null`, and redirects them to `/login`.
- If a **logged-in** user visits `/`, `ProtectedRoute` lets them through to `Dashboard`.

### 3. Signing up

1. User fills the email/password form on the `SignUp` page and submits.
2. `createUserWithEmailAndPassword(auth, email, password)` sends the request to Firebase Auth.
3. **Success** → Firebase creates the account and automatically signs the user in → `onAuthStateChanged` fires → `user` updates in Context → user is redirected to `/` → sees the Dashboard.
4. **Failure** (e.g. email already in use, weak password) → the error is caught and a friendly message is shown on screen, no crash, no console-only errors.

### 4. Logging in

Same idea as sign up, but using `signInWithEmailAndPassword(auth, email, password)`. On success, `onAuthStateChanged` fires again, `user` is set, and the app routes to the Dashboard.

### 5. Using the Dashboard

Once inside `Dashboard`:

- `useAuth()` grabs the current `user` (no prop-passing required).
- The user's email is displayed, along with a **Log Out** button.
- `InputTodo` and `TodoList` are rendered — both also call `useAuth()` internally to know *whose* todos to read/write.

### 6. Adding a todo

1. User types a task into `InputTodo` and submits.
2. `addDoc(collection(db, "todos"), { todo, completed: false, uid: user.uid, createdAt })` writes a new document to the `todos` collection in Firestore, tagged with the user's UID.
3. Firestore instantly pushes this change out to anyone listening (see next step) — no manual refresh needed.

### 7. Viewing todos (real-time)

1. `TodoList` sets up a Firestore query: `where("uid", "==", user.uid)` — so it only ever asks for *this* user's todos.
2. `onSnapshot(...)` subscribes to that query. Any time a todo is added, edited, completed, or deleted (by this user, from any device/tab), Firestore pushes the updated list automatically, and React re-renders.

### 8. Editing / completing / deleting a todo

- **Toggle complete**: clicking the todo text calls `updateDoc(todoRef, { completed: !completed })`.
- **Edit**: clicking "Edit" swaps the text for an input box; "Save" calls `updateDoc(todoRef, { todo: newText })`.
- **Delete**: calls `deleteDoc(todoRef)`, removing it from Firestore entirely.

All of these changes are picked up instantly by the `onSnapshot` listener from step 7 — the UI updates itself, no manual state syncing needed.

### 9. Logging out

1. User clicks **Log Out** on the Dashboard.
2. `signOut(auth)` is called.
3. Firebase clears the session → `onAuthStateChanged` fires one more time with `user = null`.
4. Context updates → `ProtectedRoute` sees there's no user anymore → automatically redirects back to `/login`.

---

## Summary of the Full Journey

```
App loads
   │
   ▼
AuthProvider checks Firebase session
   │
   ├── No user ──► redirected to /login
   │                   │
   │                   ├── Sign Up ──► account created ──► auto logged in
   │                   └── Log In  ──► credentials verified ──► logged in
   │
   ▼
user exists in Context
   │
   ▼
ProtectedRoute allows access to "/"
   │
   ▼
Dashboard loads
   │
   ├── InputTodo ──► adds todo to Firestore (tagged with uid)
   └── TodoList  ──► listens live to Firestore, shows/edits/completes/deletes todos
   │
   ▼
User clicks Log Out
   │
   ▼
Firebase session cleared ──► redirected back to /login
```

---

## Possible Next Steps

- Add password reset (`sendPasswordResetEmail`)
- Add Firestore security rules restricting reads/writes to `request.auth.uid == resource.data.uid`
- Move Firebase config to environment variables (`.env`)
- Add loading spinners for todo actions
- Add form validation (e.g. minimum password length before hitting Firebase)

---

## License

This project is open source and available under the [MIT License](LICENSE).
