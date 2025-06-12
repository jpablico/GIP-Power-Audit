import React, { useState } from 'react';
import Papa from 'papaparse';
import cabinetData from '../data/cabinetData.json';
import PhaseConfiguration from './PhaseConfiguration';
import AuditSetup from './AuditSetup';
import AuditProgress from './AuditProgress';
import CabinetList from './CabinetList';

const DataCenterPowerAudit = () => {
  const [phases] = useState(cabinetData.phases.map(phase => ({
    id: phase.phaseId,
    name: phase.name,
    pduCount: phase.pduCount
  })));

  const [cabinets] = useState(cabinetData.phases.map(phase => ({
    phaseId: phase.phaseId,
    cabinets: phase.cabinets
  })));
  
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [samplingPercentage, setSamplingPercentage] = useState(30);
  const [randomizedCabinets, setRandomizedCabinets] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  const [auditorName, setAuditorName] = useState('');
  
  const randomizeCabinets = () => {
    const phaseData = cabinets.find(p => p.phaseId === selectedPhase);
    if (!phaseData || !phaseData.cabinets || phaseData.cabinets.length === 0) {
      console.error("No cabinets found for the selected phase");
      return;
    }
    
    const boundedSamplingPercentage = Math.min(Math.max(1, samplingPercentage), 100);
    
    const phaseCabinets = phaseData.cabinets;
    const sampleSize = Math.min(
      Math.ceil(phaseCabinets.length * (boundedSamplingPercentage / 100)),
      phaseCabinets.length
    );
    
    const shuffled = [...phaseCabinets];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selected = shuffled.slice(0, sampleSize);
    const existingAuditMap = new Map();
    auditData.forEach(item => {
      existingAuditMap.set(item.id, true);
    });
    
    const newRandomized = selected.map(cab => ({
      ...cab,
      checked: false,
      pdus: cab.pdus.map(pdu => ({ ...pdu, power: '' }))
    }));
    
    const currentPhaseName = phases.find(p => p.id === selectedPhase)?.name || `Phase ${selectedPhase}`;
    const newAuditEntries = selected
      .filter(cab => !existingAuditMap.has(cab.id))
      .map(cab => ({
        id: cab.id,
        phase: currentPhaseName,
        pdus: cab.pdus.map(pdu => ({ id: pdu.id || "", power: '' })),
        date: auditDate,
        auditor: auditorName,
        checked: false
      }));
    
    setRandomizedCabinets(newRandomized);
    setAuditData(prev => [...prev, ...newAuditEntries]);
  };
  
  const updatePduPower = (cabinetId, pduIndex, value) => {
    setAuditData(prevData => 
      prevData.map(item => 
        item.id === cabinetId 
          ? { 
              ...item, 
              pdus: item.pdus.map((pdu, idx) => 
                idx === pduIndex ? { ...pdu, power: value } : pdu
              ) 
            } 
          : item
      )
    );
    
    setRandomizedCabinets(prevCabs => 
      prevCabs.map(cab => 
        cab.id === cabinetId 
          ? { 
              ...cab, 
              pdus: cab.pdus.map((pdu, idx) => 
                idx === pduIndex ? { ...pdu, power: value } : pdu
              ) 
            } 
          : cab
      )
    );
  };
  
  const markAsChecked = (cabinetId) => {
    setAuditData(prevData => 
      prevData.map(item => 
        item.id === cabinetId 
          ? { ...item, checked: true } 
          : item
      )
    );
    
    setRandomizedCabinets(prevCabs => 
      prevCabs.map(cab => 
        cab.id === cabinetId 
          ? { ...cab, checked: true } 
          : cab
      )
    );
  };

  const exportToCSV = () => {
    const csvData = auditData.map(item => {
      const baseData = {
        'Cabinet ID': item.id,
        'Phase': item.phase,
        'Date': item.date,
        'Auditor': item.auditor,
        'Checked': item.checked ? 'Yes' : 'No'
      };

      const phase = phases.find(p => p.name === item.phase);
      const pduCount = phase ? phase.pduCount : 4; 
      
      let totalPower = 0;
      for (let i = 0; i < pduCount; i++) {
        const pdu = item.pdus[i] || { id: '', power: '' };
        baseData[`PDU ${i+1} ID`] = pdu.id;
        baseData[`PDU ${i+1} Power (kW)`] = pdu.power;
        
        if (pdu.power) {
          totalPower += parseFloat(pdu.power) || 0;
        }
      }
      
      baseData['Total Power (kW)'] = totalPower > 0 ? totalPower.toFixed(2) : '';
      
      return baseData;
    });
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `power-audit-${auditDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completionPercentage = randomizedCabinets.length > 0 
    ? Math.round((randomizedCabinets.filter(cab => cab.checked).length / randomizedCabinets.length) * 100) 
    : 0;
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Data Center Power Audit Tool</h1>
      <div className="text-sm text-gray-500 text-center mb-6">Phase-based PDU power audit system</div>
      
      <PhaseConfiguration 
        phases={phases}
        auditDate={auditDate}
        auditorName={auditorName}
        setAuditDate={setAuditDate}
        setAuditorName={setAuditorName}
        cabinets={cabinets}
      />
      
      <AuditSetup 
        phases={phases}
        selectedPhase={selectedPhase}
        samplingPercentage={samplingPercentage}
        setSelectedPhase={setSelectedPhase}
        setSamplingPercentage={setSamplingPercentage}
        randomizeCabinets={randomizeCabinets}
        cabinets={cabinets}
      />
      
      {randomizedCabinets.length > 0 && (
        <AuditProgress 
          completionPercentage={completionPercentage} 
          completedCount={randomizedCabinets.filter(cab => cab.checked).length}
          totalCount={randomizedCabinets.length}
          exportToCSV={exportToCSV}
        />
      )}
      
      {randomizedCabinets.length > 0 && (
        <CabinetList 
          randomizedCabinets={randomizedCabinets}
          updatePduPower={updatePduPower}
          markAsChecked={markAsChecked}
          selectedPhase={phases.find(p => p.id === selectedPhase)}
        />
      )}
    </div>
  );
};

export default DataCenterPowerAudit;