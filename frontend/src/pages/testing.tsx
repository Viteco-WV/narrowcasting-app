import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Leaf } from 'lucide-react';
import WeiiChartSvg from '../assets/icons/energiekompas.svg';
import woerdenImage from '../assets/images/woerden.png';
import tnLogoSvg from '../assets/icons/tn-logo.svg';

// Interfaces
interface EnergyDataPoint {
  month: string;
  [key: string]: string | number; // Dynamische type voor alle velden
}

interface WeiiDataPoint {
  year: number;
  totaal: number;
}

interface WeiiResponse {
  dataWeii: WeiiDataPoint[];
  timestamp: string;
}

interface FetchOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  [key: string]: any;
}

// Functie om de beschikbare jaren uit de data te extraheren
const extractYearsFromData = (data: any[]): string[] => {
  if (!data || data.length === 0) return [];
  
  return Object.keys(data[0])
    .filter(key => {
      // Controleer of de sleutel naar een jaar verwijst (een getal van 4 cijfers)
      return key !== 'month' && /^\d{4}$/.test(key);
    })
    .sort((a, b) => Number(a) - Number(b)); // Sorteer numeriek
};

// Mock SVG components for demo
const WeiiChart = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
    <span className="text-gray-500">WEII Chart</span>
    
  </div>
);

const TvvlLogo = ({ style }: { style?: React.CSSProperties }) => (
  <div style={style} className="flex items-center justify-center bg-green-600 text-white rounded">
    <span className="text-sm font-bold">TVVL</span>
  </div>
);

