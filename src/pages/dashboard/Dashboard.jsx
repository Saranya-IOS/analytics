import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [user, setUser] = useState(null);
  
  // ... (keep all your existing state and data fetching logic)

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
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Analytics Pro</span>
          </div>
        </div>
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleTabChange('events')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Events</span>
            </button>
            <button 
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Users</span>
            </button>
            <button 
              onClick={() => handleTabChange('reports')}
              className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
            >
              <span>Reports</span>
            </button>
            <button 
              onClick={() => handleTabChange('settings')}
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