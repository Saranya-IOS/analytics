export class SettingsPage {
  constructor(container) {
    this.container = container;
  }
  
  render() {
    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>Settings</h1>
          <p>Configure your analytics platform preferences</p>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Account Settings</div>
          </div>
          
          <div style="max-width: 600px;">
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <input type="email" id="email" class="form-input" value="user@example.com">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input type="password" id="password" class="form-input" value="••••••••">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="timezone">Timezone</label>
              <select id="timezone" class="form-select">
                <option value="UTC">UTC</option>
                <option value="America/New_York" selected>Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
            
            <div style="margin-top: var(--space-6);">
              <button class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Display Settings</div>
          </div>
          
          <div style="max-width: 600px;">
            <div class="form-group">
              <label class="form-label" for="theme">Theme</label>
              <select id="theme" class="form-select">
                <option value="light" selected>Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Preference</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="default-page">Default Landing Page</label>
              <select id="default-page" class="form-select">
                <option value="dashboard" selected>Dashboard</option>
                <option value="events">Events</option>
                <option value="users">User Profiles</option>
                <option value="funnel">Funnel Analysis</option>
                <option value="reports">Reports</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="date-format">Date Format</label>
              <select id="date-format" class="form-select">
                <option value="MM/DD/YYYY" selected>MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            
            <div style="margin-top: var(--space-6);">
              <button class="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">API Access</div>
          </div>
          
          <div>
            <div class="form-group">
              <label class="form-label">API Key</label>
              <div style="display: flex; gap: var(--space-2);">
                <input type="text" class="form-input" value="ak_7f9a8d6e5c4b3a2f1e0d" readonly style="flex: 1;">
                <button class="btn btn-secondary">
                  <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn btn-secondary">
                  <i class="fas fa-redo"></i> Regenerate
                </button>
              </div>
            </div>
            
            <div style="margin-top: var(--space-4);">
              <h4 style="margin-bottom: var(--space-2);">Endpoint URLs</h4>
              <div style="background-color: var(--color-gray-50); padding: var(--space-4); border-radius: var(--radius); font-family: monospace; margin-bottom: var(--space-4);">
                <div style="margin-bottom: var(--space-2);">
                  <span style="color: var(--color-gray-500);">Events API:</span>
                  <span>https://api.analyticspro.com/v1/events</span>
                </div>
                <div style="margin-bottom: var(--space-2);">
                  <span style="color: var(--color-gray-500);">Users API:</span>
                  <span>https://api.analyticspro.com/v1/users</span>
                </div>
                <div>
                  <span style="color: var(--color-gray-500);">Reports API:</span>
                  <span>https://api.analyticspro.com/v1/reports</span>
                </div>
              </div>
            </div>
            
            <div style="margin-top: var(--space-4);">
              <button class="btn btn-primary">
                <i class="fas fa-book"></i> View API Documentation
              </button>
            </div>
          </div>
        </div>
        
        <div class="card slide-up" style="border: 1px solid var(--color-error-200); background-color: var(--color-error-50);">
          <div class="card-header">
            <div class="card-title" style="color: var(--color-error-700);">Danger Zone</div>
          </div>
          
          <div>
            <p style="margin-bottom: var(--space-4);">These actions cannot be undone. Please proceed with caution.</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-4);">
              <button class="btn btn-secondary">
                <i class="fas fa-trash"></i> Clear All Data
              </button>
              
              <button class="btn btn-secondary">
                <i class="fas fa-user-minus"></i> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.addEventListeners();
  }
  
  addEventListeners() {
    // Theme selector
    const themeSelect = this.container.querySelector('#theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;
        
        if (theme === 'dark') {
          document.documentElement.classList.add('dark-mode');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark-mode');
        } else if (theme === 'system') {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark-mode');
          } else {
            document.documentElement.classList.remove('dark-mode');
          }
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
      });
    }
    
    // Copy API key button
    const copyButton = this.container.querySelector('.btn .fa-copy').closest('button');
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        const apiKeyInput = this.container.querySelector('input[readonly]');
        apiKeyInput.select();
        document.execCommand('copy');
        
        // Show a toast notification
        this.showToast('API key copied to clipboard!');
      });
    }
  }
  
  showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '1rem';
    toast.style.right = '1rem';
    toast.style.backgroundColor = 'var(--color-gray-800)';
    toast.style.color = 'white';
    toast.style.padding = 'var(--space-3) var(--space-6)';
    toast.style.borderRadius = 'var(--radius)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = 'var(--z-50)';
    toast.style.animation = 'fadeIn var(--transition-fast) var(--ease-out)';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'fadeOut var(--transition-fast) var(--ease-in)';
      toast.addEventListener('animationend', () => {
        document.body.removeChild(toast);
      });
    }, 3000);
  }
}