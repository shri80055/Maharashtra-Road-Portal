import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
  } from "recharts";
  
  const data = [
    { name: "Type A", value: 35 },
    { name: "Type B", value: 20 },
    { name: "Type C", value: 18 },
    { name: "Type D", value: 15 },
    { name: "Type E", value: 12 },
  ];
  
  const COLORS = [
    "#0F766E",
    "#14B8A6",
    "#2DD4BF",
    "#F59E0B",
    "#3B82F6",
  ];
  
  export default function RoadTypeChart() {
    return (
      <div className="chart-card">
  
        <h3 className="chart-title">
          Road Types Distribution
        </h3>
        <div className="chart-layout">  
            <div className="chart-panel">
                 <ResponsiveContainer
          width="100%"
          height="70%"
        >
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
            </div>
            <div className="chart-panel">
                <div className="road-type-legend">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="road-type-legend-row"
            >
              <div className="road-type-legend-item">
  
                <span
                  className="road-type-legend-dot"
                  style={{
                    backgroundColor:
                      COLORS[index],
                  }}
                />
  
                {item.name}
              </div>
  
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
            </div>
        </div>
  
       
  
        
  
      </div>
    );
  }