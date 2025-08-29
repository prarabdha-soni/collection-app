import React from 'react';

interface AuthScreenTempProps {
  onLogin: () => void;
}

export default function AuthScreenTemp({ onLogin }: AuthScreenTempProps) {
  return (
    <div className="flex-1 flex justify-center items-center p-5 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          FOS Field Hero
        </h1>
        <p className="text-base text-center mb-10 text-gray-500">
          Sign in to continue
        </p>
        
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Email input would go here in a real implementation */}
            <span className="text-base text-gray-400">Email</span>
          </div>
          
          <div className="border border-gray-300 rounded-lg p-4">
            {/* Password input would go here in a real implementation */}
            <span className="text-base text-gray-400">Password</span>
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors"
            onClick={onLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}