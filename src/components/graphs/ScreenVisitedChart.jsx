import { Bar } from 'react-chartjs-2';

export default function ScreenVisitedChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Screen Visited</h2>
      <div className="h-80">
        <Bar 
          data={data}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  );
}