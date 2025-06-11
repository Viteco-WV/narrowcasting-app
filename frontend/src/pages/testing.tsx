import React from 'react';
import { Zap, Sun, Square, ArrowDown, ArrowUp, BarChart3, Lightbulb, LucideIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Tooltip, Line, LineChart, ComposedChart } from 'recharts';

// TypeScript interfaces
interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  change: string;
  color: string;
}

const laadpalenData = [
  { 
    month: 'Jun 24', 
    paal1: 45, paal2: 52, paal3: 38, paal4: 41, paal5: 47, paal6: 39,
    totaalSessies: 28
  },
  { 
    month: 'Jul 24', 
    paal1: 48, paal2: 55, paal3: 42, paal4: 44, paal5: 51, paal6: 41,
    totaalSessies: 31
  },
  { 
    month: 'Aug 24', 
    paal1: 46, paal2: 53, paal3: 40, paal4: 43, paal5: 49, paal6: 40,
    totaalSessies: 29
  },
  { 
    month: 'Sep 24', 
    paal1: 41, paal2: 47, paal3: 35, paal4: 38, paal5: 44, paal6: 36,
    totaalSessies: 25
  },
  { 
    month: 'Okt 24', 
    paal1: 38, paal2: 44, paal3: 32, paal4: 35, paal5: 41, paal6: 33,
    totaalSessies: 22
  },
  { 
    month: 'Nov 24', 
    paal1: 35, paal2: 40, paal3: 29, paal4: 32, paal5: 37, paal6: 30,
    totaalSessies: 19
  },
  { 
    month: 'Dec 24', 
    paal1: 32, paal2: 37, paal3: 27, paal4: 29, paal5: 34, paal6: 28,
    totaalSessies: 17
  },
  { 
    month: 'Jan 25', 
    paal1: 34, paal2: 39, paal3: 28, paal4: 31, paal5: 36, paal6: 29,
    totaalSessies: 18
  },
  { 
    month: 'Feb 25', 
    paal1: 37, paal2: 42, paal3: 31, paal4: 33, paal5: 39, paal6: 31,
    totaalSessies: 21
  },
  { 
    month: 'Mrt 25', 
    paal1: 43, paal2: 49, paal3: 36, paal4: 39, paal5: 45, paal6: 37,
    totaalSessies: 26
  },
  { 
    month: 'Apr 25', 
    paal1: 47, paal2: 53, paal3: 39, paal4: 42, paal5: 48, paal6: 40,
    totaalSessies: 29
  },
  { 
    month: 'Mei 25', 
    paal1: 49, paal2: 56, paal3: 41, paal4: 45, paal5: 51, paal6: 42,
    totaalSessies: 32
  }
];

const batterijData = [
  { month: 'Jun 24', laadCycles: 28, ontlaadCycles: 25, aantalLaadCycles: 42 },
  { month: 'Jul 24', laadCycles: 31, ontlaadCycles: 29, aantalLaadCycles: 47 },
  { month: 'Aug 24', laadCycles: 30, ontlaadCycles: 28, aantalLaadCycles: 44 },
  { month: 'Sep 24', laadCycles: 25, ontlaadCycles: 24, aantalLaadCycles: 38 },
  { month: 'Okt 24', laadCycles: 22, ontlaadCycles: 20, aantalLaadCycles: 32 },
  { month: 'Nov 24', laadCycles: 18, ontlaadCycles: 17, aantalLaadCycles: 26 },
  { month: 'Dec 24', laadCycles: 15, ontlaadCycles: 14, aantalLaadCycles: 22 },
  { month: 'Jan 25', laadCycles: 17, ontlaadCycles: 16, aantalLaadCycles: 25 },
  { month: 'Feb 25', laadCycles: 20, ontlaadCycles: 19, aantalLaadCycles: 29 },
  { month: 'Mrt 25', laadCycles: 26, ontlaadCycles: 24, aantalLaadCycles: 39 },
  { month: 'Apr 25', laadCycles: 29, ontlaadCycles: 27, aantalLaadCycles: 43 },
  { month: 'Mei 25', laadCycles: 32, ontlaadCycles: 30, aantalLaadCycles: 48 }
];

