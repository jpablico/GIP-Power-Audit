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

  test('PDU power input updates correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <CabinetCardView 
        cabinets={mockCabinets}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    const powerInput = screen.getAllByPlaceholderText('Enter power')[0];
    await user.clear(powerInput);
    await user.type(powerInput, '3.5');
    
    expect(mockUpdatePduPower).toHaveBeenCalledWith('A01-C01', 0, '3.5');
  });
  
  test('Complete button is enabled when all PDUs have power values', () => {
    const cabinetsWithFilledPower = [
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
        cabinets={cabinetsWithFilledPower}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    expect(screen.getByText('Complete')).not.toBeDisabled();
  });
  
  test('Complete button calls markAsChecked when clicked', async () => {
    const user = userEvent.setup();
    
    const cabinetsWithFilledPower = [
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
        cabinets={cabinetsWithFilledPower}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    await user.click(screen.getByText('Complete'));
    
    expect(mockMarkAsChecked).toHaveBeenCalledWith('A01-C01');
  });
  
  test('Empty PDU slots are not rendered', () => {
    const cabinetsWithEmptySlots = [
      {
        id: 'A01-C01',
        pdus: [
          { id: 'PDU A1-33', power: '' },
          { id: '', power: '' }
        ],
        checked: false
      }
    ];
    
    render(
      <CabinetCardView 
        cabinets={cabinetsWithEmptySlots}
        updatePduPower={mockUpdatePduPower}
        markAsChecked={mockMarkAsChecked}
        pduCount={2}
      />
    );
    
    expect(screen.getByText('PDU 1: PDU A1-33')).toBeInTheDocument();
    expect(screen.queryByText('PDU 2:')).not.toBeInTheDocument();
  });
});