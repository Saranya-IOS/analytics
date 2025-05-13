export class SidebarComponent {
  constructor(container) {
    this.container = container;
    this.activeItem = '/';
    this.onNavigate = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="fas fa-chart-line logo-icon"></i>
          <span>AnalyticsPro</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-group-title">Analytics</div>
          <div class="nav-item ${this.activeItem === '/' ? 'active' : ''}" data-path="/">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div class="nav-item ${this.activeItem === '/events' ? 'active' : ''}" data-path="/events">
            <i class="fas fa-bolt"></i>
            <span>Events</span>
          </div>
          <div class="nav-item ${this.activeItem === '/users' ? 'active' : ''}" data-path="/users">
            <i class="fas fa-users"></i>
            <span>User Profiles</span>
          </div>
          <div class="nav-item ${this.activeItem === '/funnel' ? 'active' : ''}" data-path="/funnel">
            <i class="fas fa-filter"></i>
            <span>Funnel Analysis</span>
          </div>
        </div>
        <div class="nav-group">
          <div class="nav-group-title">Insights</div>
          <div class="nav-item ${this.activeItem === '/reports' ? 'active' : ''}" data-path="/reports">
            <i class="fas fa-file-alt"></i>
            <span>Reports</span>
          </div>
        </div>
        <div class="nav-group">
          <div class="nav-group-title">Admin</div>
          <div class="nav-item ${this.activeItem === '/settings' ? 'active' : ''}" data-path="/settings">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </div>
         <div class="nav-item">
          <a href="/logout" style="display: flex; align-items: center; gap: 10px; color: inherit; text-decoration: none;">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
          </a>
        </div>
        </div>
      </nav>
    `;

    // Add event listeners
    this.container.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const path = item.dataset.path;
        if (this.onNavigate) {
          this.onNavigate(path);
        }
      });
    });
  }

  setActiveItem(path) {
    this.activeItem = path;

    // Update active state in the DOM
    this.container.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.path === path) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}