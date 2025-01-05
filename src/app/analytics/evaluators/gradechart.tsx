import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

// Define the structure of data items
interface DataItem {
  name: string;
  value: number;
  color: string;
}

// Sample data with colors for each grade
const data: DataItem[] = [
  { name: 'Grade A', value: 400, color: '#0088FE' },
  { name: 'Grade B', value: 300, color: '#00C49F' },
  { name: 'Grade C', value: 300, color: '#FFBB28' },
  { name: 'Grade D', value: 200, color: '#FF8042' },
];

// Props for active shape rendering
interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DataItem;
  percent: number;
  value: number;
}

// Custom rendering for active pie slice
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Center label */}
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
        {payload.name}
      </text>
      {/* Main sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Highlight sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Pointer line */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* Students text */}
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>
        {`Students: ${value}`}
      </text>
      {/* Percentage */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#666"
        fontSize={10}
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PieChartComponent: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            activeIndex={activeIndex}
            activeShape={renderActiveShape as unknown as (props: any) => JSX.Element}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <path
                key={`slice-${index}`}
                d={`M`}
                fill={entry.color} // Dynamically assign color
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
