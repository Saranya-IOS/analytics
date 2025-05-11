import '../css/style.css';
import { Router } from './router.js';
import { SidebarComponent } from './components/sidebar.js';
import { HeaderComponent } from './components/header.js';
import { DashboardPage } from './pages/dashboard.js';
import { EventsPage } from './pages/events.js';
import { UsersPage } from './pages/users.js';
import { FunnelPage } from './pages/funnel.js';
import { ReportsPage } from './pages/reports.js';
import { SettingsPage } from './pages/settings.js';

// Initialize the app
class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.setupLayout();
    this.initializeRouter();
    this.addEventListeners();
  }
  
  setupLayout() {
    // Create main layout elements
    this.appElement.innerHTML = `
      <div class="main-layout">
        <div id="sidebar" class="sidebar"></div>
        <div class="content">
          <div id="header" class="header"></div>
          <div id="page-container"></div>
        </div>
      </div>
    `;
    
    // Initialize components
    this.sidebar = new SidebarComponent(document.getElementById('sidebar'));
    this.header = new HeaderComponent(document.getElementById('header'));
    this.pageContainer = document.getElementById('page-container');
  }
  
  initializeRouter() {
    // Configure routes
    const routes = [
      { path: '/', component: DashboardPage, title: 'Dashboard' },
      { path: '/events', component: EventsPage, title: 'Events' },
      { path: '/users', component: UsersPage, title: 'Users' },
      { path: '/funnel', component: FunnelPage, title: 'Funnel Analysis' },
      { path: '/reports', component: ReportsPage, title: 'Reports' },
      { path: '/settings', component: SettingsPage, title: 'Settings' }
    ];
    
    // Initialize router
    this.router = new Router(routes, this.pageContainer);
    
    // Navigate to initial route
    this.router.navigateTo(window.location.hash.slice(1) || '/');
    
    // Update sidebar active item when route changes
    this.router.onRouteChange = (path) => {
      this.sidebar.setActiveItem(path);
      const currentRoute = routes.find(route => route.path === path);
      if (currentRoute) {
        this.header.setTitle(currentRoute.title);
      }
    };
  }
  
  addEventListeners() {
    // Toggle sidebar on mobile
    document.addEventListener('click', (e) => {
      if (e.target.matches('.sidebar-toggle')) {
        document.querySelector('.main-layout').classList.toggle('sidebar-hidden');
      }
    });
    
    // Handle navigation clicks
    this.sidebar.onNavigate = (path) => {
      this.router.navigateTo(path);
    };
    
    // Handle dark mode toggle
    document.addEventListener('click', (e) => {
      if (e.target.matches('.theme-toggle')) {
        document.documentElement.classList.toggle('dark-mode');
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
      }
    });
  }
  
  // Check for saved theme preference
  initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      document.documentElement.classList.add('dark-mode');
    }
  }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initializeTheme();
});