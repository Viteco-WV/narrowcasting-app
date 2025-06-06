import React from 'react';
import { Thermometer, Atom } from 'lucide-react';

const EnvironmentalDashboard = () => {
  const roomsGrid = [
    // Row 1
    [
      { name: 'Huiskamer', temp: '22.0', co2: '535' },
      { name: 'Cursusruimte 1', temp: '21.0', co2: '610' },
      { name: 'Cursusruimte 2', temp: '21.1', co2: '528' },
      { name: 'Cursusruimte 3', temp: '21.0', co2: '627' }
    ],
    // Row 2
    [
      { name: 'Cursusruimte 4', temp: '20.8', co2: '444' },
      { name: 'Cursusruimte 5', temp: '21.2', co2: '418' },
      { name: 'Vergaderruimte 1', temp: '20.4', co2: '412' },
      { name: 'Vergaderruimte 2', temp: '20.6', co2: '662' }
    ],
    // Row 3
    [
      { name: 'Vergaderruimte 3', temp: '19.8', co2: '490' },
      { name: 'Kantoorruimte 1', temp: '21.3', co2: '515' },
      { name: 'Kantoorruimte 2', temp: '20.9', co2: '501' },
      { name: 'Bestuurskamer', temp: '22.5', co2: '543' }
    ]
  ];

  const getTemperatureColor = (temp: string) => {
    if (temp === '#N/A') return 'bg-gray-100';
    const tempNum = parseFloat(temp);
    if (tempNum < 20) return 'bg-blue-100';
    if (tempNum > 22) return 'bg-red-100';
    return 'bg-green-100';
  };

  const getCO2Color = (co2: string) => {
    if (co2 === '#N/A') return 'bg-gray-100';
    const co2Num = parseFloat(co2);
    if (co2Num < 500) return 'bg-green-100';
    if (co2Num > 600) return 'bg-red-100';
    return 'bg-yellow-100';
  };

  return (
    <div className="min-h-screen bg-[#f5f9e2]" style={{ backgroundColor: '#f5f9e2' }}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Huidige metingen in onze ruimtes</h1>
        
        <div className="space-y-1">
          {roomsGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-1">
              {row.map((room) => (
                <div 
                  key={room.name} 
                  className="bg-white rounded-lg border border-gray-200"
                >
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{room.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temp
                        </span>
                        <span className={`font-medium px-2 py-1 rounded ${getTemperatureColor(room.temp)}`}>
                          {room.temp === '#N/A' ? '#N/A' : `${room.temp}°C`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Atom className="h-4 w-4" />
                          CO₂
                        </span>
                        <span className={`font-medium px-2 py-1 rounded ${getCO2Color(room.co2)}`}>
                          {room.co2 === '#N/A' ? '#N/A' : `${room.co2} ppm`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm">
          <p>Wil jij ook een dashboard maken als deze?</p>
          <div className="mt-2">
            <p>Scan dan de QR voor meer info over de TVVL cursus</p>
            <p>Prestatiemonitoring en - Analyse van HVAC-installaties</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;