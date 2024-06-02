// file App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SearchPage from './pages/SearchPage';
import FollowsPage from './pages/FollowsPage';
import ProfilePage from './pages/ProfilePage';
import ProfileUserPage from './pages/ProfileUserPage';
import Error404 from './components/Error404';
import ChatMessagePage from './pages/ChatMessagePage';
import ListUser from './pages/PageAdmin/ListUsers';
import Dashboard from './pages/PageAdmin/Dashboard';
import Email from './pages/PageAdmin/ListEmail';
import Charts from './pages/PageAdmin/Charts';

function App() {
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
    React.createElement(BrowserRouter, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: "/login", element: React.createElement(LoginPage) }),
        React.createElement(Route, { path: "/home", element: React.createElement(HomePage) }),
        React.createElement(Route, { path: "/register", element: React.createElement(RegisterPage) }),
        React.createElement(Route, { path: "/forgotpassword", element: React.createElement(ForgotPasswordPage) }),
        React.createElement(Route, { path: "/search-results", element: React.createElement(SearchPage) }),
        React.createElement(Route, { path: "/followers-page", element: React.createElement(FollowsPage) }),
        React.createElement(Route, { path: "/profile-page", element: React.createElement(ProfilePage) }),
        React.createElement(Route, { path: "/profile/:userId", element: React.createElement(ProfileUserPage) }),
        React.createElement(Route, { path: "/error@404", element: React.createElement(Error404) }),
        React.createElement(Route, { path: "/chat", element: React.createElement(ChatMessagePage) }),
        React.createElement(Route, { path: "/Dashboard", element: React.createElement(Dashboard) }),
        React.createElement(Route, { path: "/listUser", element: React.createElement(ListUser) }),
        React.createElement(Route, { path: "/email", element: React.createElement(Email) }),
        React.createElement(Route, { path: "/charts", element: React.createElement(Charts) }),

        isLoggedIn ? (
          userRole === 'ADMIN' ? (
            React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/Dashboard", replace: true }) })
          ) : (
            React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/home", replace: true }) })
          )
        ) : (
          React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/login", replace: true }) })
        )
      )
    )
  );
}

export default App;



// export default function App() {
//   return (
//     <h1 className="text-3xl font-bold text-center text-red-600">
//       Hello world!
//     </h1>
//   )
// }