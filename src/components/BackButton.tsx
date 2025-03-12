
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  className?: string;
};

const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-app-light-gray transition-colors duration-200 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft size={22} className="text-app-dark-gray" />
    </button>
  );
};

export default BackButton;
