import React from 'react';

const AuditSetup = ({ 
  phases, 
  selectedPhase, 
  samplingPercentage, 
  setSelectedPhase, 
  setSamplingPercentage, 
  randomizeCabinets,
  cabinets
}) => {
  const getCabinetCount = (phaseId) => {
    const phaseData = cabinets.find(p => p.phaseId === phaseId);
    return phaseData ? phaseData.cabinets.length : 0;
  };

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Audit Setup</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Select Phase</label>
          <select 
            value={selectedPhase} 
            onChange={(e) => setSelectedPhase(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {phases.map(phase => (
              <option key={phase.id} value={phase.id}>
                {phase.name} ({getCabinetCount(phase.id)} cabinets)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Sampling Percentage (%)</label>
          <input 
            type="number" 
            value={samplingPercentage} 
            onChange={(e) => setSamplingPercentage(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
            max="100"
          />
        </div>
      </div>
      
      <button 
        onClick={randomizeCabinets}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full md:w-auto"
      >
        Generate Random Cabinet Selection
      </button>
    </div>
  );
};

export default AuditSetup;