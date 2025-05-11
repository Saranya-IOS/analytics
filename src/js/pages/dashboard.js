import { AnalyticsApi } from '../api/analyticsApi.js';
import { ChartUtils } from '../utils/chartUtils.js';

export class DashboardPage {
  constructor(container) {
    this.container = container;
    this.dashboardData = null;
  }

  async render() {
    this.showLoading();

    try {
      // Fetch dashboard data
      this.dashboardData = await AnalyticsApi.getDashboardData();
      this.renderDashboard();
    } catch (error) {
      this.showError(error.message);
    }
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    `;
  }

  showError(message) {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="card" style="text-align: center; color: var(--color-error-600);">
          <h3>Error Loading Dashboard</h3>
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

  renderDashboard() {
    const { events_total, events_by_type, events_by_day, active_users, funnel_data } = this.dashboardData;

    this.container.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-header">
          <h1>Analytics Dashboard</h1>
        </div>
        
        <div class="metric-grid slide-up">
          <div class="metric-card">
            <div class="metric-value">${ChartUtils.formatNumber(events_total)}</div>
            <div class="metric-label">Total Events</div>
            <div class="metric-trend trend-up">
              <i class="fas fa-arrow-up"></i> 12.5% vs last period
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${ChartUtils.formatNumber(active_users)}</div>
            <div class="metric-label">Active Users</div>
            <div class="metric-trend trend-up">
              <i class="fas fa-arrow-up"></i> 8.2% vs last period
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${ChartUtils.formatNumber(funnel_data.purchase || 0)}</div>
            <div class="metric-label">Purchases</div>
            <div class="metric-trend trend-down">
              <i class="fas fa-arrow-down"></i> 3.1% vs last period
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">$${ChartUtils.formatNumber(Math.round(Math.random() * 25000))}</div>
            <div class="metric-label">Revenue</div>
            <div class="metric-trend trend-up">
              <i class="fas fa-arrow-up"></i> 15.4% vs last period
            </div>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Events Timeline</div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="events-timeline-chart"></canvas>
          </div>
        </div>
        
        <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Event Types Breakdown</div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap;">
            <div class="chart-container" style="width: 50%; min-width: 300px;">
              <canvas id="event-types-chart"></canvas>
            </div>
            <div style="flex: 1; min-width: 300px; padding: var(--space-4);">
              <h3 style="margin-bottom: var(--space-4);">Top Event Types</h3>
              <div id="event-types-list"></div>
            </div>
          </div>
        </div>

    <div style="display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-4);">
        <!-- Top Pages by Screen -->
          <div class="card slide-up" style="flex: 1; min-width: 300px;">
            <div class="card-header"> 
            <div class="card-title">Top Pages by Screen</div>
          </div>
       <div style="padding: var(--space-4);" id="top-pages-list"></div>
      </div>
        <!-- Page Views by Section -->
          <div class="card slide-up" style="flex: 1; min-width: 300px;">
            <div class="card-header">
              <div class="card-title">Page Views by Section</div>
            </div>
          <div class="chart-container" style="height: 300px;">
        <canvas id="section-views-chart"></canvas>
        </div>
      </div>
    </div>
        
        <!-- <div class="card slide-up">
          <div class="card-header">
            <div class="card-title">Conversion Funnel</div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm">
                <i class="fas fa-filter"></i> Customize
              </button>
            </div>
          </div>
          <div class="funnel-container" id="funnel-visualization"></div>
        </div> --!>
      </div>
    `;

    // Initialize charts when the dashboard is rendered
    this.initializeCharts();
    this.renderEventTypesList();
    this.renderTopPagesList();
  }

