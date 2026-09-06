import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../firebase/AuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #ffffff;
  border-radius: 8px;
  margin: 40px auto;
  padding: 30px 20px;
  width: 300px;
  font-family: "Roboto Condensed", sans-serif;
  background: black;

  & input {
    outline: none;
    margin: 10px 0;
    padding: 10px 12px;
    border-radius: 10px;
    border: 2px solid #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
`;

const Header = styled.span`
  color: white;
  font-size: 26px;
  font-weight: bold;
`;

const SubmitButton = styled.button`
  background: black;
  color: #ffffff;
  border: 2px solid #ffffff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 50%;
  margin-top: 10px;
  font-weight: bold;
`;

const InputTodo = () => {
  const { user } = useAuth();
  const [todo, setTodo] = useState("");

  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    await addDoc(collection(db, "todos"), {
      todo: todo,
      completed: false,
      uid: user.uid,
      createdAt: Date.now(),
    });

    setTodo("");
  };

  return (
    <Container>
      <Header>TODO</Header>
      <form onSubmit={handleTodoSubmit}>
        <input
          type="text"
          placeholder="Enter your new Task..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <SubmitButton type="submit">Add Todo</SubmitButton>
      </form>
    </Container>
  );
};

export default InputTodo;
