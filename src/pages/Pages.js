

import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import SearchPage from '../pages/SearchPage';
import FollowsPage from '../pages/FollowsPage';
import ProfilePage from '../pages/ProfilePage';
import ProfileUserPage from '../pages/ProfileUserPage';
import Error404 from '../components/Error404';
import ChatMessagePage from '../pages/ChatMessagePage';
import ListUser from '../pages/PageAdmin/ListUsers';
import Dashboard from '../pages/PageAdmin/Dashboard';
import Email from '../pages/PageAdmin/ListEmail';
import Charts from '../pages/PageAdmin/Charts';

function Pages() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      if (token && role) {
        setIsLoggedIn(true);
        setUserRole(role);
      }
    };

    checkToken();
  }, []);

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/search-results" element={<SearchPage />} />
        <Route path="/followers-page" element={<FollowsPage />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfileUserPage />} />
        <Route path="/error@404" element={<Error404 />} />
        <Route path="/chat" element={<ChatMessagePage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/listUser" element={<ListUser />} />
        <Route path="/email" element={<Email />} />
        <Route path="/charts" element={<Charts />} />

        {isLoggedIn ? (
          userRole === 'ADMIN' ? (
            <Route path="/" element={<Navigate to="/Dashboard" replace={true} />} />
          ) : (
            <Route path="/" element={<Navigate to="/home" replace={true} />} />
          )
        ) : (
          <Route path="/" element={<Navigate to="/login" replace={true} />} />
        )}
      </Routes>
  );
}

export default Pages;

// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold text-center text-red-600">
//       Hello world!
//     </h1>
//   )
// }