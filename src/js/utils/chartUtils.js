export class ChartUtils {
  // Format numbers with K, M abbreviations
  static formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  
  // Format date strings
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // Create a line chart with Chart.js
  static createLineChart(ctx, data, options = {}) {
    return new Chart(ctx, {
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
            position: 'top',
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
        },
        ...options
      }
    });
  }
  
  // Create a bar chart with Chart.js
  static createBarChart(ctx, data, options = {}) {
    return new Chart(ctx, {
      type: 'bar',
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
            position: 'top',
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
        },
        ...options
      }
    });
  }
  
  // Create a doughnut chart with Chart.js
  static createDoughnutChart(ctx, data, options = {}) {
    return new Chart(ctx, {
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
          },
          tooltip: {
            callbacks: {
              label: function(context) {
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
        ...options
      }
    });
  }
  
  // Prepare data for event timeline visualization
  static prepareTimelineData(events) {
    // Group events by day
    const groupedByDay = {};
    
    events.forEach(event => {
      const day = event.timestamp.split('T')[0];
      if (!groupedByDay[day]) {
        groupedByDay[day] = [];
      }
      groupedByDay[day].push(event);
    });
    
    // Sort days and format for chart
    const sortedDays = Object.keys(groupedByDay).sort();
    const labels = sortedDays.map(day => this.formatDate(day));
    const data = sortedDays.map(day => groupedByDay[day].length);
    
    return { labels, data };
  }
  
  // Generate gradients for charts
  static createGradient(ctx, colors) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    return gradient;
  }
}