
import React from 'react';
import { useAuth } from '@/context/AuthContext';

type UserAvatarProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
};

const UserAvatar = ({ size = 'md', className = '', onClick }: UserAvatarProps) => {
  const { user } = useAuth();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  
  // Get initials from user name
  const getInitials = () => {
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div 
      className={`rounded-full bg-app-blue flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
    >
      {getInitials()}
    </div>
  );
};

export default UserAvatar;
