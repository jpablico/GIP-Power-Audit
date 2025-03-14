import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CabinetCardView from '../CabinetCardView';

describe('CabinetCardView', () => {
  const mockCabinets = [
    {
      id: 'A01-C01',
      pdus: [
        { id: 'PDU A1-33', power: '' },
        { id: 'PDU B1-23', power: '' }
      ],
      checked: false
    }
  ];
  
  const mockUpdatePduPower = jest.fn();
  const mockMarkAsChecked = jest.fn();
  
  test('renders cabinet details', () => {
    render(
      <CabinetCardView 
        cabinets={mockCabinets}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    expect(screen.getByText('A01-C01')).toBeInTheDocument();
    expect(screen.getByText('PDU 1: PDU A1-33')).toBeInTheDocument();
    expect(screen.getByText('PDU 2: PDU B1-23')).toBeInTheDocument();
  });
  
  test('Calculate total power correctly', () => {
    const cabinetsWithPower = [
      {
        id: 'A01-C01',
        pdus: [
          { id: 'PDU A1-33', power: '1.5' },
          { id: 'PDU B1-23', power: '2.5' }
        ],
        checked: false
      }
    ];
    
    render(
      <CabinetCardView 
        cabinets={cabinetsWithPower}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    expect(screen.getByText('4.00 kW')).toBeInTheDocument();
  });
  
  test('Complete button is disabled when PDUs have no power values', () => {
    render(
      <CabinetCardView 
        cabinets={mockCabinets}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    expect(screen.getByText('Complete')).toBeDisabled();
  });
});