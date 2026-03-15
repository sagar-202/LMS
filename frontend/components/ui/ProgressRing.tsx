'use client';

import React from 'react';

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export default function ProgressRing({ 
    percentage, 
    size = 48, 
    strokeWidth = 4,
    className = "" 
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-gray-100 dark:text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ 
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
                    }}
                    strokeLinecap="round"
                    className="text-blue-600 dark:text-blue-400"
                />
            </svg>
            <span className="absolute text-[10px] font-black text-gray-900 dark:text-white">
                {Math.round(percentage)}%
            </span>
        </div>
    );
}
