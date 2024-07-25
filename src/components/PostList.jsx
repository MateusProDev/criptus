// src/components/PostList.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) {
        console.warn('User not authenticated');
        return;
      }

      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        const postsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchPosts();
  }, [currentUser]);

  return (
    <div>
      <h1>Feed</h1>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
