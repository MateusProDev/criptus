// src/components/Comments.jsx

import React, { useState } from 'react';
import styled from 'styled-components';

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const CommentInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: none;
  margin-bottom: 10px;
  font-size: 1em;
`;

const CommentButton = styled.button`
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

const CommentListContainer = styled.div`
  margin-top: 20px;
`;

const Comment = styled.li`
  background: #2f2c4b;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  color: white;
  list-style: none;
`;

const CommentList = ({ postId, comments, onComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
    }
  };

  return (
    <CommentListContainer>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <Comment key={index}>{comment}</Comment>
        ))}
      </ul>
      <CommentForm onSubmit={handleCommentSubmit}>
        <CommentInput
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <CommentButton type="submit">Comment</CommentButton>
      </CommentForm>
    </CommentListContainer>
  );
};

export default CommentList;
