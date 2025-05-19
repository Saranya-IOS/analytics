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
      <h2 className="h3" style={{ marginBottom: 'var(--space-6)' }}>
        Screens Visited
      </h2>
      <div className="chart-container" style={{ height: 320 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}