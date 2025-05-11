import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for charts
  const timelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Events',
        data: [100, 200, 300, 400, 500, 200, 166],
        fill: true,
        borderColor: 'rgba(66, 99, 235, 1)',
        backgroundColor: 'rgba(66, 99, 235, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Interactions',
        data: [150, 250, 350, 450, 550, 250, 216],
        fill: true,
        borderColor: 'rgb(66, 235, 156)',
        backgroundColor: 'rgba(86, 235, 66, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const eventTypesData = {
    labels: ['Page Views', 'Clicks', 'Signups', 'Purchases'],
    datasets: [{
      data: [300, 200, 150, 100],
      backgroundColor: [
        'rgba(66, 99, 235, 0.8)',
        'rgba(126, 87, 194, 0.8)',
        'rgba(0, 191, 165, 0.8)',
        'rgba(76, 175, 80, 0.8)',
      ],
    }]
  };

  const sectionViewsData = {
    labels: ['Home', 'Products', 'About', 'Contact', 'Blog'],
    datasets: [{
      label: 'Page Views',
      data: [1200, 900, 600, 400, 800],
      backgroundColor: 'rgba(66, 99, 235, 0.8)',
      borderRadius: 4,
    }]
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-green-500 text-sm mt-2">↑ 12.5% vs last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Active Users</h3>
                <p className="text-3xl font-bold">892</p>
                <p className="text-green-500 text-sm mt-2">↑ 8.2% vs last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">$12,345</p>
                <p className="text-red-500 text-sm mt-2">↓ 3.1% vs last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Conversion Rate</h3>
                <p className="text-3xl font-bold">2.4%</p>
                <p className="text-green-500 text-sm mt-2">↑ 15.4% vs last period</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Events Timeline</h2>
                <div className="h-80">
                  <Line 
                    data={timelineData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Event Types</h2>
                <div className="h-80">
                  <Doughnut 
                    data={eventTypesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Page Views by Section</h2>
              <div className="h-80">
                <Bar 
                  data={sectionViewsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </>
        );
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Events</h2>
            {/* Add your events content here */}
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Reports</h2>
            {/* Add your reports content here */}
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            {/* Add your settings content here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Analytics Pro</span>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Events</span>
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Reports</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800"
            >
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">John Doe</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}