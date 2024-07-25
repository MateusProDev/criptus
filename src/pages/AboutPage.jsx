// src/pages/AboutPage.jsx

import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  background: linear-gradient(145deg, #1f1c2c, #928dab);
  border-radius: 15px;
  box-shadow: 20px 20px 60px #14121b, -20px -20px 60px #2e2a3e;
  color: white;
  padding: 20px;
  margin: 20px;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
`;

const AboutTitle = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const AboutContent = styled.p`
  font-size: 1.2em;
  line-height: 1.6;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <AboutTitle>About Criptus</AboutTitle>
      <AboutContent>
        Welcome to Criptus, the premier community for cryptocurrency investors and enthusiasts. Here, you can share information, stay updated on the latest trends, and connect with like-minded individuals. Our goal is to provide a platform where users can engage, learn, and grow in the world of digital currencies.
      </AboutContent>
      <AboutContent>
        Join us in exploring the exciting world of cryptocurrencies. Share your insights, post updates, and interact with other members of the community. Together, we can navigate the ever-evolving landscape of digital finance.
      </AboutContent>
    </AboutContainer>
  );
};

export default AboutPage;
