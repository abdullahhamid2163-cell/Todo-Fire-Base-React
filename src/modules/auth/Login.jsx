import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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

const Title = styled.h2`
  color: #a8a8a8;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const Header = styled.span`
  color: white;
  font-size: 26px;
  font-weight: bold;
`;

const LoginButton = styled.button`
  background: black;
  color: #ffffff;
  border: 2px solid #ffffff;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 50%;
  margin-top: 10px;
  font-weight: bold;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const LoginText = styled.p`
  font-size: 14px;
  color: gray;
  margin-top: 15px;
  cursor: pointer;
  text-decoration: underline;
`;

const StyledLink = styled(Link)`
  color: white;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 13px;
  margin: 5px 0 0;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigate("/");
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>TODO</Header>
      <Title>Login Form</Title>

      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <input
          type="email"
          placeholder="Enter e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <LoginButton type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </LoginButton>
      </form>

      <LoginText>
        Don't have an account? <StyledLink to="/signup">Sign Up</StyledLink>
      </LoginText>
    </Container>
  );
};

export default Login;
