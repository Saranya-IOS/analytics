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
  BarElement,
  Filler
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
  BarElement,
  Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [topPages, setTopPages] = useState([
    { screen: 'Home', events: 134, users: 38 },
    { screen: 'Profile', events: 82, users: 22 },
    { screen: 'Settings', events: 45, users: 15 },
    { screen: 'Login', events: 67, users: 18 },
    { screen: 'Make Request', events: 87, users: 10 }
  ]);

  const [eventCounts, setEventCounts] = useState({
    labels: ['App Opened', 'Button Clicked', 'Incident Created', 'Log In', 'App Closed', 'LogOut', 'Home Screen', 'Raised Request'],
    datasets: [{
      data: [30, 25, 15, 20, 25, 20, 25, 20],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FF9F40',
        '#4BC0C0',
        '#FFCD56',
        '#9966FF',
        '#FF6384',
        '#36A2EB'
      ]
    }]
  });

  const [userInteractions, setUserInteractions] = useState({
    labels: ['Home', 'Profile', 'Settings', 'Dashboard'],
    datasets: [
      {
        label: 'Touch',
        data: [500, 300, 200, 400],
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Scroll',
        data: [300, 200, 100, 100],
        backgroundColor: '#FF6384'
      }
    ]
  });

  const [screenVisited, setScreenVisited] = useState({
    labels: ['Home', 'Profile', 'Settings', 'Search', 'Login'],
    datasets: [{
      label: 'Events',
      data: [150, 120, 90, 70, 40],
      backgroundColor: '#36A2EB'
    }]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
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
            <button className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg bg-blue-600">
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800">
              <span>Events</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800">
              <span>Users</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800">
              <span>Reports</span>
            </button>
            <button className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800">
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
              <span className="text-gray-700">{user && (user.first_name + " " + user.last_name)}</span>
            </div>
          </div>
        </header>

        <main className="p-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Top Pages by Screen */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Top Pages by Screen</h2>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="ml-3">{page.screen}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{page.events} events</div>
                      <div className="text-sm text-gray-500">{page.users} users</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Counts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Event Counts</h2>
              <div className="h-80">
                <Doughnut 
                  data={eventCounts}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12
                        }
                      }
                    },
                    cutout: '60%'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* User Interactions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">User Interactions (Touch / Scroll)</h2>
              <div className="h-80">
                <Bar 
                  data={userInteractions}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Screen Visited */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Screen Visited</h2>
              <div className="h-80">
                <Bar 
                  data={screenVisited}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      x: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}