import React, { useState, useEffect } from 'react';
import { Thermometer, Atom, RefreshCw } from 'lucide-react';

interface RoomData {
  ruimte: string;
  temp: string;
  co2: string;
}

interface ApiResponse {
  dataBinnenklimaat: RoomData[];
  timestamp: string;
}

const EnvironmentalDashboard = () => {
  const [data, setData] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Functie om data op te halen
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://grafana.viteco.tech/api/tvvl-binnenklimaat-data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result: ApiResponse = await response.json();
      setData(result.dataBinnenklimaat || []);
      setLastUpdated(new Date(result.timestamp));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  // Data ophalen bij component mount
  useEffect(() => {
    fetchData();
    
    // Auto-refresh elke 30 seconden
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Verdeel de data in rijen van 4
  const roomsGrid: RoomData[][] = [];
  for (let i = 0; i < data.length; i += 4) {
    roomsGrid.push(data.slice(i, i + 4));
  }

  const getTemperatureColor = (temp: string): string => {
    if (!temp || temp === '#N/A') return 'bg-gray-100';
    const tempNum = parseFloat(temp);
    if (tempNum < 20) return 'bg-blue-100';
    if (tempNum > 22) return 'bg-red-100';
    return 'bg-green-100';
  };

  const getCO2Color = (co2: string): string => {
    if (!co2 || co2 === '#N/A') return 'bg-gray-100';
    const co2Num = parseFloat(co2);
    if (co2Num < 500) return 'bg-green-100';
    if (co2Num > 600) return 'bg-red-100';
    return 'bg-yellow-100';
  };

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f9e2] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Data laden...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f9e2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Fout bij laden van data: {error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f9e2]" style={{ backgroundColor: '#f5f9e2' }}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Huidige metingen in onze ruimtes</h1>
        
        <div className="space-y-1">
          {roomsGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
              {row.map((room) => (
                <div 
                  key={room.ruimte} 
                  className="bg-white rounded-lg border border-gray-200"
                >
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{room.ruimte}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temp
                        </span>
                        <span className={`font-medium px-2 py-1 rounded ${getTemperatureColor(room.temp)}`}>
                          {!room.temp || room.temp === '#N/A' ? '#N/A' : `${room.temp}°C`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Atom className="h-4 w-4" />
                          CO₂
                        </span>
                        <span className={`font-medium px-2 py-1 rounded ${getCO2Color(room.co2)}`}>
                          {!room.co2 || room.co2 === '#N/A' ? '#N/A' : `${room.co2} ppm`}
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
          <p className="font-bold text-center">Wil jij ook een dashboard maken als deze?</p>
          <div className="mt-2">
            <p>Informeer naar de TVVL cursus</p>
            <p>Prestatiemonitoring en - Analyse van HVAC-installaties</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalDashboard;