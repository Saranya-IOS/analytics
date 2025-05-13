import { AnalyticsApi } from '../api/analyticsApi.js';

export class UsersPage {
  constructor(container) {
    this.container = container;
    this.users = [];
    this.totalUsers = 0;
    this.currentPage = 1;
    this.limit = 20;
  }
  
  async render() {
    this.showLoading();
    
    try {
      await this.loadUsers();
      this.renderUsersPage();
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  async loadUsers() {
    const offset = (this.currentPage - 1) * this.limit;
    const result = await AnalyticsApi.getUsers({
      limit: this.limit,
      offset: offset
    });
    
    this.users = result.users;
    this.totalUsers = result.total;
  }
  
  showLoading() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    `;
  }
  
  showError(message) {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="card" style="text-align: center; color: var(--color-error-600);">
          <h3>Error Loading Users</h3>
          <p>${message}</p>
          <button class="btn btn-primary" id="retry-button">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('retry-button').addEventListener('click', () => {
      this.render();
    });
  }
  
  renderUsersPage() {
    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>User Profiles</h1>
          <p>Showing ${this.users.length} of ${this.totalUsers} users</p>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Users</div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>First Seen</th>
                  <th>Last Seen</th>
                  <th>Platform</th>
                  <th>Country</th>
                  <th>Events</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="users-table-body">
              </tbody>
            </table>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: var(--space-4);">
            <div>
              <button class="btn btn-secondary" id="prev-page-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
              </button>
              <span style="margin: 0 var(--space-2);">Page ${this.currentPage}</span>
              <button class="btn btn-secondary" id="next-page-btn" ${this.currentPage * this.limit >= this.totalUsers ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div>
              <select class="form-select" id="page-size-select">
                <option value="10" ${this.limit === 10 ? 'selected' : ''}>10 per page</option>
                <option value="20" ${this.limit === 20 ? 'selected' : ''}>20 per page</option>
                <option value="50" ${this.limit === 50 ? 'selected' : ''}>50 per page</option>
                <option value="100" ${this.limit === 100 ? 'selected' : ''}>100 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.renderUsersTable();
    this.addEventListeners();
  }
  
  renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    
    if (this.users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: var(--space-8);">
            <i class="fas fa-users" style="font-size: 2rem; color: var(--color-gray-400); margin-bottom: var(--space-4);"></i>
            <p>No users found.</p>
          </td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = this.users.map(user => {
      const firstSeen = new Date(user.first_seen).toLocaleDateString();
      const lastSeen = new Date(user.last_seen).toLocaleDateString();
      
      return `
        <tr>
          <td>${user.full_name}</td>
          <td>${firstSeen}</td>
          <td>${lastSeen}</td>
          <td>${user.platform || 'Unknown'}</td>
          <td>
            <span class="badge badge-secondary">${user.country || 'Unknown'}</span>
          </td>
          <td>${user.events_count}</td>
          <td>
            <button class="btn btn-secondary btn-sm" data-user-id="${user.id}">
              <i class="fas fa-info-circle"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  addEventListeners() {
    // Pagination
    document.getElementById('prev-page-btn').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });
    
    document.getElementById('next-page-btn').addEventListener('click', () => {
      if (this.currentPage * this.limit < this.totalUsers) {
        this.currentPage++;
        this.render();
      }
    });
    
    // Page size change
    document.getElementById('page-size-select').addEventListener('change', (e) => {
      this.limit = parseInt(e.target.value);
      this.currentPage = 1;
      this.render();
    });
    
    // User details buttons
    document.querySelectorAll('[data-user-id]').forEach(button => {
      button.addEventListener('click', (e) => {
        const userId = e.currentTarget.dataset.userId;
        const user = this.users.find(u => u.id === userId);
        if (user) {
          this.showUserDetails(user);
        }
      });
    });
  }
  
  showUserDetails(user) {
    // Create a modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.right = '0';
    modalOverlay.style.bottom = '0';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.zIndex = 'var(--z-50)';
    modalOverlay.style.padding = 'var(--space-4)';
    modalOverlay.classList.add('fade-in');
    
    // Format dates
    const firstSeen = new Date(user.first_seen).toLocaleString();
    const lastSeen = new Date(user.last_seen).toLocaleString();
    
    // Calculate days active
    const firstSeenDate = new Date(user.first_seen);
    const lastSeenDate = new Date(user.last_seen);
    const daysActive = Math.ceil((lastSeenDate - firstSeenDate) / (1000 * 60 * 60 * 24));
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = 'var(--radius-lg)';
    modalContent.style.boxShadow = 'var(--shadow-xl)';
    modalContent.style.width = '100%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflow = 'auto';
    modalContent.style.animation = 'slideUp var(--transition-normal) var(--ease-out)';
    
    modalContent.innerHTML = `
      <div style="padding: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3 style="margin: 0;">User Profile</h3>
          <button class="btn btn-secondary btn-sm close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div style="text-align: center; margin-bottom: var(--space-6); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-gray-200);">
          <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-primary-100); color: var(--color-primary-700); font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4) auto;">
            <i class="fas fa-user"></i>
          </div>
          <h4 style="margin-bottom: var(--space-2);">${user.id}</h4>
          <div>
            <span class="badge badge-secondary">${user.country || 'Unknown'}</span>
            <span class="badge badge-primary">${user.platform || 'Unknown'}</span>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
          <div class="metric-card" style="text-align: center; padding: var(--space-4);">
            <div class="metric-label">First Seen</div>
            <div class="metric-value" style="font-size: var(--text-xl);">${firstSeen}</div>
          </div>
          
          <div class="metric-card" style="text-align: center; padding: var(--space-4);">
            <div class="metric-label">Last Seen</div>
            <div class="metric-value" style="font-size: var(--text-xl);">${lastSeen}</div>
          </div>
          
          <div class="metric-card" style="text-align: center; padding: var(--space-4);">
            <div class="metric-label">Days Active</div>
            <div class="metric-value" style="font-size: var(--text-xl);">${daysActive}</div>
          </div>
          
          <div class="metric-card" style="text-align: center; padding: var(--space-4);">
            <div class="metric-label">Total Events</div>
            <div class="metric-value" style="font-size: var(--text-xl);">${user.events_count}</div>
          </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: var(--space-2);">
          <button class="btn btn-secondary">View Events</button>
          <button class="btn btn-primary">Export Data</button>
        </div>
      </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close the modal when the close button is clicked
    modalContent.querySelector('.close-modal').addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
    });
    
    // Close the modal when clicking outside the content
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
  }
}