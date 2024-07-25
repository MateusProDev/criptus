// src/pages/PostPage.jsx

import React from 'react';
import Header from '../components/Header';
import Post from '../components/Post';

const PostPage = ({ match }) => {
  const { id } = match.params;
  return (
    <div>
      <Header />
      <Post postId={id} />
    </div>
  );
};

export default PostPage;
