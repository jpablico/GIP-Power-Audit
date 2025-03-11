import React from 'react';

const AuditProgress = ({ completionPercentage, completedCount, totalCount, exportToCSV }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Audit Progress</h2>
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-center mt-1">
          {completionPercentage}% Complete ({completedCount} of {totalCount})
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={exportToCSV}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full md:w-auto"
        >
          Export Data to CSV
        </button>
      </div>
    </div>
  );
};

export default AuditProgress;