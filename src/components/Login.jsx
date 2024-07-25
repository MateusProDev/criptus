// src/components/Login.jsx

import React from 'react';
import { signInWithGoogle } from '../firebase/firebase';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(145deg, #1f1c2c, #928dab);
`;

const Button = styled.button`
  background: #00c6ff;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.2em;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Login = () => {
  return (
    <LoginContainer>
      <Button onClick={signInWithGoogle}>Login with Google</Button>
    </LoginContainer>
  );
};

export default Login;