const pvData = [
  { month: 'Jun 24', pvOpwekking: 850, eigenVerbruik: 420, directVerbruik: 320 },
  { month: 'Jul 24', pvOpwekking: 780, eigenVerbruik: 400, directVerbruik: 300 },
  { month: 'Aug 24', pvOpwekking: 720, eigenVerbruik: 390, directVerbruik: 280 },
  { month: 'Sep 24', pvOpwekking: 560, eigenVerbruik: 370, directVerbruik: 260 },
  { month: 'Okt 24', pvOpwekking: 380, eigenVerbruik: 360, directVerbruik: 250 },
  { month: 'Nov 24', pvOpwekking: 380, eigenVerbruik: 380, directVerbruik: 180 },
  { month: 'Dec 24', pvOpwekking: 420, eigenVerbruik: 420, directVerbruik: 170 },
  { month: 'Jan 25', pvOpwekking: 460, eigenVerbruik: 450, directVerbruik: 180 },
  { month: 'Feb 25', pvOpwekking: 390, eigenVerbruik: 410, directVerbruik: 200 },
  { month: 'Mrt 25', pvOpwekking: 490, eigenVerbruik: 390, directVerbruik: 280 },
  { month: 'Apr 25', pvOpwekking: 650, eigenVerbruik: 380, directVerbruik: 270 },
  { month: 'Mei 25', pvOpwekking: 700, eigenVerbruik: 370, directVerbruik: 270 }
];

const monthlyData = [
  { month: 'Jun 24', pvOpwekking: 850, totaalVerbruik: 450, batterijCyclus: 200, uitNet: 100 },
  { month: 'Jul 24', pvOpwekking: 800, totaalVerbruik: 420, batterijCyclus: 180, uitNet: 90 },
  { month: 'Aug 24', pvOpwekking: 750, totaalVerbruik: 400, batterijCyclus: 160, uitNet: 80 },
  { month: 'Sep 24', pvOpwekking: 600, totaalVerbruik: 380, batterijCyclus: 140, uitNet: 70 },
  { month: 'Okt 24', pvOpwekking: 400, totaalVerbruik: 450, batterijCyclus: 120, uitNet: 150 },
  { month: 'Nov 24', pvOpwekking: 250, totaalVerbruik: 500, batterijCyclus: 100, uitNet: 200 },
  { month: 'Dec 24', pvOpwekking: 200, totaalVerbruik: 550, batterijCyclus: 90, uitNet: 250 },
  { month: 'Jan 25', pvOpwekking: 300, totaalVerbruik: 520, batterijCyclus: 110, uitNet: 220 },
  { month: 'Feb 25', pvOpwekking: 450, totaalVerbruik: 480, batterijCyclus: 130, uitNet: 180 },
  { month: 'Mrt 25', pvOpwekking: 600, totaalVerbruik: 440, batterijCyclus: 150, uitNet: 140 },
  { month: 'Apr 25', pvOpwekking: 750, totaalVerbruik: 410, batterijCyclus: 170, uitNet: 120 },
  { month: 'Mei 25', pvOpwekking: 650, totaalVerbruik: 390, batterijCyclus: 160, uitNet: 110 }
];

