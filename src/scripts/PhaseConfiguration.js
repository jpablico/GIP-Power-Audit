import React, { useState } from 'react';

const PhaseConfiguration = ({ 
  phases, 
  auditDate, 
  auditorName, 
  setAuditDate, 
  setAuditorName,
  cabinets,
  auditTime,
  setAuditTime
}) => {
  const getCabinetCount = (phaseId) => {
    const phaseData = cabinets.find(p => p.phaseId === phaseId);
    return phaseData ? phaseData.cabinets.length : 0;
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Audit Date</label>
          <input 
            type="date" 
            value={auditDate} 
            onChange={(e) => setAuditDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Time</label>
          <select
            value={auditTime}
            onChange={(e) => setAuditTime(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="02:00">2:00 AM</option>
            <option value="06:00">6:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="14:00">2:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="22:00">10:00 PM</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Auditor Name</label>
          <input 
            type="text" 
            value={auditorName} 
            onChange={(e) => setAuditorName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>
      </div>
      
      <h3 className="font-medium mb-2">Phase Information</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-3 text-left">Phase Name</th>
              <th className="py-2 px-3 text-left">PDUs per Cabinet</th>
              <th className="py-2 px-3 text-left">Cabinet Count</th>
            </tr>
          </thead>
          <tbody>
            {phases.map(phase => (
              <tr key={phase.id}>
                <td className="py-2 px-3 border-b">{phase.name}</td>
                <td className="py-2 px-3 border-b">{phase.pduCount}</td>
                <td className="py-2 px-3 border-b">{getCabinetCount(phase.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhaseConfiguration;