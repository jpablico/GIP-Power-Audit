import cabinetData from '../../data/cabinetData.json';

describe('Cabinet Data Structure', () => {
  test('should have the correct structure', () => {
    expect(cabinetData).toHaveProperty('phases');
    expect(Array.isArray(cabinetData.phases)).toBe(true);
    
    cabinetData.phases.forEach(phase => {
      expect(phase).toHaveProperty('phaseId');
      expect(phase).toHaveProperty('name');
      expect(phase).toHaveProperty('pduCount');
      expect(phase).toHaveProperty('cabinets');
      expect(Array.isArray(phase.cabinets)).toBe(true);
    });
  });

  test('should have Phase 2 with the correct number of cabinets', () => {
    const phase2 = cabinetData.phases.find(phase => phase.phaseId === 2);
    expect(phase2).toBeDefined();
    expect(phase2.cabinets.length).toBeGreaterThan(45); // Adjust based on final count
  });

  test('should have properly structured cabinet data in Phase 2', () => {
    const phase2 = cabinetData.phases.find(phase => phase.phaseId === 2);
    const sampleCabinet = phase2.cabinets.find(cabinet => cabinet.id === 'A16-C01');
    
    expect(sampleCabinet).toBeDefined();
    expect(sampleCabinet.pdus).toHaveLength(2);
    expect(sampleCabinet.pdus[0].id).toBe('PDU H2-07,08');
    expect(sampleCabinet.pdus[1].id).toBe('PDU G2-18,19');
  });
});