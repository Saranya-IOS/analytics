export default function Reports() {
  const reports = [
    {
      name: "Monthly User Acquisition",
      type: "User",
      created: "Aug 12, 2025",
      lastModified: "Aug 15, 2025"
    },
    {
      name: "Conversion Optimization",
      type: "Funnel",
      created: "Aug 5, 2025",
      lastModified: "Aug 14, 2025"
    },
    {
      name: "Revenue Analytics",
      type: "Event",
      created: "Jul 28, 2025",
      lastModified: "Aug 10, 2025"
    }
  ];

  const templates = [
    {
      title: "User Retention",
      description: "Track how many users continue to use your product over time."
    },
    {
      title: "Event Frequency",
      description: "Analyze how often users perform key actions in your product."
    },
    {
      title: "Conversion by Segment",
      description: "Compare conversion rates across different user segments."
    },
    {
      title: "User Journey",
      description: "Map the typical paths users take through your product."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Saved Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Saved Reports</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            New Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{report.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.lastModified}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-blue-600 hover:text-blue-900">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}