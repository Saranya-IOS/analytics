import { AnalyticsApi } from '../api/analyticsApi.js';

export class EventsPage {
  constructor(container) {
    this.container = container;
    this.events = [];
    this.totalEvents = 0;
    this.currentPage = 1;
    this.limit = 20;
    this.filters = {
      eventType: ''
    };
  }

  async render() {
    this.showLoading();

    try {
      await this.loadEvents();
      this.renderEventsPage();
    } catch (error) {
      this.showError(error.message);
    }
  }

  async loadEvents() {
    const offset = (this.currentPage - 1) * this.limit;
    const result = await AnalyticsApi.getEvents({
      limit: this.limit,
      offset: offset,
      eventType: this.filters.eventType
    });

    this.events = result.events;
    this.totalEvents = result.total;
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    `;
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="card" style="text-align: center; color: var(--color-error-600);">
          <h3>Error Loading Events</h3>
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

  renderEventsPage() {
    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>Events</h1>
          <p>Showing ${this.events.length} of ${this.totalEvents} events</p>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Event Filters</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-4);">
            <div class="form-group" style="min-width: 200px;">
              <label class="form-label" for="event-type-filter">Event Type</label>
              <select class="form-select" id="event-type-filter">
                <option value="">All Events</option>
                <option value="page_view" ${this.filters.eventType === 'page_view' ? 'selected' : ''}>Page View</option>
                <option value="button_click" ${this.filters.eventType === 'button_click' ? 'selected' : ''}>Button Click</option>
                <option value="signup" ${this.filters.eventType === 'signup' ? 'selected' : ''}>Signup</option>
                <option value="login" ${this.filters.eventType === 'login' ? 'selected' : ''}>Login</option>
                <option value="purchase" ${this.filters.eventType === 'purchase' ? 'selected' : ''}>Purchase</option>
                <option value="share" ${this.filters.eventType === 'share' ? 'selected' : ''}>Share</option>
              </select>
            </div>
            
            <div class="form-group" style="min-width: 200px;">
              <label class="form-label" for="date-range-filter">Date Range</label>
              <select class="form-select" id="date-range-filter">
                <option value="7">Last 7 days</option>
                <option value="30" selected>Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div style="align-self: flex-end;">
              <button class="btn btn-primary" id="apply-filters-btn">
                <i class="fas fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Events List</div>
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
               <th>Event Name</th>
               <th>User ID</th>
               <th>Event Type</th>
               <th>Screen</th>
               <th>Touch Count</th>
               <th>Scroll Count</th>
               <th>Timestamp</th>
               </tr>
              </thead>
              <tbody id="events-table-body">
              </tbody>
            </table>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: var(--space-4);">
            <div>
              <button class="btn btn-secondary" id="prev-page-btn" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
              </button>
              <span style="margin: 0 var(--space-2);">Page ${this.currentPage}</span>
              <button class="btn btn-secondary" id="next-page-btn" ${this.currentPage * this.limit >= this.totalEvents ? 'disabled' : ''}>
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

    this.renderEventsTable();
    this.addEventListeners();
  }

  renderEventsTable() {
    const tableBody = document.getElementById('events-table-body');

    if (this.events.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: var(--space-8);">
            <i class="fas fa-search" style="font-size: 2rem; color: var(--color-gray-400); margin-bottom: var(--space-4);"></i>
            <p>No events found matching your filters.</p>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = this.events.map(event => {
      const timestamp = new Date(event.timestamp).toLocaleString();
      
      return `
<tr>
    <td>${event.event_name}</td>
    <td>${event.user_id}</td>
    <td><span class="badge badge-primary">${event.event_type}</span></td>
    <td>${event.screen_name}</td>
    <td>${event.touch_count}</td>
    <td>${event.scroll_count}</td>
    <td>${timestamp}</td>
    <td>
    <button class="btn btn-secondary btn-sm" data-event-id="${this.events.indexOf(event)}">
    <i class="fas fa-info-circle"></i>
    </button>
  </td>
</tr>
`;
    }).join('');
  }

  addEventListeners() {
    // Event type filter change
    document.getElementById('event-type-filter').addEventListener('change', (e) => {
      this.filters.eventType = e.target.value;
    });

    // Apply filters button
    document.getElementById('apply-filters-btn').addEventListener('click', () => {
      this.currentPage = 1;
      this.render();
    });

    // Pagination
    document.getElementById('prev-page-btn').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });

    document.getElementById('next-page-btn').addEventListener('click', () => {
      if (this.currentPage * this.limit < this.totalEvents) {
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

    // Event details buttons
    document.querySelectorAll('[data-event-id]').forEach(button => {
      button.addEventListener('click', (e) => {
        const eventId = parseInt(e.currentTarget.dataset.eventId);
        this.showEventDetails(this.events[eventId]);
      });
    });
  }

  showEventDetails(event) {
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

    // Create the modal content
    const timestamp = new Date(event.timestamp).toLocaleString();
    const propertiesFormatted = JSON.stringify({
      event_id: event.event_id,
      screen_name: event.screen_name,
      scroll_count: event.scroll_count,
      touch_count: event.touch_count,
      session_id: event.session_id
    }, null, 2);

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
          <h3 style="margin: 0;">Event Details</h3>
          <button class="btn btn-secondary btn-sm close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div style="margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-gray-200);">
          <div style="display: flex; margin-bottom: var(--space-2);">
            <div style="width: 120px; font-weight: var(--font-medium); color: var(--color-gray-600);">Event Type:</div>
            <div><span class="badge badge-primary">${event.event_type}</span></div>
          </div>
          <div style="display: flex; margin-bottom: var(--space-2);">
            <div style="width: 120px; font-weight: var(--font-medium); color: var(--color-gray-600);">User ID:</div>
            <div>${event.user_id}</div>
          </div>
          <div style="display: flex; margin-bottom: var(--space-2);">
            <div style="width: 120px; font-weight: var(--font-medium); color: var(--color-gray-600);">Timestamp:</div>
            <div>${timestamp}</div>
          </div>
        </div>
        
        <div>
          <h4 style="margin-bottom: var(--space-2);">Properties</h4>
          <pre style="background-color: var(--color-gray-50); padding: var(--space-4); border-radius: var(--radius); overflow: auto; max-height: 300px; font-size: var(--text-sm);">${propertiesFormatted}</pre>
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