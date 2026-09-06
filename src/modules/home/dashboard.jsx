import { signOut } from "firebase/auth";
import InputTodo from "./components/InputTodo";
import TodoList from "./components/TodoList";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <p>{user.email}</p>
      <button onClick={handleLogout}>Log Out</button>

      <InputTodo />
      <TodoList />
    </div>
  );
};

export default Dashboard;