// Verkrijg data uit API en toon deze in een dashboard
const EnergyDashboard: React.FC = () => {
  // State toevoegen voor data van API met correcte types
  const [electricityData, setElectricityData] = useState<EnergyDataPoint[]>([]);
  const [gasData, setGasData] = useState<EnergyDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Nieuwe state voor WEII data
  const [weiiScore, setWeiiScore] = useState<number | null>(null);
  const [weiiData, setWeiiData] = useState<WeiiDataPoint[]>([]);
  
  // State voor dynamische jaartallen
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  
  // State voor jaarlijkse totalen
  const [electricityTotals, setElectricityTotals] = useState<{[year: string]: number}>({});
  const [gasTotals, setGasTotals] = useState<{[year: string]: number}>({});

  // Verbeterde fetch functie met betere error handling en timeout
  const fetchWithTimeout = async (url: string, options: FetchOptions = {}): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconden timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }
      
      // Check of response body leeg is
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response received');
      }
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response');
      }
      
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      throw error;
    }
  };

  // Functie om WEII data op te halen
  const fetchWeiiData = async (): Promise<void> => {
    try {
      console.log('Fetching WEII data...');
      const responseJson: WeiiResponse = await fetchWithTimeout('https://grafana.viteco.tech/api/energy-data-weii');
      console.log('WEII data raw API response:', responseJson);
      
      if (!responseJson.dataWeii || !Array.isArray(responseJson.dataWeii)) {
        throw new Error('Onverwacht API-responseformaat: kon geen WEII data vinden');
      }
      
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      
      // Sla alle WEII data op
      setWeiiData(responseJson.dataWeii);
      
      // Zoek de waarde voor vorig jaar (2024)
      const previousYearData = responseJson.dataWeii.find((item: WeiiDataPoint) => item.year === previousYear);
      
      if (previousYearData) {
        setWeiiScore(previousYearData.totaal);
        console.log(`WEII score voor ${previousYear}:`, previousYearData.totaal);
      } else {
        console.warn(`Geen WEII data gevonden voor jaar ${previousYear}`);
        setWeiiScore(null);
      }
      
    } catch (err: unknown) {
      console.error('Probleem bij ophalen van WEII data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(prev => prev ? `${prev}; ${errorMessage}` : errorMessage);
      setWeiiScore(null);
    }
  };

  // Functie om dynamisch data te genereren voor fallback
  const createStaticData = (years: string[]): EnergyDataPoint[] => {
    const months = ['Jan.', 'Feb.', 'Mrt.', 'Apr.', 'Mei', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    
    return months.map(month => {
      const dataPoint: EnergyDataPoint = { month };
      // Voeg dynamisch alle jaren toe
      years.forEach((year: string) => {
        dataPoint[year] = Math.floor(Math.random() * 50000) + 50000; // Willekeurige waarde tussen 50000-100000
      });
      return dataPoint;
    });
  };

  // Data ophalen van API endpoints
  useEffect(() => {
    const fetchElectricityData = async (): Promise<void> => {
      try {
        console.log('Fetching electricity data...');
        const responseJson: any = await fetchWithTimeout('https://grafana.viteco.tech/api/energy-data-elec');
        console.log('Elektriciteitsdata raw API response:', responseJson);
        
        // Check of de response een object is met een 'electricityData' property of een array
        let rawData: any[] = [];
        if (responseJson && responseJson.elecData && Array.isArray(responseJson.elecData)) {
          rawData = responseJson.elecData;
          console.log('Elektriciteitsdata uit API (genest):', rawData);
        } else if (Array.isArray(responseJson)) {
          rawData = responseJson;
          console.log('Elektriciteitsdata uit API (direct array):', rawData);
        } else {
          throw new Error('Onverwacht API-responseformaat: kon geen elektriciteitsdata vinden');
        }
        
        // Detecteer beschikbare jaartallen
        const years = extractYearsFromData(rawData);
        console.log('Gedetecteerde jaren in elektriciteitsdata:', years);
        
        if (years.length === 0) {
          throw new Error('Geen jaartallen gedetecteerd in de data');
        }
        
        // Hervorm de data als nodig is om consistentie te garanderen
        const formattedData: EnergyDataPoint[] = rawData.map((item: any) => {
          const dataPoint: EnergyDataPoint = { month: item.month };
          
          // Voeg alle jaren toe als numerieke waarden
          years.forEach(year => {
            const value = item[year];
            dataPoint[year] = typeof value === 'number' ? value : Number(value || 0);
          });
          
          return dataPoint;
        });
        
        // Update de state
        setAvailableYears(years);
        setElectricityData(formattedData);
        console.log('Geformatteerde elektriciteitsdata:', formattedData);
        
      } catch (err: unknown) {
        console.error('Probleem bij ophalen van elektriciteitsdata:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error fetching electricity data';
        setError(errorMessage);
        
        // Fallback naar test data met standaard jaren
        const defaultYears = ['2023', '2024', '2025', '2026'];
        setAvailableYears(defaultYears);
        setElectricityData(createStaticData(defaultYears));
        console.log('Using fallback electricity data');
      }
    };

    const fetchGasData = async (): Promise<void> => {
      try {
        console.log('Fetching gas data...');
        const responseJson: any = await fetchWithTimeout('https://grafana.viteco.tech/api/energy-data-gas');
        console.log('Gasdata raw API response:', responseJson);
        
        // Check of de response een object is met een 'gasData' property of een array
        let rawData: any[] = [];
        if (responseJson && responseJson.gasData && Array.isArray(responseJson.gasData)) {
          rawData = responseJson.gasData;
          console.log('Gasdata uit API (genest):', rawData);
        } else if (Array.isArray(responseJson)) {
          rawData = responseJson;
          console.log('Gasdata uit API (direct array):', rawData);
        } else {
          throw new Error('Onverwacht API-responseformaat: kon geen gasdata vinden');
        }
        
        // Gebruik de jaren die we al hebben gedetecteerd bij elektriciteitsdata voor consistentie
        const years = availableYears.length > 0 ? availableYears : extractYearsFromData(rawData);
        console.log('Jaren te gebruiken voor gasdata:', years);
        
        if (years.length === 0) {
          throw new Error('Geen jaartallen gedetecteerd in de data');
        }
        
        // Hervorm de data als nodig is om consistentie te garanderen
        const formattedData: EnergyDataPoint[] = rawData.map((item: any) => {
          const dataPoint: EnergyDataPoint = { month: item.month };
          
          // Voeg alle jaren toe als numerieke waarden
          years.forEach(year => {
            const value = item[year];
            dataPoint[year] = typeof value === 'number' ? value : Number(value || 0);
          });
          
          return dataPoint;
        });
        
        // Update de state
        setGasData(formattedData);
        console.log('Geformatteerde gasdata:', formattedData);
        
      } catch (err: unknown) {
        console.error('Probleem bij ophalen van gasdata:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error fetching gas data';
        setError(errorMessage);
        
        // Gebruik de jaren die we hebben voor elektriciteit, of fallback naar standaard
        const years = availableYears.length > 0 ? availableYears : ['2023', '2024', '2025', '2026'];
        setGasData(createStaticData(years));
        console.log('Using fallback gas data');
      }
    };

    // Alle datasets ophalen en loading status bijwerken
    const fetchAllData = async (): Promise<void> => {
      setLoading(true);
      try {
        await fetchElectricityData(); // Haal eerst elektriciteitsdata op om jaren te detecteren
        await fetchGasData();         // Gebruik dezelfde jaren voor gasdata
        await fetchWeiiData();        // Haal WEII data op
      } catch (error) {
        console.error('Error in fetchAllData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Lege dependency array betekent dat dit alleen bij mount uitgevoerd wordt

  // Effect om totalen te berekenen wanneer data verandert
  useEffect(() => {
    if (!loading && electricityData.length > 0 && gasData.length > 0) {
      // Check of we beschikbare jaren hebben, anders opnieuw detecteren
      let yearsToUse: string[] = [...availableYears]; // Maak een kopie om mutatie te voorkomen
      
      // Als we geen jaren hebben, probeer ze opnieuw uit de data te extraheren
      if (yearsToUse.length === 0) {
        const elecYears = extractYearsFromData(electricityData);
        console.log('TOTALS: Jaren gedetecteerd vanuit data (want availableYears leeg):', elecYears);
        yearsToUse = elecYears;
        // Update de availableYears state als we nieuwe jaren hebben gevonden
        if (elecYears.length > 0) {
          setAvailableYears(elecYears);
        }
      }
      
      console.log('TOTALS: Jaren gebruikt voor totaalberekeningen:', yearsToUse);
      
      if (yearsToUse.length > 0) {
        // Bereken totalen per jaar voor elektriciteit
        const elecTotals: {[year: string]: number} = {};
        yearsToUse.forEach(year => {
          elecTotals[year] = electricityData.reduce((total, dataPoint) => {
            const value = typeof dataPoint[year] === 'number' 
              ? dataPoint[year] as number
              : Number(dataPoint[year] || 0);
            return total + value;
          }, 0);
        });
        
        console.log('TOTALS: Elektriciteit totalen per jaar:', elecTotals);
        setElectricityTotals(elecTotals);
        
        // Bereken totalen per jaar voor gas
        const gasTotalsObj: {[year: string]: number} = {};
        yearsToUse.forEach(year => {
          gasTotalsObj[year] = gasData.reduce((total, dataPoint) => {
            const value = typeof dataPoint[year] === 'number' 
              ? dataPoint[year] as number
              : Number(dataPoint[year] || 0);
            return total + value;
          }, 0);
        });
        
        console.log('TOTALS: Gas totalen per jaar:', gasTotalsObj);
        setGasTotals(gasTotalsObj);
      } else {
        console.error('TOTALS: Geen jaren beschikbaar voor berekening totalen');
      }
    }
  }, [loading, electricityData, gasData, availableYears]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl font-semibold">Data wordt geladen...</div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 font-sans text-gray-800" style={{ backgroundColor: '#d3e6f8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="text-red-700 font-semibold">API Errors:</div>
            <div className="text-red-600 text-sm">{error}</div>
          </div>
        )}

        {/* Main content grid - Responsive layout */}
        <div className="flex flex-col lg:flex-row w-full gap-4">
          
          {/* Left column - Mobile: full width, Desktop: 1/5 width */}
          <div className="w-full lg:w-1/5 space-y-4">

            <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-sm truncate">Korenmolenlaan 4</div>
                  <div className="text-sm text-gray-500">Woerden, NL</div>
                </div>
              </div>
              
              <div className="flex items-center flex-shrink-0">
                <div className="text-green-800 font-bold p-2 flex items-center justify-center">
                  <img 
                    src={tnLogoSvg} 
                    alt="TN Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Building image */}
            <div className="bg-white rounded-lg shadow overflow-hidden flex justify-center items-center h-64 lg:h-72">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <img 
                  src={woerdenImage}
                  alt="Woerden kantoor" 
                  className="object-contain"
                  style={{ 
                    transform: 'scale(1.2)',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
            </div>
            
            {/* Environmental impact - Updated to show WEII score */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-center items-center text-sm font-bold text-gray-800 mb-3">
                <Leaf size={14} className="mr-2 flex-shrink-0" />
                <span className="text-center">Environmental Impact 2024</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-blue-50 rounded-lg p-2 h-14 font-bold text-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Energie efficiëntie</div>
                    <div className="text-sm font-bold">
                      {weiiScore !== null ? `${Math.round(weiiScore)} kWh/m²` : '140 kWh/m²'}
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-2 h-14 font-bold text-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Parijs akkoord</div>
                    <div className="text-sm font-bold">70 kWh/m²</div>
                  </div>
                </div>
              </div>
            </div>

            {/* WEII chart */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-center items-center h-64 lg:h-96">
             <img 
                src={WeiiChartSvg} 
                alt="WEII Energy Chart" 
                className="w-full h-full object-contain"
              />
            </div>

          </div>

          {/* Right column - Mobile: full width, Desktop: 4/5 width */}
          <div className="w-full lg:w-4/5 space-y-4">

            {/* Building info cards */}
            <div className="bg-white rounded-lg shadow p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center lg:text-left">
                <div className="text-sm text-gray-600 mb-1">Energielabel</div>
                <div className="flex justify-center lg:justify-start">
                  <div 
                    style={{ backgroundColor: '#00a651' }}
                    className="text-white font-semibold text-xs px-2 py-0.5 rounded-md inline-block"
                  >
                    A+
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-sm text-gray-600">Totale CO₂ emissie</div>
                <div className="font-semibold">531.0 tons</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-sm text-gray-600">Bouwjaar</div>
                <div className="font-semibold">2001</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-sm text-gray-600">Vloeroppervlak</div>
                <div className="font-semibold">13.132m²</div>
              </div>
            </div>

            {/* Electricity usage cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {availableYears.map((year, index) => (
                <div key={year} className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="text-sm text-gray-600">Elektra {year}</div>
                  <div className="font-bold text-lg lg:text-xl">{(electricityTotals[year] || 0).toLocaleString('nl-NL')} kWh</div>
                  {index > 0 && index < availableYears.length - 1 && (
                    <div className={`flex items-center justify-center text-xs lg:text-sm mt-1 w-full ${
                      electricityTotals[year] > electricityTotals[availableYears[index-1]]
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                      {electricityTotals[year] > electricityTotals[availableYears[index-1]] ? (
                        <ArrowUpRight size={14} className="mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownRight size={14} className="mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {electricityTotals[availableYears[index-1]] === 0 
                          ? 'N/A' 
                          : `${Math.abs(Math.round((electricityTotals[year] - electricityTotals[availableYears[index-1]]) / electricityTotals[availableYears[index-1]] * 1000) / 10).toFixed(1)}% vs ${availableYears[index-1]}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Monthly electricity chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-lg mb-4">
                <span className="font-bold">Maandelijks elektraverbruik</span> <span className="text-sm">[kWh]</span>
              </div>
              
              <div className="h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={electricityData} 
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      height={40}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => value.toString()}
                      domain={[0, 'dataMax']}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend 
                      wrapperStyle={{ paddingTop: 15 }} 
                      formatter={(value) => (
                        <span style={{fontSize: 12, color: '#000000' }}>{value}</span>
                      )}
                    />
                    {availableYears.map((year, index) => {
                      // Kleurenpalet voor de jaren
                      const colors = ['#4d4d4d', '#a3a0a0', '#ff6653', '#372462', '#00a651', '#0066cc'];
                      return (
                        <Bar 
                          key={year}
                          dataKey={year} 
                          fill={colors[index % colors.length]} 
                          name={year} 
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Gas usage cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {availableYears.map((year, index) => (
                <div key={year} className="bg-white rounded-lg shadow p-4 text-center">
                  <div className="text-sm text-gray-600">Gas {year}</div>
                  <div className="font-bold text-lg lg:text-xl">{(gasTotals[year] || 0).toLocaleString('nl-NL')} m³</div>
                  {index > 0 && index < availableYears.length - 1 && (
                    <div className={`flex items-center justify-center text-xs lg:text-sm mt-1 w-full ${
                      gasTotals[year] > gasTotals[availableYears[index-1]]
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                      {gasTotals[year] > gasTotals[availableYears[index-1]] ? (
                        <ArrowUpRight size={14} className="mr-1 flex-shrink-0" />
                      ) : (
                        <ArrowDownRight size={14} className="mr-1 flex-shrink-0" />
                      )}
                      <span className="truncate">
                        {gasTotals[availableYears[index-1]] === 0 
                          ? 'N/A' 
                          : `${Math.abs(Math.round((gasTotals[year] - gasTotals[availableYears[index-1]]) / gasTotals[availableYears[index-1]] * 1000) / 10).toFixed(1)}% vs ${availableYears[index-1]}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>              
            
            {/* Monthly gas chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-lg mb-4">
                <span className="font-bold">Maandelijks gasverbruik</span> <span className="text-sm">[m³]</span>
              </div>
              
              <div className="h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={gasData} 
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      height={40}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => value.toString()}
                      domain={[0, 'dataMax']}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend 
                      wrapperStyle={{ paddingTop: 15 }} 
                      formatter={(value) => (
                        <span style={{fontSize: 12, color: '#000000' }}>{value}</span>
                      )}
                    />
                    {availableYears.map((year, index) => {
                      // Kleurenpalet voor de jaren
                      const colors = ['#4d4d4d', '#a3a0a0', '#ff6653', '#372462', '#00a651', '#0066cc'];
                      return (
                        <Bar 
                          key={year}
                          dataKey={year} 
                          fill={colors[index % colors.length]} 
                          name={year} 
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;