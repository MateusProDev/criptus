import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login } from "../features/userSlice";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, getDocs, orderBy, query, updateDoc, doc, arrayUnion, increment } from "firebase/firestore";
import { TextField, Button, Avatar, Container, Typography, Grid, Box, Paper, IconButton } from "@mui/material";
import { ThumbUp as ThumbUpIcon, Comment as CommentIcon, Share as ShareIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { FaBitcoin, FaEthereum } from "react-icons/fa";

const Profile = ({ history }) => {
  const user = useSelector(selectUser);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [currentPost, setCurrentPost] = useState(null);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const updateProfile = async () => {
    const userRef = doc(db, "users", user.email);

    await updateDoc(userRef, {
      name: name,
      avatar: avatar
    });

    dispatch(login({
      name,
      avatar,
      email: user.email,
    }));

    await auth.currentUser.updateProfile({
      displayName: name,
      photoURL: avatar,
    });
  };

  const fetchPosts = useCallback(async () => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const postsData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().authorEmail === user.email) {
        postsData.push({ id: doc.id, ...doc.data() });
      }
    });
    setPosts(postsData);
  }, [user.email]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const sendPost = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts"), {
      content: input,
      author: user.name,
      avatar: user.avatar,
      timestamp: new Date(),
      authorEmail: user.email,
      likes: 0,
      shares: 0,
      views: 0,
      comments: []  // Inicialize como array vazio
    });

    setInput("");
    fetchPosts();
  };

  const handleLike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
    fetchPosts();
  };

  const handleShare = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      shares: increment(1)
    });
    fetchPosts();
  };

  const handleComment = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        content: comment,
        author: user.name,
        timestamp: new Date()
      })
    });
    setComment("");
    fetchPosts();
  };

  const handleView = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: increment(1)
    });
    fetchPosts();
  };

  const avatars = [
    { component: <FaBitcoin size={40} />, value: 'https://example.com/bitcoin.png' }, // Bitcoin
    { component: <FaEthereum size={40} />, value: 'https://example.com/ethereum.png' }, // Ethereum
  ];

  return (
    <Container>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => history.push('/feed')} color="primary">
          {/* Removido ArrowBackIcon, pois não está sendo usado */}
        </IconButton>
        <Typography variant="h4" gutterBottom style={{ flexGrow: 1 }}>Profile</Typography>
      </Box>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Name"
        fullWidth
        margin="normal"
      />
      <Typography variant="h6" gutterBottom>Choose an Avatar</Typography>
      <Grid container spacing={2}>
        {avatars.map((avatar, index) => (
          <Grid item key={index} onClick={() => setAvatar(avatar.value)}>
            <Avatar>
              {avatar.component}
            </Avatar>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={updateProfile} style={{ marginTop: '16px' }}>Update Profile</Button>
      <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>Your Posts</Typography>
      <form onSubmit={sendPost}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's happening?"
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">Post</Button>
      </form>
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
              <IconButton onClick={() => handleLike(post.id)} color="primary">
                <ThumbUpIcon /> {post.likes}
              </IconButton>
              <IconButton onClick={() => handleShare(post.id)} color="primary">
                <ShareIcon /> {post.shares}
              </IconButton>
              <IconButton onClick={() => handleView(post.id)} color="primary">
                <VisibilityIcon /> {post.views}
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

export default Profile;
