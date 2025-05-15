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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Users Sessions Timeline</h2>
      <div className="h-80">
        <canvas id="timeline-chart"></canvas>
      </div>
    </div>
  );
}