
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      toast.success('Account created successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Registration failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container animate-fade-in">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-app-dark-gray mb-2">Let's start!</h1>
          <p className="text-app-gray">Sign up for a free account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray" />
              <input
                type="text"
                placeholder="Your Name"
                className="input-field pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray" />
              <input
                type="email"
                placeholder="Your Email"
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
                placeholder="Your Password"
                className="input-field pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-app-gray" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary mt-8"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-app-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-app-blue font-medium">
              Log in!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