  initializeCharts() {
    // Load Chart.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
      this.renderEventsTimelineChart();
      this.renderEventTypesChart();
      this.renderSectionViewsChart();
    };
    document.head.appendChild(script);
  }

  renderEventsTimelineChart() {
    const ctx = document.getElementById('events-timeline-chart').getContext('2d');

    // Prepare data for timeline chart
    const eventsByDay = this.dashboardData.events_by_day;
    const days = Object.keys(eventsByDay).sort();
    const counts = days.map(day => eventsByDay[day]);

    console.log("counts => ", counts)
    console.log("days => ", days)
    var interactions = [
      100,
      200,
      300,
      400,
      500,
      200,
      166,
      234,
      203,
      197,
      400,
      400,
      200
    ]
    // Create chart data
    const data = {
      labels: days.map(day => ChartUtils.formatDate(day)),
      datasets: [{
        label: 'Events',
        data: counts,
        fill: true,
        borderColor: 'rgba(66, 99, 235, 1)',
        backgroundColor: 'rgba(66, 99, 235, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(66, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }, {
        label: 'Interactions',
        data: interactions,
        fill: true,
        borderColor: 'rgb(66, 235, 156)',
        backgroundColor: 'rgba(86, 235, 66, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(66, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };

    // Create the chart
    window.eventsTimelineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        }
      }
    });
  }

  renderEventTypesChart() {
    const ctx = document.getElementById('event-types-chart').getContext('2d');

    // Prepare data for event types chart
    const eventsByType = this.dashboardData.events_by_type;
    const eventTypes = Object.keys(eventsByType);
    const counts = eventTypes.map(type => eventsByType[type]);

    // Define colors for each event type
    const backgroundColors = [
      'rgba(66, 99, 235, 0.8)',
      'rgba(126, 87, 194, 0.8)',
      'rgba(0, 191, 165, 0.8)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(255, 193, 7, 0.8)',
      'rgba(244, 67, 54, 0.8)'
    ];

    // Create chart data
    const data = {
      labels: eventTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')),
      datasets: [{
        data: counts,
        backgroundColor: backgroundColors.slice(0, eventTypes.length),
        borderWidth: 1
      }]
    };

    // Create the chart
    window.eventTypesChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          },
        },
        cutout: '60%',
      }
    });
  }

  renderEventTypesList() {
    const container = document.getElementById('event-types-list');
    const eventsByType = this.dashboardData.events_by_type;

    // Sort event types by count in descending order
    const sortedEventTypes = Object.entries(eventsByType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    // Create HTML for the list
    const html = sortedEventTypes.map(({ type, count }, index) => {
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
      const badgeClass = index === 0 ? 'badge-primary' : 'badge-secondary';

      return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-gray-200);">
          <div>
            <div style="display: flex; align-items: center;">
              <span class="badge ${badgeClass}" style="margin-right: var(--space-2);">${index + 1}</span>
              <span style="font-weight: var(--font-medium);">${formattedType}</span>
            </div>
          </div>
          <div>
            <span style="font-weight: var(--font-semibold);">${count}</span>
            <span style="color: var(--color-gray-500); margin-left: var(--space-2);">events</span>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  // Section View Chart
  renderSectionViewsChart() {

    const ctx = document.getElementById('section-views-chart').getContext('2d');
    const sectionViews = this.dashboardData.page_views_chart || {};

    const labels = Object.keys(sectionViews).map(
      key => key.charAt(0).toUpperCase() + key.slice(1)
    );

    const values = Object.values(sectionViews);

    const data = {
      labels,
      datasets: [{
        label: 'Page Views',
        data: values,
        backgroundColor: 'rgba(66, 99, 235, 0.8)',
        borderRadius: 4,
        barThickness: 28
      }]
    };

    new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          }
        }
      }
    });
  }



  // Top Pages List
  renderTopPagesList() {
    const container = document.getElementById('top-pages-list');
    const topPages = this.dashboardData.top_pages || [];

    const html = topPages.map(({ screen, views }, index) => {
      const badgeClass = index === 0 ? 'badge-primary' : 'badge-secondary';

      return `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-gray-200);">
  <div style="display: flex; align-items: center;">
  <span class="badge ${badgeClass}" style="margin-right: var(--space-2);">${index + 1}</span>
  <span style="font-weight: var(--font-medium);">${screen}</span>
  </div>
  <div>
  <span style="font-weight: var(--font-semibold);">${views}</span>
  <span style="color: var(--color-gray-500); margin-left: var(--space-2);">views</span>
  </div>
  </div>
      `;
    }).join('');

    container.innerHTML = html;
  }
}