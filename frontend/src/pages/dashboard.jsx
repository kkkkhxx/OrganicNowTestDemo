import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
// import Modal from "../component/modal";
// import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Dashboard() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/rooms")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setRooms(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
                setLoading(false);
            });
    }, []);

  return (
    <Layout title="Tenant Management" icon="bi bi-people" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-11 p-4">
            <div className="table-wrapper-detail">
              {/* code here */}
              <div className="row g-4">
                <div className="col-lg-5">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Room Overview</h5>
                      {/* data right here col-lg-5 */}
                    </div>
                  </div>
                </div>

                <div className="col-lg-7 d-flex flex-column">
                  <div className="card border-0 shadow-sm flex-grow-1 mb-3">
                    <div className="card-body">
                      {/* data right here col-lg-7 top */}
                      <h5 className="card-title">Request Overview</h5>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-lg-7">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          {/* data col-lg-7 bottom left */}
                          <h5 className="card-title">Request History</h5>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-5">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                          {/* data col-lg-5 bottom right */}
                          <h5 className="card-title">Summary</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
