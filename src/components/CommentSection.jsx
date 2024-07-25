// src/components/CommentSection.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { TextField, Button, Avatar, Box, Typography } from "@mui/material";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const user = useSelector(selectUser);

  const fetchComments = async () => {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const commentsData = [];
    querySnapshot.forEach((doc) => {
      commentsData.push({ id: doc.id, ...doc.data() });
    });
    setComments(commentsData);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const sendComment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You need to be logged in to comment.");
      return;
    }

    await addDoc(collection(db, "posts", postId, "comments"), {
      content: input,
      author: user.name,
      avatar: user.avatar,
      timestamp: new Date(),
    });

    setInput("");
    fetchComments();
  };

  return (
    <Box>
      <form onSubmit={sendComment}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">Comment</Button>
      </form>
      {comments.map(comment => (
        <Box key={comment.id} display="flex" alignItems="center" mt={2}>
          <Avatar src={comment.avatar} />
          <Box ml={2}>
            <Typography variant="h6">{comment.author}</Typography>
            <Typography variant="body1">{comment.content}</Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection;
