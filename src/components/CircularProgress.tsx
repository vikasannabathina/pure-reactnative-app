
import React from 'react';

type CircularProgressProps = {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  bgColor?: string;
  color?: string;
  labelSize?: number;
  showLabel?: boolean;
  label?: string;
};

const CircularProgress = ({
  value,
  max,
  size = 160,
  strokeWidth = 10,
  className = '',
  bgColor = 'rgba(229, 231, 235, 0.3)',
  color = '#33C3F0',
  labelSize = 48,
  showLabel = true,
  label = 'INTAKES'
}: CircularProgressProps) => {
  // Calculate properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={value > 0 ? (value === max ? '#4CD964' : color) : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Text in center */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-app-gray text-sm mb-1">{label}</span>
          <div className="flex items-baseline">
            <span className="text-app-blue font-bold" style={{ fontSize: labelSize / 2 }}>{value}</span>
            <span className="text-app-gray mx-1">/</span>
            <span className="text-app-gray font-medium" style={{ fontSize: labelSize / 2 }}>{max}</span>
          </div>
          <span className="text-app-gray text-xs mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
