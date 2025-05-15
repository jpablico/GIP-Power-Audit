import React from 'react';

const CabinetCardView = ({ cabinets, updatePduPower, markAsChecked, pduCount }) => {
  const calculateTotalPower = (pdus) => {
    let total = 0;
    pdus.forEach(pdu => {
      if (pdu.power) {
        total += parseFloat(pdu.power) || 0;
      }
    });
    return total > 0 ? total.toFixed(2) : '-';
  };

  const hasAllRequiredPduValues = (pdus) => {
    return pdus.every(pdu => !pdu.id || pdu.power);
  };

  return (
    <>
      {cabinets.map(cabinet => {
        const totalPower = calculateTotalPower(cabinet.pdus);
        
        return (
          <div 
            key={cabinet.id} 
            className={`border rounded-lg p-3 shadow-sm ${cabinet.checked ? "bg-green-50 border-green-200" : "bg-white"}`}
          >
            <div className="font-medium text-lg mb-3">{cabinet.id}</div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {cabinet.pdus.slice(0, pduCount).map((pdu, idx) => (
                pdu.id ? (
                  <div key={`pdu-${cabinet.id}-${idx}`}>
                    <label className="block text-sm text-gray-600 mb-1">
                      PDU {idx + 1}: {pdu.id}
                    </label>
                    <input 
                      type="number" 
                      value={pdu.power} 
                      onChange={(e) => updatePduPower(cabinet.id, idx, e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Power (A)"
                      step="0.1"
                      min="0"
                      disabled={cabinet.checked}
                    />
                  </div>
                ) : null
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="font-medium">
                Total: <span className="text-lg">{totalPower} A</span>
              </div>
              
              {!cabinet.checked ? (
                <button 
                  onClick={() => markAsChecked(cabinet.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  disabled={!hasAllRequiredPduValues(cabinet.pdus)}
                >
                  Complete
                </button>
              ) : (
                <span className="text-green-600 font-medium">✓ Completed</span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CabinetCardView;