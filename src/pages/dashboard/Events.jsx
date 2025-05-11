import { useState } from 'react';

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({
    eventType: '',
    dateRange: '30'
  });

  // Mock events data
  const events = [
    {
      event_name: "Page View",
      user_id: "user123",
      event_type: "page_view",
      screen_name: "Home",
      touch_count: 5,
      scroll_count: 2,
      timestamp: new Date().toISOString()
    },
    // Add more mock events as needed
  ];

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const showEventDetails = (event) => {
    // Implement event details modal logic
    console.log('Show event details:', event);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Events</h2>
          <p className="text-gray-600">Showing {events.length} events</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              name="eventType"
              value={filters.eventType}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="">All Events</option>
              <option value="page_view">Page View</option>
              <option value="button_click">Button Click</option>
              <option value="signup">Signup</option>
              <option value="login">Login</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Touch Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scroll Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.event_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.screen_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.touch_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.scroll_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => showEventDetails(event)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 border rounded-md"
            >
              Next
            </button>
          </div>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded-md p-1"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}