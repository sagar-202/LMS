'use client';

import React from 'react';

interface SubjectProgressBarProps {
    percent: number;
    completed: number;
    total: number;
}

export default function SubjectProgressBar({ percent, completed, total }: SubjectProgressBarProps) {
    return (
        <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-800">
                    Progress: <span className="text-blue-600">{completed} / {total}</span> lessons completed
                </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full bg-blue-600 transition-all duration-700 ease-out rounded-full shadow-sm"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
