import React from 'react';

const CabinetTableView = ({ cabinets, updatePduPower, markAsChecked, pduCount = 4 }) => {
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
    // Only check PDUs that have an ID
    return pdus.every(pdu => !pdu.id || pdu.power);
  };

  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="py-2 px-3 text-left">Cabinet ID</th>
          {Array.from({ length: pduCount }).map((_, idx) => (
            <th key={`pdu-header-${idx}`} className="py-2 px-3 text-left">PDU {idx + 1}</th>
          ))}
          <th className="py-2 px-3 text-left">Total Power</th>
          <th className="py-2 px-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {cabinets.map(cabinet => {
          const totalPower = calculateTotalPower(cabinet.pdus);
          return (
            <tr key={cabinet.id} className={cabinet.checked ? "bg-green-50" : ""}>
              <td className="py-2 px-3 border-b font-medium">{cabinet.id}</td>
              {Array.from({ length: pduCount }).map((_, idx) => (
                <td key={`pdu-${cabinet.id}-${idx}`} className="py-2 px-3 border-b">
                  {cabinet.pdus[idx] && cabinet.pdus[idx].id ? (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">{cabinet.pdus[idx].id}</div>
                      <input 
                        type="number" 
                        value={cabinet.pdus[idx].power} 
                        onChange={(e) => updatePduPower(cabinet.id, idx, e.target.value)}
                        className="w-full p-1 border rounded"
                        placeholder="A"
                        step="0.1"
                        min="0"
                        disabled={cabinet.checked}
                      />
                    </div>
                  ) : null}
                </td>
              ))}
              <td className="py-2 px-3 border-b font-medium">{totalPower} A</td>
              <td className="py-2 px-3 border-b">
                {!cabinet.checked ? (
                  <button 
                    onClick={() => markAsChecked(cabinet.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={!hasAllRequiredPduValues(cabinet.pdus)}
                  >
                    Complete
                  </button>
                ) : (
                  <span className="text-green-600">✓ Completed</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CabinetTableView;