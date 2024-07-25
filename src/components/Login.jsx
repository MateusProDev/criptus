import React from 'react';
import { signInWithGooglePopup } from '../firebase/firebase';
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
  const handleGoogleLogin = async () => {
    try {
      await signInWithGooglePopup();
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <LoginContainer>
      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </LoginContainer>
  );
};

export default Login;
