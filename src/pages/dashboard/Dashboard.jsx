import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Users as UsersIcon, FileText, Settings as SettingsIcon, LogOut } from 'lucide-react';
import TimelineChart from '../../components/graphs/TimelineChart';
import TopPagesChart from '../../components/graphs/TopPagesChart';
import EventDistributionChart from '../../components/graphs/EventDistributionChart';
import UserInteractionsChart from '../../components/graphs/UserInteractionsChart';
import ScreenVisitedChart from '../../components/graphs/ScreenVisitedChart';
import Events from './Events';
import Reports from './Reports';
import Settings from './Settings';
import Users from './Users';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalEvents, setTotalEvents] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState({ labels: [], datasets: [] });
  const [topPages, setTopPages] = useState([]);
  const [eventData, setEventData] = useState({ total_events: 0, event_distribution: [] });
  const [userInteractions, setUserInteractions] = useState({ labels: [], datasets: [] });
  const [screenVisited, setScreenVisited] = useState([]);

  useEffect(() => {
    //fetchUsers();
    //fetchEvents();
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/app_user/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      console.log("User Counts", data.data.length);
      setTotalUsers(data.data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/analytics/events`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setTotalEvents(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchTimelineData(),
        fetchTopPages(),
        fetchEventDistribution(),
        fetchUserInteractions(),
        fetchScreenVisited()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchTimelineData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/users_sessions_line');
      const data = await response.json();

      const labels = data.map(item => item.date);
      const userCounts = data.map(item => item.user_count);
      const sessionCounts = data.map(item => item.session_count);

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
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    }
  };

  const fetchTopPages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/top_screens');
      const data = await response.json();
      console.log("Top Pages Data",data);
      setTopPages(data);
    } catch (error) {
      console.error('Error fetching top pages:', error);
    }
  };

  const fetchEventDistribution = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/event_donut');
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error('Error fetching event distribution:', error);
    }
  };

  const fetchUserInteractions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/user_interactions');
      const data = await response.json();

      setUserInteractions({
        labels: data.map(item => item.screen_name),
        datasets: [
          {
            label: 'Touch Count',
            data: data.map(item => item.touch_count),
            backgroundColor: 'rgba(66, 99, 235, 0.8)',
          },
          {
            label: 'Scroll Count',
            data: data.map(item => item.scroll_count),
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  };

  const fetchScreenVisited = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/screen_visited');
      const data = await response.json();
      console.log("Screen Visited Chart Data:", data);
 
      setScreenVisited(data);
    } catch (error) {
      console.error('Error fetching screen visited:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
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
                <p className="text-3xl font-bold">20</p>
                <p className="text-red-500 text-sm mt-2">↓ 3.1% vs last period</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Total Events</h3>
                <p className="text-3xl font-bold">20000</p>
                <p className="text-green-500 text-sm mt-2">↑ 15.4% vs last period</p>
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

            <div className="mt-6">
              <TimelineChart data={timelineData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <TopPagesChart data={topPages} />
              <EventDistributionChart
                data={eventData}
                brightColors={brightColors}
                dullColors={dullColors}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <UserInteractionsChart data={userInteractions} />
              <ScreenVisitedChart rawData={screenVisited} />
            </div>
          </>
        );
      case 'events':
        return <Events />;
      case 'users':
        return <Users />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />; 
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="/mitsubishi-logo.png" 
              alt="Mitsubishi Electric Logo" 
              className="w-32 h-auto"
            />
            <span className="text-2xl font-bold">ServiceKey Analytics</span>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            ><LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => handleTabChange('events')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            ><BarChart2 className="w-5 h-5" />
              <span>Events</span>
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            ><UsersIcon className="w-5 h-5" />
              <span>Users</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-800"
            ><LogOut className="w-5 h-5" />
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}