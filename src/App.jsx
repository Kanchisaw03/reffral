import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import React from 'react';

const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;
