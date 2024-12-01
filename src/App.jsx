import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuotation from './pages/CreateQuotation';
import ViewQuotation from './pages/ViewQuotation';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Quotations from './pages/Quotations';
import EditQuotation from './pages/EditQuotation';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BURL}/validate-token`, { credentials: 'include' })
      .then((response) => {
        if (response.status === 201) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      })
      .catch(() => setIsValid(false));
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>; 
  }

  return isValid ? children : <Navigate to="/login" replace />;
};

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register theme={theme} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="/quotations" element={
          <ProtectedRoute>
            <Quotations />
          </ProtectedRoute>
        } />
        <Route path="/create-quotation" element={
          <ProtectedRoute>
            <CreateQuotation theme={theme} />
          </ProtectedRoute>
        } />
        <Route path="/view-quotation/:id" element={
          <ProtectedRoute>
            <ViewQuotation theme={theme} />
          </ProtectedRoute>
        } />
        <Route path="/edit-quotation/:id" element={
          <ProtectedRoute>
            <EditQuotation theme={theme} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;

