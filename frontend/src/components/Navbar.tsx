import React from 'react';
import { Clock } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-500" />
            <span className="ml-2 text-xl font-semibold text-white">CronMaster</span>
          </div>
          <div className="flex items-center">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar