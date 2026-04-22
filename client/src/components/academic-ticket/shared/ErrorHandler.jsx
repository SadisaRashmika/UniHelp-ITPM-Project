import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorHandler = ({ error, onClose, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 bg-red-50 rounded-md p-1.5 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorHandler;
