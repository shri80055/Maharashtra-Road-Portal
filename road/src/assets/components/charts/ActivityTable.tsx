const data = [
    {
      uid: "MH-MR-1006",
      road:
        "Lasalgaon Onion Market Bypass",
      village: "Lasalgaon",
      status: "Draft",
      date: "2026-06-09",
    },
    {
      uid: "MH-MR-1007",
      road: "Village Connector Road",
      village: "Pune",
      status: "Submitted",
      date: "2026-06-10",
    },
    {
      uid: "MH-MR-1008",
      road: "Agricultural Access Path",
      village: "Nagpur",
      status: "Approved",
      date: "2026-06-12",
    },
  ];
  
  export default function ActivityTable() {
    return (
      <div className="table-wrapper">
  
        <div className="activity-table-toolbar">
  
          <h3 className="chart-title">
            Recent Activity Stream
          </h3>
  
          <button className="widget-link-button">
            View Registry
          </button>
  
        </div>
  
        <table className="activity-table">
  
          <thead className="table-header">
  
            <tr className="activity-table-head-row">
  
              <th className="activity-th">
                Road UID
              </th>
  
              <th className="activity-th">
                Road Name
              </th>
  
              <th className="activity-th">
                Village
              </th>
  
              <th className="activity-th">
                Status
              </th>
  
              <th className="activity-th">
                Activity Date
              </th>
  
            </tr>
  
          </thead>
  
          <tbody>
  
            {data.map((row) => (
              <tr
                key={row.uid}
                className="table-row"
              >
                <td className="activity-td">
                  {row.uid}
                </td>
  
                <td className="activity-td activity-td-strong">
                  {row.road}
                </td>
  
                <td className="activity-td">
                  {row.village}
                </td>
  
                <td className="activity-td">
  
                  <span
                    className={`activity-status-pill ${
                      row.status === "Approved"
                        ? "badge-success"
                        : row.status ===
                          "Submitted"
                        ? "badge-info"
                        : "badge-warning"
                    }`}
                  >
                    {row.status}
                  </span>
  
                </td>
  
                <td className="activity-td">
                  {row.date}
                </td>
              </tr>
            ))}
  
          </tbody>
  
        </table>
      </div>
    );
  }