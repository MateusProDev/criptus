import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Post from './Post';
import styled from 'styled-components';

const PostListContainer = styled.div`
  padding: 20px;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    };

    fetchPosts();
  }, []);

  return (
    <PostListContainer>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </PostListContainer>
  );
};

export default PostList;
