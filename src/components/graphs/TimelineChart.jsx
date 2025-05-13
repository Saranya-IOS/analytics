import { Line } from 'react-chartjs-2';

export default function TimelineChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Users Sessions Timeline</h2>
      <div className="h-80">
        <Line 
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              filler: {
                propagate: true
              }
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
          }}
        />
      </div>
    </div>
  );
}