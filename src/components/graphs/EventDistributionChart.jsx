import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { color } from 'chart.js/helpers';

export default function EventDistributionChart({ data, brightColors, dullColors }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = document.getElementById('events-distribution-chart');
    const tooltipBox = document.getElementById('tooltip-box');
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

              tooltipBox.innerHTML = 
              `<div class="title" style="font-weight: 600; font-size: 15px; margin-bottom: 5px;">
                  ${event.event_name}
              </div>
              <div class="metrics" style="font-size: 14px; color: #333333; margin-bottom: 2px;">
                  ${event.count} events
              </div>
              <div class="details" style="font-size: 12px; color: #333333;">
                  ${event.percentage.toFixed(1)}% of total
              </div>`;

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

    <div
      className="card"
      /* Use existing “card” class from your stylesheet for radius & shadow */
    >
      <h2 className="text-xl font-bold mb-4 text-left">Event Counts</h2>

      <div className="flex flex-col items-center bg-gray-100 rounded-lg p-6">

        {/* Custom Legend on Top */}
        <div id="customLegend" className="flex flex-wrap justify-center gap-3 mb-6">
          {data.event_distribution.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white px-2 py-1 rounded-full shadow-sm"
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: brightColors[index] }}
              ></div>
              <span className="text-xs font-medium text-gray-700">{event.event_name}</span>
            </div>
          ))}
        </div>

        {/* Chart Canvas */}
        <div className="relative h-80">
          <canvas
            id="events-distribution-chart"
            className="w-[350px] h-[350]"
            />
          <div
            id="tooltip-box"
            className="absolute hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
          >
          </div>
        </div>
      </div>
    </div>
  );
}