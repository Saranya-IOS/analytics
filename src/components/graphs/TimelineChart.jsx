import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function TimelineChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('timeline-chart').getContext('2d');

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(255, 99, 132, 1)');
    gradient1.addColorStop(1, 'rgba(255, 99, 132, 0.2)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(54, 162, 235, 1)');
    gradient2.addColorStop(1, 'rgba(54, 162, 235, 0.2)');

    const datasets = data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: index === 0 ? gradient1 : gradient2,
      backgroundColor: index === 0 ? 'rgba(255, 99, 132, 0.1)' : 'rgba(54, 162, 235, 0.1)',
      pointBackgroundColor: index === 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
      pointBorderColor: index === 0 ? 'rgb(252, 0, 93)' : 'rgb(0, 138, 230)',
      pointStyle: index === 0 ? 'rectRounded' : 'rectRotstar',
      pointRadius: 3,
      fill: true,
      tension: 0.4
    }));

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutBounce'
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: 'rgba(0, 0, 0, 0.7)'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 16,
              weight: 'bold'
            },
            bodyFont: {
              size: 14
            },
            footerFont: {
              size: 12,
              style: 'italic'
            },
            callbacks: {
              label: function (tooltipItem) {
                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
              }
            }
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(0, 0, 0, 0.7)'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: 'rgba(0, 0, 0, 0.7)'
            }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div
      className="card"
      /* Use existing “card” class from your stylesheet for radius & shadow */
      style={{
        padding: 'var(--space-6)',
      }}
    >
      {/* Flexbox layout for title and actions */}
      <div className="flex justify-between items-center mb-3">
        <div className="card-title">Users Sessions Timeline</div>
        <div className="card-actions">
            <div className="relative group">
            <button className="btn btn-secondary btn-sm flex items-center">
              <i className="fas fa-download mr-1"></i> Export
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
              In Progress
            </div>
          </div>
        </div>
      </div>
      <div className="h-80">
        <canvas id="timeline-chart"></canvas>
      </div>
    </div>
  );
}