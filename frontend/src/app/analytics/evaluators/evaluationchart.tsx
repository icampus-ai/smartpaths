import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

const legendStyle: React.CSSProperties = {
  marginTop: '20px', // Adjusted margin for tighter spacing
  textAlign: 'center' as 'center',
  lineHeight: '24px',
};

interface RadialBarChartProps {
  width?: string | number; // Width of the chart (e.g., "100%" or 400)
  height?: string | number; // Height of the chart (e.g., "100%" or 400)
}

const RadialBarChartComponent: React.FC<RadialBarChartProps> = ({ width = '90%', height = 400 }) => {
  const [data, setData] = useState([
    { name: 'Completed : 30%', uv: 30, fill: '#8884d8' },
    { name: 'Pending : 60%', uv: 60, fill: '#83a6ed' },
    { name: 'Approved : 10%', uv: 10, fill: '#8dd1e1' },
  ]);

  useEffect(() => {
    // Fetch data from the backend
    fetch('/api/evaluation-data') // Adjust the API endpoint as needed
      .then(response => response.json())
      .then(data => {
        setData([
          { name: `Completed : ${data.completed}%`, uv: data.completed, fill: '#8884d8' },
          { name: `Pending : ${data.pending}%`, uv: data.pending, fill: '#83a6ed' },
          { name: `Approved : ${data.approved}%`, uv: data.approved, fill: '#8dd1e1' },
        ]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ width, height, padding: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={10} data={data}>
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                return (
                  <div
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      padding: '5px',
                      borderRadius: '5px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{payload[0].payload.name}</span>
                  </div>
                );
              }
              return null;
            }}
          />
          <RadialBar background dataKey="uv" />
          {/* Legend with adjusted margin for spacing */}
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="bottom"
            wrapperStyle={legendStyle}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadialBarChartComponent;