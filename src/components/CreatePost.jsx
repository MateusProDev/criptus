import React, { useState } from 'react';
import styled from 'styled-components';
import addPost from '../firebase/addPost';
import { useAuth } from '../contexts/AuthContext';

const CreatePostContainer = styled.div`
  background: var(--gradient-bg);
  padding: 20px;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  margin: 20px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
`;

const Button = styled.button`
  background: var(--primary-color);
  border: none;
  border-radius: 10px;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-size: 1em;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to create a post');
      return;
    }

    const newPost = {
      title,
      content,
      imageUrl,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
    };

    await addPost(newPost);
    setTitle('');
    setContent('');
    setImageUrl('');
  };

  return (
    <CreatePostContainer>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </CreatePostContainer>
  );
};

export default CreatePost;
