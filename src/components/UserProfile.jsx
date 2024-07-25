import React, { useState, useEffect } from 'react';
import { auth, db, logout } from '../firebase/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import Avatar from 'react-avatar';
import btcIcon from 'cryptocurrency-icons/svg/color/btc.svg';
import ethIcon from 'cryptocurrency-icons/svg/color/eth.svg';
import ltcIcon from 'cryptocurrency-icons/svg/color/ltc.svg';
import xrpIcon from 'cryptocurrency-icons/svg/color/xrp.svg';
import adaIcon from 'cryptocurrency-icons/svg/color/ada.svg';

const ProfileContainer = styled.div`
  background: linear-gradient(145deg, #1f1c2c, #928dab);
  border-radius: 15px;
  box-shadow: 20px 20px 60px #14121b, -20px -20px 60px #2e2a3e;
  color: white;
  padding: 20px;
  margin: 20px;
  max-width: 400px;
  margin: 50px auto;
`;

const ProfileForm = styled.form`
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

const AvatarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const AvatarOption = styled.div`
  cursor: pointer;
  border: ${props => (props.selected ? '2px solid #00c6ff' : '2px solid transparent')};
  border-radius: 50%;
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

const avatars = [btcIcon, ethIcon, ltcIcon, xrpIcon, adaIcon];

const UserProfile = () => {
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName);
          setSelectedAvatar(userData.photoURL);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName,
        photoURL: selectedAvatar,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile: ', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <ProfileContainer>
      <h2>Update Profile</h2>
      <ProfileForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
        <AvatarContainer>
          {avatars.map((avatar, index) => (
            <AvatarOption key={index} onClick={() => setSelectedAvatar(avatar)} selected={selectedAvatar === avatar}>
              <Avatar src={avatar} size="50" round />
            </AvatarOption>
          ))}
        </AvatarContainer>
        <Button type="submit">Update Profile</Button>
      </ProfileForm>
      <Button onClick={handleLogout}>Logout</Button>
    </ProfileContainer>
  );
};

export default UserProfile;
