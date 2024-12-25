import React, { FC, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, BarProps, Cell } from 'recharts';

interface TriangleBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const getPath = (x: number, y: number, width: number, height: number): string => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar: React.FC<TriangleBarProps> = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const CustomShapeBarChart: FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const data = [
    { name: 'Accu.', value: 90 },
    { name: 'Knowl.', value: 85 },
    { name: 'Gra.', value: 95 },
    { name: 'Presentation', value: 80 },
  ];

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (!isClient) {
    return null;
  }

  return (
    <BarChart
      width={400}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 50, // Increased bottom margin to accommodate X-axis labels
      }}
    >
      <XAxis dataKey="name" tick={{ fontSize: 12 }} /> {/* Reduced font size */}
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#4CAF50" shape={(props: BarProps) => (
        <TriangleBar
          fill={props.fill || '#4CAF50'}
          x={Number(props.x)}
          y={Number(props.y)}
          width={Number(props.width)}
          height={Number(props.height)}
        />
      )}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
  );
};

export default CustomShapeBarChart;