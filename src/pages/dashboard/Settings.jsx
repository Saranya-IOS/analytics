import { useState, useEffect } from 'react';


export default function Settings() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState(null);

   useEffect(() => {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        console.log("Stored User", storedUser);
        setUser(JSON.parse(storedUser));
      } 
    }, []);
  

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('ak_7f9a8d6e5c4b3a2f1e0d');
    setToastMessage('API key copied to clipboard!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue= {user?.admin_user_email || ''}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/*<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="UTC">UTC</option>
              <option value="America/New_York" selected>Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div> */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Display Settings</h2>
        <div className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Preference</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Landing Page
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="dashboard">Dashboard</option>
              <option value="events">Events</option>
              <option value="users">User Profiles</option>
              <option value="funnel">Funnel Analysis</option>
              <option value="reports">Reports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* API Access */}
      {/* <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">API Access</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value="ak_7f9a8d6e5c4b3a2f1e0d"
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
              />
              <button
                onClick={handleCopyApiKey}
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Copy
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                Regenerate
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Endpoint URLs</h3>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">
                <span className="text-gray-500">Events API:</span>
                <span className="ml-2">https://api.analyticspro.com/v1/events</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-500">Users API:</span>
                <span className="ml-2">https://api.analyticspro.com/v1/users</span>
              </div>
              <div>
                <span className="text-gray-500">Reports API:</span>
                <span className="ml-2">https://api.analyticspro.com/v1/reports</span>
              </div>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            View API Documentation
          </button>
        </div>
      </div> *}

      {/* Danger Zone */}
      {/*<div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>
        <div className="space-x-4">
          <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200">
            Clear All Data
          </button>
          <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200">
            Delete Account
          </button>
        </div>
      </div>*/}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}