
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to home
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-light-blue">
      <div className="text-center animate-pulse-soft">
        <h1 className="text-4xl font-bold text-app-blue mb-4">MedRemind</h1>
        <p className="text-app-gray">Your personal medication reminder</p>
      </div>
    </div>
  );
};

export default Index;
