
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import SearchPage from './SearchPage';
import FollowsPage from './FollowsPage';
import ProfilePage from './ProfilePage';
import ProfileUserPage from './ProfileUserPage';
import Error404 from '../components/Error404';
import ChatMessagePage from './ChatMessagePage';
import ListUser from './PageAdmin/ListUsers';
import Dashboard from './PageAdmin/Dashboard';
import Email from './PageAdmin/ListEmail';
import Charts from './PageAdmin/Charts';

function Pages() {

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

        <Route path="/" element={<Navigate to="/login" replace={true} />} />
      </Routes>
  );
}

export default Pages;
