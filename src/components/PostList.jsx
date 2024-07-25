import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';

const PostContainer = styled.div`
  background: linear-gradient(145deg, #1f1c2c, #928dab);
  border-radius: 15px;
  box-shadow: 20px 20px 60px #14121b, -20px -20px 60px #2e2a3e;
  color: white;
  padding: 20px;
  margin: 20px 0;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsList = querySnapshot.docs.map(doc => doc.data());
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {posts.map((post, index) => {
          const postDate = post.timestamp ? new Date(post.timestamp.seconds * 1000) : new Date();
          return (
            <PostContainer key={index}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>Posted on: {postDate.toDateString()}</p>
              <p>Views: {post.views || 0}</p>
              <p>Likes: {post.likes || 0}</p>
              <p>Comments: {post.comments?.length || 0}</p>
            </PostContainer>
          );
        })}
      </div>
    </div>
  );
};

export default PostList;
