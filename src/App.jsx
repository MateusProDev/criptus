import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';  // Certifique-se de que o caminho está correto
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
 
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute component={UserProfile} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ component: Component }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Component /> : <Navigate to="/login" />;
};

export default App;

// dvd
