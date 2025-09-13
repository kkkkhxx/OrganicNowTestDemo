// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import Layout from "../component/layout";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [rooms, setRooms] = useState([]);

  // 👉 mock data เหมือนในรูป
  useEffect(() => {
    const mockRooms = [
      { number: 101, status: "available" },
      { number: 102, status: "available" },
      { number: 103, status: "unavailable" },
      { number: 104, status: "available" },
      { number: 105, status: "available" },
      { number: 106, status: "available" },
      { number: 107, status: "unavailable" },
      { number: 108, status: "available" },
      { number: 109, status: "available" },
      { number: 110, status: "unavailable" },
      { number: 111, status: "available" },
      { number: 112, status: "available" },

      { number: 201, status: "available" },
      { number: 202, status: "available" },
      { number: 203, status: "available" },
      { number: 204, status: "unavailable" },
      { number: 205, status: "available" },
      { number: 206, status: "available" },
      { number: 207, status: "available" },
      { number: 208, status: "available" },
      { number: 209, status: "available" },
      { number: 210, status: "available" },
      { number: 211, status: "repair" },
      { number: 212, status: "available" },
    ];
    setRooms(mockRooms);
  }, []);

  // 👉 summary
  const summary = rooms.reduce(
    (acc, room) => {
      if (room.status === "available") acc.available += 1;
      else if (room.status === "unavailable") acc.unavailable += 1;
      else if (room.status === "repair") acc.repair += 1;
      return acc;
    },
    { available: 0, unavailable: 0, repair: 0 }
  );

  // 👉 floor grouping
  const floor1 = rooms.filter((r) => r.number >= 101 && r.number <= 112);
  const floor2 = rooms.filter((r) => r.number >= 201 && r.number <= 212);

  // mock chart data
  const requestOverviewData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Requests",
        data: [150, 300, 250, 500, 750, 600, 400, 550, 420, 580],
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const requestHistoryData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Fix",
        data: [50, 60, 10, 70, 30],
        backgroundColor: "rgba(239, 68, 68, 0.8)", // red
      },
      {
        label: "Shift",
        data: [20, 15, 5, 30, 25],
        backgroundColor: "rgba(59, 130, 246, 0.8)", // blue
      },
    ],
  };

  return (
    <Layout title="Dashboard" icon="pi pi-home" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-11 p-4">
            <div className="table-wrapper-detail rounded-0">
              <div className="row g-4">
                {/* Room Overview */}
                  <div className="col-lg-5">
                    <div className="card border-0 shadow-sm rounded-2 h-100">
                      <div className="card-body">
                        <h5 className="card-title mb-3">Room Overview</h5>

                        <div className="row">
                          {/* Floor 1 */}
                            <div className="col-6">
                              <h6 className="text-center">Floor 1</h6>
                              <div className="container">
                                {Array.from({ length: Math.ceil(floor1.length / 2) }).map((_, rowIndex) => (
                                  <div className="row mb-3" key={rowIndex}>
                                    {floor1.slice(rowIndex * 2, rowIndex * 2 + 2).map((room) => (
                                      <div className="col-6 d-flex justify-content-center" key={room.number}>
                                        <div
                                          className="d-flex align-items-center justify-content-center text-white fw-bold rounded"
                                          style={{
                                            width: "85px",       // 👉 ขยายกล่อง
                                            height: "85px",      // 👉 ทำให้เป็นสี่เหลี่ยมจัตุรัส
                                            fontSize: "20px",    // 👉 เลขใหญ่ขึ้น
                                            cursor: "pointer",   // 👉 มี cursor pointer
                                            transition: "transform 0.2s ease, filter 0.2s ease",
                                            backgroundColor:
                                              room.status === "available"
                                                ? "#22c55e"
                                                : room.status === "unavailable"
                                                ? "#ef4444"
                                                : "#facc15",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.08)";
                                            e.currentTarget.style.filter = "brightness(1.1)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.filter = "brightness(1)";
                                          }}
                                        >
                                          {room.number}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Floor 2 */}
                            <div className="col-6">
                              <h6 className="text-center">Floor 2</h6>
                              <div className="container">
                                {Array.from({ length: Math.ceil(floor2.length / 2) }).map((_, rowIndex) => (
                                  <div className="row mb-3" key={rowIndex}>
                                    {floor2.slice(rowIndex * 2, rowIndex * 2 + 2).map((room) => (
                                      <div className="col-6 d-flex justify-content-center" key={room.number}>
                                        <div
                                          className="d-flex align-items-center justify-content-center text-white fw-bold rounded"
                                          style={{
                                            width: "85px",
                                            height: "85px",
                                            fontSize: "20px",
                                            cursor: "pointer",
                                            transition: "transform 0.2s ease, filter 0.2s ease",
                                            backgroundColor:
                                              room.status === "available"
                                                ? "#22c55e"
                                                : room.status === "unavailable"
                                                ? "#ef4444"
                                                : "#facc15",
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.08)";
                                            e.currentTarget.style.filter = "brightness(1.1)";
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.filter = "brightness(1)";
                                          }}
                                        >
                                          {room.number}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                        </div>

                        {/* Legend */}
                        <div className="mt-3 small text-center">
                          <span className="me-3">
                            <span className="badge bg-success me-1">&nbsp;</span>
                            Available
                          </span>
                          <span className="me-3">
                            <span className="badge bg-danger me-1">&nbsp;</span>
                            Unavailable
                          </span>
                          <span>
                            <span className="badge bg-warning me-1">&nbsp;</span>
                            Repair
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>



                {/* Right side */}
                <div className="col-lg-7 d-flex flex-column">
                  {/* Request Overview */}
                  <div className="card border-0 shadow-sm flex-grow-1 mb-3 rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Request Overview</h5>
                      <Line data={requestOverviewData} />
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Request History */}
                    <div className="col-lg-7">
                      <div className="card border-0 shadow-sm h-100 rounded-2">
                        <div className="card-body">
                          <h5 className="card-title">Request History</h5>
                          <Bar data={requestHistoryData} />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="col-lg-5">
                      <div className="card border-0 shadow-sm h-100 rounded-2">
                        <div className="card-body">
                          <h5 className="card-title">Summary</h5>
                          <ul className="list-unstyled">
                            <li className="d-flex justify-content-between">
                              <span>Available</span>
                              <span className="text-success fw-bold">
                                {summary.available}
                              </span>
                            </li>
                            <li className="d-flex justify-content-between">
                              <span>Unavailable</span>
                              <span className="text-danger fw-bold">
                                {summary.unavailable}
                              </span>
                            </li>
                            <li className="d-flex justify-content-between">
                              <span>Repair</span>
                              <span className="text-warning fw-bold">
                                {summary.repair}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End right side */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
