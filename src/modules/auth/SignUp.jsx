import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

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

const SignUpButton = styled.button`
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

const SignupText = styled.p`
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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered. Try logging in instead.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
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
      <Title>Sign Up Form</Title>

      <form onSubmit={handleSignUp} style={{ width: "100%" }}>
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

        <SignUpButton type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </SignUpButton>
      </form>

      <SignupText>
        Already have an account? <StyledLink to="/login">Login</StyledLink>
      </SignupText>
    </Container>
  );
};

export default SignUp;
