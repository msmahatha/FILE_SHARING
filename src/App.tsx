import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/auth-form';
import { Dashboard } from './components/dashboard/dashboard';
import { ThemeToggle } from './components/theme-toggle';
import { AnimatedBackground } from './components/animated-background';

function App() {
  return (
    <Router>
      <AnimatedBackground />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<AuthForm mode="login" />} />
        <Route path="/register" element={<AuthForm mode="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;