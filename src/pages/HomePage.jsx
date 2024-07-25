// src/pages/HomePage.jsx
import React from 'react';
import PostList from '../components/PostList';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>Home</h1>
      {currentUser && <CreatePost />}
      <PostList />
    </div>
  );
};

export default HomePage;
