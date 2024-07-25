import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { WhatsappShareButton } from 'react-share';

const PostContainer = styled.div`
  background: linear-gradient(145deg, #1f1c2c, #928dab);
  border-radius: 15px;
  box-shadow: 20px 20px 60px #14121b, -20px -20px 60px #2e2a3e;
  color: white;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AuthorPhoto = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const PostImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-top: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const Icon = styled.div`
  cursor: pointer;
  font-size: 1.5em;
`;

const CommentContainer = styled.div`
  margin-top: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
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

const Comment = ({ comment, onReply }) => {
  const [reply, setReply] = useState('');
  return (
    <div>
      <p>{comment.text}</p>
      <CommentInput
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Reply to this comment"
      />
      <CommentButton onClick={() => onReply(comment, reply)}>Reply</CommentButton>
      {comment.replies && comment.replies.map((reply, index) => (
        <div key={index} style={{ marginLeft: '20px' }}>
          <p>{reply}</p>
        </div>
      ))}
    </div>
  );
};

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (auth.currentUser) {
        const postRef = doc(db, 'posts', post.id);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          if (postData.likedBy && postData.likedBy.includes(auth.currentUser.uid)) {
            setHasLiked(true);
          }
        }
      }
    };
    checkIfLiked();
  }, [post.id]);

  const handleLike = async () => {
    if (hasLiked) return;
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      likes: likes + 1,
      likedBy: arrayUnion(auth.currentUser.uid),
    });
    setLikes(likes + 1);
    setHasLiked(true);
  };

  const handleComment = async () => {
    if (newComment.trim() === '') return;
    const postRef = doc(db, 'posts', post.id);
    const comment = {
      text: newComment,
      authorName: auth.currentUser.displayName,
      authorPhoto: auth.currentUser.photoURL,
      replies: [],
    };
    await updateDoc(postRef, { comments: arrayUnion(comment) });
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleReply = async (comment, reply) => {
    if (reply.trim() === '') return;
    const postRef = doc(db, 'posts', post.id);
    const updatedComments = comments.map((c) => {
      if (c.text === comment.text && c.authorName === comment.authorName) {
        return { ...c, replies: [...c.replies, reply] };
      }
      return c;
    });
    await updateDoc(postRef, { comments: updatedComments });
    setComments(updatedComments);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <PostContainer>
      <AuthorInfo>
        <AuthorPhoto src={post.authorPhoto} alt={post.authorName} />
        <p>{post.authorName}</p>
      </AuthorInfo>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
      <IconContainer>
        <Icon onClick={handleLike}>
          <FaHeart color={hasLiked ? 'red' : 'white'} /> {likes}
        </Icon>
        <Icon onClick={handleToggleComments}>
          <FaComment /> {comments.length}
        </Icon>
        <Icon>
          <WhatsappShareButton url={window.location.href}>
            <FaShare />
          </WhatsappShareButton>
        </Icon>
      </IconContainer>
      {showComments && (
        <CommentContainer>
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} onReply={handleReply} />
          ))}
          <CommentInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <CommentButton onClick={handleComment}>Comment</CommentButton>
        </CommentContainer>
      )}
    </PostContainer>
  );
};

export default Post;
