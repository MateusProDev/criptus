import React from 'react';
import CreatePost from './CreatePost';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Dashboard = () => (
  <DashboardContainer>
    <h1>Dashboard</h1>
    <CreatePost />
  </DashboardContainer>
);

export default Dashboard;
