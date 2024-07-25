import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc, Timestamp, getDoc, doc as firestoreDoc } from 'firebase/firestore';
import { uploadImage } from '../utils/imageUpload';
import styled from 'styled-components';

const CreatePostContainer = styled.div`
  background: linear-gradient(145deg, #1f1c2c, #928dab);
  border-radius: 15px;
  box-shadow: 20px 20px 60px #14121b, -20px -20px 60px #2e2a3e;
  color: white;
  padding: 20px;
  margin: 20px 0;
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-bottom: 10px;
  font-size: 1em;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-bottom: 10px;
  font-size: 1em;
`;

const Button = styled.button`
  background: #00c6ff;
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
  const [image, setImage] = useState(null);
  const [authorAvatar, setAuthorAvatar] = useState('');

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(firestoreDoc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setAuthorAvatar(userDoc.data().photoURL);
        }
      }
    };
    fetchUserAvatar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        let imageUrl = '';
        if (image) {
          imageUrl = await uploadImage(image, 'posts');
        }
        await addDoc(collection(db, 'posts'), {
          title,
          content,
          imageUrl,
          authorName: auth.currentUser.displayName,
          authorPhoto: authorAvatar,
          createdAt: Timestamp.fromDate(new Date()),
          authorId: auth.currentUser.uid,
        });
        setTitle('');
        setContent('');
        setImage(null);
        alert('Post created successfully!');
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      alert('User not authenticated');
    }
  };

  return (
    <CreatePostContainer>
      <h2>Create Post</h2>
      <PostForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <Input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button type="submit">Post</Button>
      </PostForm>
    </CreatePostContainer>
  );
};

export default CreatePost;
