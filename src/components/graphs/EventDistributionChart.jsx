import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function EventDistributionChart({ data, brightColors, dullColors }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = document.getElementById('events-distribution-chart');
    const tooltipBox = document.getElementById('tooltipBox');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = data.event_distribution.map(e => e.event_name);
    const counts = data.event_distribution.map(e => e.count);

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: dullColors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 60,
          hoverBorderWidth: 4,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        cutout: '65%',
        layout: {
          padding: {
            left: 40,
            right: 40,
            top: 30,
            bottom: 30
          }
        },
        responsive: true,
        animation: { duration: 600, easing: 'easeOutExpo' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: false,
            external: function(context) {
              const tooltipModel = context.tooltip;

              if (tooltipModel.opacity === 0) {
                tooltipBox.style.display = 'none';
                return;
              }

              const index = tooltipModel.dataPoints[0].dataIndex;
              const event = data.event_distribution[index];
              const chartCanvas = context.chart.canvas;
              const arc = context.tooltip.dataPoints[0].element;

              const angle = (arc.startAngle + arc.endAngle) / 2;
              const radius = (arc.outerRadius + arc.innerRadius) / 2;

              const chartCenterX = chartCanvas.offsetLeft + chartCanvas.width / 2;
              const chartCenterY = chartCanvas.offsetTop + chartCanvas.height / 2;

              const tooltipX = chartCenterX + Math.cos(angle) * radius;
              const tooltipY = chartCenterY + Math.sin(angle) * radius;

              tooltipBox.innerHTML = `
                <div class="title">${event.event_name}</div>
                <div class="metrics">${event.count} events</div>
                <div class="details">${event.percentage.toFixed(1)}% of total</div>
              `;

              tooltipBox.style.display = 'block';
              tooltipBox.style.left = tooltipX - (tooltipBox.offsetWidth / 2) - 100 + 'px';
              tooltipBox.style.top = tooltipY - (tooltipBox.offsetHeight / 2) - 50 + 'px';
            }
          }
        },
        hover: {
          onHover: (event, chartElements) => {
            const dataset = chart.data.datasets[0];
            dataset.backgroundColor = dataset.backgroundColor.map((color, i) =>
              chartElements[0]?.index === i ? brightColors[i] : dullColors[i]
            );
            chart.update('none');
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [data, brightColors, dullColors]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Event Counts</h2>
      <div className="relative h-80">
        <canvas id="events-distribution-chart"></canvas>
        <div id="tooltipBox" className="absolute hidden bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="title font-semibold"></div>
          <div className="metrics text-sm text-gray-600"></div>
          <div className="details text-sm text-gray-500"></div>
        </div>
        <div id="customLegend" className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2">
          {data.event_distribution.map((event, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brightColors[index] }}></div>
              <span className="text-sm">{event.event_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}