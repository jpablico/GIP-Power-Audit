import React from 'react';
import CabinetTableView from './CabinetTableView';
import CabinetCardView from './CabinetCardView';

const CabinetList = ({ randomizedCabinets, updatePduPower, markAsChecked, selectedPhase }) => {
  const pduCount = selectedPhase?.pduCount || 4;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Cabinets To Check</h2>
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <CabinetTableView 
            cabinets={randomizedCabinets}
            updatePduPower={updatePduPower}
            markAsChecked={markAsChecked}
            pduCount={pduCount}
          />
        </div>
        
        <div className="md:hidden space-y-4">
          <CabinetCardView 
            cabinets={randomizedCabinets}
            updatePduPower={updatePduPower}
            markAsChecked={markAsChecked}
            pduCount={pduCount}
          />
        </div>
      </div>
    </div>
  );
};

export default CabinetList;