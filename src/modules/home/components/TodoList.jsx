import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import styled from "styled-components";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../firebase/AuthContext";

const List = styled.ul`
  list-style: none;
  width: 300px;
  margin: 0 auto;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #666;
  color: white;
  border-radius: 6px;
  padding: 4px 8px;
  margin-left: 5px;
  cursor: pointer;
`;

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const todosQuery = query(
      collection(db, "todos"),
      where("uid", "==", user.uid),
    );

    const unsubscribe = onSnapshot(todosQuery, (snapshot) => {
      const todoItems = [];
      snapshot.forEach((docItem) => {
        todoItems.push({ id: docItem.id, ...docItem.data() });
      });
      setTodos(todoItems);
    });

    return () => unsubscribe();
  }, [user]);

  const handleToggleComplete = async (todoItem) => {
    const todoRef = doc(db, "todos", todoItem.id);
    await updateDoc(todoRef, {
      completed: !todoItem.completed,
    });
  };

  const handleDelete = async (id) => {
    const todoRef = doc(db, "todos", id);
    await deleteDoc(todoRef);
  };

  const handleEditClick = (todoItem) => {
    setEditingId(todoItem.id);
    setEditText(todoItem.todo);
  };

  const handleSaveEdit = async (id) => {
    if (editText.trim() === "") return;

    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      todo: editText,
    });

    setEditingId(null);
    setEditText("");
  };

  return (
    <List>
      {todos.map((todoItem) => (
        <Item key={todoItem.id}>
          {editingId === todoItem.id ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <span
              style={{
                textDecoration: todoItem.completed ? "line-through" : "none",
              }}
              onClick={() => handleToggleComplete(todoItem)}
            >
              {todoItem.todo}
            </span>
          )}

          <div>
            {editingId === todoItem.id ? (
              <IconButton onClick={() => handleSaveEdit(todoItem.id)}>
                Save
              </IconButton>
            ) : (
              <IconButton onClick={() => handleEditClick(todoItem)}>
                Edit
              </IconButton>
            )}
            <IconButton onClick={() => handleDelete(todoItem.id)}>
              Delete
            </IconButton>
          </div>
        </Item>
      ))}
    </List>
  );
};

export default TodoList;
