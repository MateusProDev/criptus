import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, orderBy, query, doc, updateDoc, arrayUnion, increment, setDoc, getDoc } from "firebase/firestore";
import { Container, Typography, Avatar, Box, Paper, IconButton, TextField, Button } from "@mui/material";
import { ThumbUp as ThumbUpIcon, Comment as CommentIcon, Share as ShareIcon, Visibility as VisibilityIcon } from "@mui/icons-material";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [comment, setComment] = useState("");
  const user = auth.currentUser; // Get the current user

  const fetchPosts = useCallback(async () => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const postsData = [];
    querySnapshot.forEach((doc) => {
      postsData.push({ id: doc.id, ...doc.data() });
    });
    setPosts(postsData);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId, e) => {
    e.preventDefault(); // Prevent form submission or page reload

    if (!user) return; // Ensure user is logged in

    const userLikeRef = doc(db, "postLikes", `${user.uid}_${postId}`);
    const postRef = doc(db, "posts", postId);

    // Check if the user has already liked this post
    const userLikeDoc = await getDoc(userLikeRef);
    if (userLikeDoc.exists()) {
      // User has already liked the post
      alert("You have already liked this post.");
      return;
    }

    // Add like to the post
    await updateDoc(postRef, {
      likes: increment(1)
    });

    // Record the like by the user
    await setDoc(userLikeRef, { userId: user.uid });

    fetchPosts();
  };

  const handleShare = (postId, e) => {
    e.preventDefault(); // Prevent form submission or page reload

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const url = `https://example.com/posts/${postId}`; // URL of the post
    const text = `Check out this post: ${post.content}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleComment = async (postId) => {
    if (!user) return; // Ensure user is logged in

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        content: comment,
        author: user.displayName || "Anonymous",
        timestamp: new Date()
      })
    });
    setComment("");
    fetchPosts();
  };

  const handleView = async (postId) => {
    if (!user) return; // Ensure user is logged in

    const userViewRef = doc(db, "postViews", `${user.uid}_${postId}`);
    const postRef = doc(db, "posts", postId);

    // Check if the user has already viewed this post
    const userViewDoc = await getDoc(userViewRef);
    if (userViewDoc.exists()) {
      // User has already viewed the post
      return;
    }

    // Add view to the post
    await updateDoc(postRef, {
      views: increment(1)
    });

    // Record the view by the user
    await setDoc(userViewRef, { userId: user.uid });

    fetchPosts();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Feed</Typography>
      <Box mt={4}>
        {posts.map(post => (
          <Paper key={post.id} style={{ padding: '16px', marginBottom: '16px' }}>
            <Box display="flex" alignItems="center">
              <Avatar src={post.avatar} />
              <Box ml={2}>
                <Typography variant="h6">{post.author}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(post.timestamp.seconds * 1000).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" mt={2}>{post.content}</Typography>
            <Box mt={2} display="flex" alignItems="center">
              <IconButton onClick={(e) => handleLike(post.id, e)} color="primary">
                <ThumbUpIcon /> {post.likes || 0}
              </IconButton>
              <IconButton onClick={(e) => handleShare(post.id, e)} color="primary">
                <ShareIcon /> {post.shares || 0}
              </IconButton>
              <IconButton onClick={() => handleView(post.id)} color="primary">
                <VisibilityIcon /> {post.views || 0}
              </IconButton>
              <IconButton onClick={() => setCurrentPost(post.id)} color="primary">
                <CommentIcon /> {post.comments ? post.comments.length : 0}
              </IconButton>
            </Box>
            {currentPost === post.id && (
              <Box mt={2}>
                <TextField
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button onClick={() => handleComment(post.id)} variant="contained" color="primary">
                  Comment
                </Button>
                <Box mt={2}>
                  {post.comments && post.comments.map((comment, index) => (
                    <Paper key={index} style={{ padding: '8px', marginBottom: '8px' }}>
                      <Typography variant="body2">
                        <strong>{comment.author}</strong> {new Date(comment.timestamp.seconds * 1000).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">{comment.content}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Feed;