const pieData = [
  { name: 'PV Direct', value: 45, color: '#86efac' },
  { name: 'PV Indirect (via batterij)', value: 25, color: '#4ade80' },
  { name: 'Levering Net', value: 30, color: '#374151' }
];

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, change, color }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
    </div>
    <div className="mt-4">
      <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      <div className={`text-xs mt-2 ${change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </div>
    </div>
  </div>
);

export default function SmartEnergyDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-semibold text-gray-900">Smart Energy Dashboard</h1>
              <p className="text-sm text-gray-600">12 Maanden Overzicht • Jun 2024 - Jun 2025</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Download Rapport
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Export CSV
            </button>
          </div>
        </div>

        {/* Systeem Prestaties Section Header */}
        <div className="bg-white rounded-lg p-6 shadow-lg drop-shadow-lg mb-6 border-l-4 border-gray-300">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Energieprestaties systeem</h2>
            <p className="text-gray-600 text-sm">Overkoepelend overzicht • 12 maanden</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={Zap}
            value={4521}
            label="Totaal Verbruik (kWh)"
            change="+8.3% vs vorig jaar"
            color="bg-gray-200"
          />
          <StatCard
            icon={Sun}
            value={6847}
            label="PV Opwekking (kWh)"
            change="+15.7% vs vorig jaar"
            color="bg-gray-200"
          />
          <StatCard
            icon={Square}
            value={2124}
            label="Batterij Cyclus (kWh)"
            change="+22.1% vs vorig jaar"
            color="bg-gray-200"
          />
          <StatCard
            icon={ArrowDown}
            value={1347}
            label="Levering (kWh)"
            change="-26.9% vs vorig jaar"
            color="bg-gray-200"
          />
          <StatCard
            icon={ArrowUp}
            value={2326}
            label="Teruglevering (kWh)"
            change="+18.9% vs vorig jaar"
            color="bg-gray-200"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-4 h-4 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Maandelijks energie overzicht</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'semibold' }}
                  />
                  <Bar dataKey="pvOpwekking" fill="#86efac" name="PV Opwekking" />
                  <Bar dataKey="totaalVerbruik" fill="#4ade80" name="Totaal Verbruik" />
                  <Bar dataKey="batterijCyclus" fill="#22c55e" name="Batterij Cyclus" />
                  <Bar dataKey="uitNet" fill="#374151" name="Uit Net" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-300 rounded"></div>
                <span className="text-gray-600">Totaal verbruik</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-gray-600">Opwekking PV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Net ontrekking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <span className="text-gray-600">Net teruglevering</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-4 h-4 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Energiebron verdeling</h2>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-300 rounded"></div>
                <span className="text-gray-600">PV Direct</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">PV Indirect (via batterij)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <span className="text-gray-600">Levering Net</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 space-y-6">
          {/* PV Opwek & Gebruik Section Header */}
          <div className="bg-white rounded-lg p-6 shadow-lg drop-shadow-lg border-l-4 border-gray-300">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">PV Opwek & Eigen Verbruik</h2>
              <p className="text-gray-600 text-sm">Zonnepanelen prestaties en energie consumptie</p>
            </div>
          </div>

          {/* PV Opwek Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600 mt-1">Panelen à 440Wp</div>
                <div className="text-xs text-gray-500 mt-2">Totaal: 10,56 kWp</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600 mt-1">Omvormers</div>
                <div className="text-xs text-gray-500 mt-2">Type: SolarEdge</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">Zuid</div>
                <div className="text-sm text-gray-600 mt-1">Oriëntatie</div>
                <div className="text-xs text-gray-500 mt-2">Hellingshoek: 35°</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">2023</div>
                <div className="text-sm text-gray-600 mt-1">Jaar van installatie</div>
                <div className="text-xs text-gray-500 mt-2">In bedrijf sinds: Maart</div>
              </div>
            </div>
          </div>

          {/* PV Opwek Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PV Opwekking vs Eigen Verbruik</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pvData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pvOpwekking" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="eigenVerbruik" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="directVerbruik" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#374151" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#374151" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 900]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'semibold' }}
                    formatter={(value, name) => [`${value} kWh`, name]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pvOpwekking" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#pvOpwekking)" 
                    strokeWidth={2}
                    name="PV Opwekking"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="eigenVerbruik" 
                    stroke="#6b7280" 
                    fillOpacity={1} 
                    fill="url(#eigenVerbruik)" 
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    name="Eigen Verbruik"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="directVerbruik" 
                    stroke="#374151" 
                    fillOpacity={1} 
                    fill="url(#directVerbruik)" 
                    strokeWidth={2}
                    strokeDasharray="3,3"
                    name="Direct PV Verbruik"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-green-500 rounded"></div>
                <span className="text-gray-600">PV Opwekking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-gray-500 border-dashed border-b-2 border-gray-500"></div>
                <span className="text-gray-600">Eigen Verbruik</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-gray-700 border-dotted border-b-2 border-gray-700"></div>
                <span className="text-gray-600">Direct PV Verbruik</span>
              </div>
            </div>
          </div>

          {/* Batterij Inzet Section Header */}
          <div className="bg-white rounded-lg p-6 shadow-lg drop-shadow-lg border-l-4 border-gray-300">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">PV Opwek & Eigen Verbruik</h2>
              <p className="text-gray-600 text-sm">Zonnepanelen prestaties en energie consumptie</p>
            </div>
          </div>

          {/* Batterij Inzet Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">15.2</div>
                <div className="text-sm text-gray-600 mt-1">Capaciteit (kWh)</div>
                <div className="text-xs text-gray-500 mt-2">Bruikbaar: 13.7 kWh</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">5.0</div>
                <div className="text-sm text-gray-600 mt-1">Max Vermogen (kW)</div>
                <div className="text-xs text-gray-500 mt-2">Laden & Ontladen</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">State of Charge</div>
                <div className="text-sm text-gray-600 mt-1">Merk & Type</div>
                <div className="text-xs text-gray-500 mt-2">Powerwall 2</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">State of Health</div>
                <div className="text-sm text-gray-600 mt-1">Jaar van installatie</div>
                <div className="text-xs text-gray-500 mt-2">Geïnstalleerd: April</div>
              </div>
            </div>
          </div>

          {/* Batterij Cycles Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Batterij Laad/Ontlaad Cycles</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={batterijData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'semibold' }}
                    formatter={(value, name) => {
                      if (name === 'Aantal Laad Cycles') {
                        return [`${value} cycles`, name];
                      }
                      return [`${value} cycles`, name];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="laadCycles" fill="#4ade80" name="Energie uit PV" />
                  <Bar yAxisId="left" dataKey="ontlaadCycles" fill="#6b7280" name="Energie uit Net" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="aantalLaadCycles" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="Aantal Laad Cycles"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-gray-600">Energie uit PV</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-gray-600">Energie uit Net</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-yellow-500 border-dashed border-b-2 border-yellow-500"></div>
                <span className="text-gray-600">Aantal Laad Cycles</span>
              </div>
            </div>
          </div>

          {/* Laadpalen Section Header */}
          <div className="bg-white rounded-lg p-6 shadow-lg drop-shadow-lg border-l-4 border-gray-300">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Laadpalen</h2>
              <p className="text-gray-600 text-sm">Laadsessies & verbruiken</p>
            </div>
          </div>

          {/* Laadpalen Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">22</div>
                <div className="text-sm text-gray-600 mt-1">Max Vermogen (kW)</div>
                <div className="text-xs text-gray-500 mt-2">Type 2 connector</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">2,847</div>
                <div className="text-sm text-gray-600 mt-1">Totaal geladen (kWh)</div>
                <div className="text-xs text-gray-500 mt-2">Deze maand: 312 kWh</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">47</div>
                <div className="text-sm text-gray-600 mt-1">Laadsessies</div>
                <div className="text-xs text-gray-500 mt-2">Gemiddeld: 60.6 kWh</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">Zappi</div>
                <div className="text-sm text-gray-600 mt-1">Merk & Model</div>
                <div className="text-xs text-gray-500 mt-2">Installatie: 2023</div>
              </div>
            </div>
          </div>

          {/* Laadpalen Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Laadpalen Verbruik & Sessies</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={laadpalenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    labelStyle={{ color: '#000000', fontWeight: 'semibold' }}
                    formatter={(value, name) => {
                      if (name === 'Totaal Sessies') {
                        return [`${value} sessies`, name];
                      }
                      return [`${value} kWh`, name];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="paal1" stackId="a" fill="#22c55e" name="Paal 1" />
                  <Bar yAxisId="left" dataKey="paal2" stackId="a" fill="#16a34a" name="Paal 2" />
                  <Bar yAxisId="left" dataKey="paal3" stackId="a" fill="#15803d" name="Paal 3" />
                  <Bar yAxisId="left" dataKey="paal4" stackId="a" fill="#166534" name="Paal 4" />
                  <Bar yAxisId="left" dataKey="paal5" stackId="a" fill="#14532d" name="Paal 5" />
                  <Bar yAxisId="left" dataKey="paal6" stackId="a" fill="#052e16" name="Paal 6" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="totaalSessies" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    name="Totaal Sessies"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Paal 1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-gray-600">Paal 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-700 rounded"></div>
                <span className="text-gray-600">Paal 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-800 rounded"></div>
                <span className="text-gray-600">Paal 4</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-900 rounded"></div>
                <span className="text-gray-600">Paal 5</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-950 rounded"></div>
                <span className="text-gray-600">Paal 6</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-yellow-500 border-dashed border-b-2 border-yellow-500"></div>
                <span className="text-gray-600">Totaal Sessies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}