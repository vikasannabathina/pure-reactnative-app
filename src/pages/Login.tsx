
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/home');
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container animate-fade-in">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-app-dark-gray mb-2">Welcome Back!</h1>
          <p className="text-app-gray">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray" />
              <input
                type="email"
                placeholder="Enter your Email"
                className="input-field pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray" />
              <input
                type="password"
                placeholder="Enter your Password"
                className="input-field pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary mt-8"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-app-gray">
            Don't have an account?{' '}
            <Link to="/signup" className="text-app-blue font-medium">
              Sign up!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
