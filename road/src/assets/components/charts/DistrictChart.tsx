import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  const data = [
    {
      district: "Pune",
      approved: 30,
      pending: 10,
      rejected: 5,
    },
    {
      district: "Nagpur",
      approved: 18,
      pending: 6,
      rejected: 4,
    },
    {
      district: "Nashik",
      approved: 22,
      pending: 7,
      rejected: 3,
    },
    {
      district: "Thane",
      approved: 12,
      pending: 5,
      rejected: 3,
    },
    {
      district: "Aurangabad",
      approved: 15,
      pending: 8,
      rejected: 2,
    },
  ];
  
  export default function DistrictChart() {
    return (
      <div className="chart-card">
  
        <h3 className="chart-title">
          District Wise Road Allocations
        </h3>
  
        <ResponsiveContainer
          width="100%"
          height="90%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />
  
            <XAxis dataKey="district" />
  
            <YAxis />
  
            <Tooltip />
  
            <Bar
              dataKey="approved"
              fill="#16A34A"
              radius={[4, 4, 0, 0]}
            />
  
            <Bar
              dataKey="pending"
              fill="#0F766E"
              radius={[4, 4, 0, 0]}
            />
  
            <Bar
              dataKey="rejected"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
  
      </div>
    );
  }