import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-center text-gray-600">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
