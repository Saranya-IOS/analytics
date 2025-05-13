import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TimelineChart from '../../components/graphs/TimelineChart';
import TopPagesChart from '../../components/graphs/TopPagesChart';
import EventDistributionChart from '../../components/graphs/EventDistributionChart';
import UserInteractionsChart from '../../components/graphs/UserInteractionsChart';
import ScreenVisitedChart from '../../components/graphs/ScreenVisitedChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [timelineData, setTimelineData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Users',
        data: [],
        fill: true,
        borderColor: 'rgba(66, 99, 235, 1)',
        backgroundColor: 'rgba(66, 99, 235, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(66, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: 'Sessions',
        data: [],
        fill: true,
        borderColor: 'rgb(66, 235, 156)',
        backgroundColor: 'rgba(86, 235, 66, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(66, 235, 156)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  });

  const [eventData, setEventData] = useState({
    total_events: 0,
    event_distribution: []
  });

  const [topPages, setTopPages] = useState([]);
  const [userInteractions, setUserInteractions] = useState({
    labels: [],
    datasets: [
      {
        label: 'Touch',
        data: [],
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Scroll',
        data: [],
        backgroundColor: '#FF6384'
      }
    ]
  });

  const [screenVisited, setScreenVisited] = useState({
    labels: [],
    datasets: [{
      label: 'Events',
      data: [],
      backgroundColor: '#36A2EB'
    }]
  });

  const generateColorPairs = (count) => {
    const predefinedBrightColors = [
      '#FF5733', '#33C3FF', '#FF33F6', '#75FF33', '#FFC300',
      '#8E44AD', '#FF6F61', '#00E6E6', '#FF8C00', '#1E90FF'
    ];
    const brightColors = [];
    const dullColors = [];

    for (let i = 0; i < count; i++) {
      const base = predefinedBrightColors[i % predefinedBrightColors.length];
      brightColors.push(base);
      const r = parseInt(base.slice(1, 3), 16);
      const g = parseInt(base.slice(3, 5), 16);
      const b = parseInt(base.slice(5, 7), 16);
      dullColors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
    }
    return { brightColors, dullColors };
  };

  const { brightColors, dullColors } = generateColorPairs(eventData.event_distribution.length);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch timeline data
      const timelineResponse = await fetch('http://localhost:5000/api/analytics/users_sessions_line');
      const timelineData = await timelineResponse.json();
      
      const labels = timelineData.map(item => item.date);
      const userCounts = timelineData.map(item => item.user_count);
      const sessionCounts = timelineData.map(item => item.session_count);
      
      setTimelineData({
        labels: labels,
        datasets: [
          {
            label: 'Users',
            data: userCounts,
            fill: true,
            borderColor: 'rgba(66, 99, 235, 1)',
            backgroundColor: 'rgba(66, 99, 235, 0.1)',
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(66, 99, 235, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Sessions',
            data: sessionCounts,
            fill: true,
            borderColor: 'rgb(66, 235, 156)',
            backgroundColor: 'rgba(86, 235, 66, 0.1)',
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(66, 235, 156)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      });

      // Fetch top pages data
      const topPagesResponse = await fetch('http://localhost:5000/api/analytics/top_screens');
      const topPagesData = await topPagesResponse.json();
      setTopPages(topPagesData);

      // Fetch event distribution data
      const eventDistResponse = await fetch('http://localhost:5000/api/analytics/event_donut');
      const eventDistData = await eventDistResponse.json();
      setEventData(eventDistData);

      // Fetch user interactions data
      const interactionsResponse = await fetch('http://localhost:5000/api/analytics/user_interactions');
      const interactionsData = await interactionsResponse.json();
      interactionsData.labels = interactionsData.map(item => item.screen_name);
      interactionsData.touch_counts = interactionsData.map(item => item.touch_count);
      interactionsData.scroll_counts = interactionsData.map(item => item.scroll_count);
      setUserInteractions({
        labels: interactionsData.labels,
        datasets: [
          {
            label: 'Touch',
            data: interactionsData.touch_counts,
            backgroundColor: '#36A2EB'
          },
          {
            label: 'Scroll',
            data: interactionsData.scroll_counts,
            backgroundColor: '#FF6384'
          }
        ]
      });

      // Fetch screen visited data
      const screenVisitedResponse = await fetch('http://localhost:5000/api/analytics/screen_visited');
      const screenVisitedData = await screenVisitedResponse.json();
      screenVisitedData.labels = screenVisitedData.map(item => item.screen_name);
      screenVisitedData.counts = screenVisitedData.map(item => item.event_count);
      
      setScreenVisited({
        labels: screenVisitedData.labels,
        datasets: [{
          label: 'Events',
          data: screenVisitedData.counts,
          backgroundColor: '#36A2EB'
        }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

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
          {/* Metrics cards */}
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

          {/* Timeline Chart */}
          <div className="mt-6">
            <TimelineChart data={timelineData} />
          </div>

          {/* First row of charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TopPagesChart data={topPages} />
            <EventDistributionChart 
              data={eventData}
              brightColors={brightColors}
              dullColors={dullColors}
            />
          </div>

          {/* Second row of charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <UserInteractionsChart data={userInteractions} />
            <ScreenVisitedChart data={screenVisited} />
          </div>
        </main>
      </div>
    </div>
  );
}