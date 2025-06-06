import React from 'react';
import { Users, Monitor } from 'lucide-react';

// Define the Room type
interface Room {
  id: string;
  name: string;
  type: string;
  description?: string;
  hasBooking: boolean;
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
  const RoomCard = ({ room }: { room: Room }) => (
    <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4 h-32">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium">{room.name}</h3>
      </div>
      <div className="flex justify-between items-center h-16">
        <div className="text-left flex-grow">
          {room.description ? (
            <p className="text-sm text-gray-600">{room.description}</p>
          ) : (
            <p className="text-sm text-gray-600">Ruimte is vrij</p>
          )}
        </div>
        {room.hasBooking && (
          <div className="ml-4 flex-shrink-0">
            <TvvlLogo />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full p-6 min-h-screen" style={{ backgroundColor: '#f5f9e2' }}>
      <div className="flex justify-center mb-6">
        <h1 className="text-xl font-semibold">Planning ruimte</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {/* Meeting Rooms Column */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 mr-2" style={{ color: '#c7d315' }} />
            <h2 className="text-lg font-medium">Meeting Rooms</h2>
          </div>
          <div className="space-y-2">
            {meetingRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        {/* Training Rooms Column */}
        <div>
          <div className="flex items-center mb-4">
            <Monitor className="h-5 w-5 mr-2" style={{ color: '#c7d315' }} />
            <h2 className="text-lg font-medium">Training Rooms</h2>
          </div>
          <div className="space-y-2">
            {trainingRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingSystem;