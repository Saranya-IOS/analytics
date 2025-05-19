import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from 'chart.js'; 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* --- util: turn “#rrggbb” → “rgba(r,g,b,a)” ---------------------------- */
const hexToRgba = (hex, alpha = 1) => {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/.{1,2}/g)
    .map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function UserInteractionsChart({ data }) {
  /* Read CSS variables from :root */
  const css = getComputedStyle(document.documentElement);
  const blue = css.getPropertyValue('--color-primary-600').trim() || '#4f46e5';
  const blueLite = hexToRgba(blue, 0.5);
  const green = css.getPropertyValue('--color-success-600').trim() || '#16a34a';
  const greenLite = hexToRgba(green, 0.5);
  const axis = css.getPropertyValue('--color-gray-600').trim() || '#4b5563';
  const gridLine = css.getPropertyValue('--color-gray-200').trim() || '#e5e7eb';
  const tooltipBg = css.getPropertyValue('--color-gray-800').trim() || '#1f2937';

  /* Inject colours / bar options */

  const chartData = {
    ...data,
    datasets: data.datasets.map((ds) => {
      const isTouch = ds.label.toLowerCase().includes('touch');

      return {
        ...ds,
        backgroundColor: isTouch ? blue : green,
        borderColor: isTouch ? blue : green,
        hoverBackgroundColor: isTouch ? blueLite : greenLite,
        barThickness: 45,
        borderRadius: 5,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: axis,
          font: { family: 'Inter, sans-serif', weight: 600, size: 14 },
        },

      },

      tooltip: {
        backgroundColor: tooltipBg,
        titleFont: { size: 14, weight: 'var(--font-700)', family: 'Inter, sans-serif' },
        bodyFont: { size: 13, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 8,
      },
    },

    scales: {

      x: {
        ticks: {
          color: axis,
          font: { size: 12, family: 'Inter, sans-serif' },
        },
        grid: { display: false },
      },

      y: {
        beginAtZero: true,
        ticks: {
          color: axis,
          font: { size: 12, family: 'Inter, sans-serif' },
        },
        grid: { color: gridLine },
      },
    },
  };

  return (
    <div
      className="card"
      /* Use existing “card” class from your stylesheet for radius & shadow */
    >
      <h2 className="h3" style={{ marginBottom: 'var(--space-6)' }}>
        User Interactions (Touch / Scroll)
      </h2>
      <div className="chart-container" style={{ height: 320 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}