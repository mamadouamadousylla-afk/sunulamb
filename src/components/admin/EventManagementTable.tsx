import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
  status: 'scheduled' | 'cancelled' | 'completed';
}

const EventManagementTable = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Modou Lô vs Sa Thiès',
      date: '2024-04-05',
      time: '20:00',
      location: 'Arène Nationale de Lutte',
      ticketsSold: 1200,
      totalTickets: 1500,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Balla Gaye 2 vs Yékini',
      date: '2024-04-12',
      time: '19:30',
      location: 'Grand Arena',
      ticketsSold: 950,
      totalTickets: 1200,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Eumeu Sène vs Thiès',
      date: '2024-04-19',
      time: '18:00',
      location: 'Stade Omnisports',
      ticketsSold: 0,
      totalTickets: 1000,
      status: 'cancelled'
    },
    {
      id: '4',
      title: 'Guedioura vs Gris',
      date: '2024-04-26',
      time: '21:00',
      location: 'Salle des Sports',
      ticketsSold: 650,
      totalTickets: 800,
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Events Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{event.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div>{event.date}</div>
                    <div className="text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{event.location}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div>{event.ticketsSold}/{event.totalTickets}</div>
                    <div className="text-gray-500 text-xs">
                      {Math.round((event.ticketsSold / event.totalTickets) * 100)}% filled
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManagementTable;