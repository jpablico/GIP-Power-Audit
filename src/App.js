import React from 'react';
import DataCenterPowerAudit from './scripts/DataCenterPowerAudit';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-oragne-500 text-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Global IP Power Audit Tool</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <DataCenterPowerAudit />
        </div>
      </main>
    </div>
  );
}

export default App;