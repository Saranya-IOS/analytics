import React from 'react';

import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
export default function ScreenVisitedChart({ rawData }) {

  if (!rawData || rawData.length === 0) {
    return <p>Loading or no data</p>;
  }

  const labels = rawData.map(d => d.screen_name);
  const values = rawData.map(d => d.event_count);
  /* Read CSS variables from :root */
  const css = getComputedStyle(document.documentElement);
  const blue = css.getPropertyValue('--color-primary-600').trim() || '#4f46e5';

  const data = {
    labels,
    datasets: [

      {
        label: 'Event Count',
        data: values,
        backgroundColor: blue,
        hoverBackgroundColor: 'rgba(66, 99, 235, 0.4)',
        borderRadius: 4,
        barThickness: 35,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutCubic',
    },

    plugins: {

      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.parsed.x} events`,
        },

        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#444',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 10,
      },

    },

    scales: {

      x: {

        grid: { display: false, drawBorder: false },

        ticks: {
          color: '#555',
          font: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
        },

        title: {
          display: true,
          text: 'Events',
          color: '#555',
          font: { size: 14, weight: 'bold' },
        },
      },

      y: {

        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#333',
          font: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
        },

        title: {
          display: true,
          text: 'Screen',
          color: '#555',
          font: { size: 14, weight: 'bold' },
        },
      },
    },
  };

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
        <div className="card-title">Screens Visited</div>
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
      <div className="chart-container" style={{ height: 320 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}