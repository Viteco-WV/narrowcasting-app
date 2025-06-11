import React, { useState, useEffect } from 'react';
import { Users, Monitor } from 'lucide-react';

// Define the Room type
interface Room {
  id: string;
  name: string;
  type: string;
  description?: string;
  hasBooking: boolean;
}

// Define the API response type
interface ApiResponse {
  roosterData: ApiRoomData[];
  timestamp: string;
}

interface ApiRoomData {
  ruimteNaam: string;
  beschrijvingBezetting: string;
  urlLogo: string;
}

const TvvlLogo = () => (
  <svg viewBox="0 0 100 60" className="w-12 h-8">
    <g transform="translate(0, 5)">
      <path d="M10,0 L30,0 L40,40 L20,40 Z" fill="#c7d315"/>
      <path d="M30,0 L50,0 L40,40 L20,40 Z" fill="#333333"/>
      <path d="M50,40 L60,0 L80,0 L70,40 Z" fill="#333333"/>
    </g>
  </svg>
);

const RoomBookingSystem = () => {
  const [apiData, setApiData] = useState<ApiRoomData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch('https://grafana.viteco.tech/api/tvvl-rooster-data');
        const data: ApiResponse = await response.json();
        setApiData(data.roosterData); // Extract roosterData array
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  // Function to get room data from API based on room name
  const getRoomDataFromApi = (roomName: string) => {
    return apiData.find(item => item.ruimteNaam === roomName);
  };

  const meetingRooms: Room[] = [
    { id: 'bestuurskamer', name: 'Bestuurskamer', type: 'meeting', description: 'KNVVK Bestuursvergadering', hasBooking: true },
    { id: 'vergaderzaal1', name: 'Vergaderzaal 1', type: 'meeting', hasBooking: false },
    { id: 'vergaderzaal2', name: 'Vergaderzaal 2', type: 'meeting', hasBooking: false },
    { id: 'vergaderzaal3', name: 'Vergaderzaal 3', type: 'meeting', hasBooking: false },
  ];

  const trainingRooms: Room[] = [
    { id: 'cursus1', name: 'Cursusruimte 1', type: 'training', description: 'Luchtbehandeling Speciale Ruimten', hasBooking: true },
    { id: 'cursus2', name: 'Cursusruimte 2', type: 'training', hasBooking: false },
    { id: 'cursus3', name: 'Cursusruimte 3', type: 'training', description: 'Installeren PV panelen / zonnestroom laagspanningsnet', hasBooking: true },
    { id: 'cursus4', name: 'Cursusruimte 4', type: 'training', hasBooking: false },
    { id: 'cursus5', name: 'Cursusruimte 5 / Webinarstudio', type: 'training', hasBooking: false },
  ];

  // Add proper typing to the RoomCard component
  const RoomCard = ({ room }: { room: Room }) => {
    const roomData = getRoomDataFromApi(room.name);
    const hasBooking = roomData?.beschrijvingBezetting && roomData.beschrijvingBezetting.trim() !== '';
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4 h-40 shadow-md flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-4xl font-medium">{room.name}</h3>
        </div>
        <div className="flex justify-between items-center h-16">
          <div className="text-left flex-grow">
            {hasBooking ? (
              <p className="text-4xl text-gray-800"> · {roomData.beschrijvingBezetting}</p>
            ) : (
              <p className="text-3xl text-gray-400">Ruimte is vrij</p>
            )}
          </div>
          {roomData?.urlLogo && (
            <div className="ml-4 flex-shrink-0">
              <img 
                src={roomData.urlLogo} 
                alt="Logo" 
                className="w-auto h-24 max-w-24 object-contain pb-4"
                onError={(e) => {
                  // Fallback to TVVL logo if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-logo') as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="fallback-logo" style={{ display: 'none' }}>
                <TvvlLogo />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6 min-h-screen" style={{ backgroundColor: '#f5f9e2' }}>
      <div className="flex justify-center mb-6">
        <h1 className="text-6xl font-semibold">Welkom!</h1>
      </div>
      <div className="flex justify-center mb-6">
        <h1 className="text-3xl font-semibold">Dit is het programma van vandaag:</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading room data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Training Rooms Column */}
        <div>
          <div className="flex items-center mb-4">
            <Monitor className="h-10 w-10 mr-2" style={{ color: '#c7d315' }} />
            <h2 className="text-5xl font-medium">Cursusruimten</h2>
          </div>
          <div className="space-y-2">
            {trainingRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Meeting Rooms Column */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="h-10 w-10 mr-2" style={{ color: '#c7d315' }} />
            <h2 className="text-5xl font-medium">Vergaderruimten</h2>
          </div>
          <div className="space-y-2">
            {meetingRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default RoomBookingSystem;