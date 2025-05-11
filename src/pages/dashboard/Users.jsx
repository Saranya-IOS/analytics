import { useState } from 'react';

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Mock users data
  const users = [
    {
      id: "user123",
      full_name: "John Doe",
      first_seen: "2023-01-01",
      last_seen: "2024-01-20",
      platform: "Web",
      country: "US",
      events_count: 156
    },
    // Add more mock users as needed
  ];

  const showUserDetails = (user) => {
    // Implement user details modal logic
    console.log('Show user details:', user);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Profiles</h2>
          <p className="text-gray-600">Showing {users.length} users</p>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.first_seen).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.last_seen).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {user.country}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.events_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => showUserDetails(user)}
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