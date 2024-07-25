import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

const addPost = async (post) => {
  try {
    await addDoc(collection(db, 'posts'), {
      ...post,
      createdAt: Timestamp.now(),
      likes: 0,
      comments: [],
      views: 0,
    });
  } catch (error) {
    console.error('Error adding post: ', error);
  }
};

export default addPost;
