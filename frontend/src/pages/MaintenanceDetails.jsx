// src/pages/MaintenanceDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Pill({ text, variant = "secondary" }) {
  const map = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning text-dark",
    info: "bg-info text-dark",
    secondary: "bg-secondary",
    subtleDanger: "bg-danger-subtle text-danger",
    subtleSecondary: "bg-secondary-subtle text-secondary",
  };
  return (
    <span className={`badge rounded-pill ${map[variant] || map.secondary}`}>
      {text}
    </span>
  );
}

function KV({ label, value, right = false, children }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-1">
      <span className="text-muted small">{label}</span>
      <span className={`fw-semibold ${right ? "" : "text-end"}`}>
        {children ?? (value !== undefined && value !== null && value !== "" ? value : "-")}
      </span>
    </div>
  );
}

export default function MaintenanceDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // รับมาจากหน้า Request ด้วย navigate(..., { state: { row } })
  const row = state?.row || state || {};

  // Fallback หากเปิดหน้านี้ตรง ๆ
  const fallback = {
    id: "RR01",
    floor: "1",
    room: "101",
    target: "Asset",
    issue: "Air conditioner",
    maintainType: "Fix",
    requestDate: "2025-03-11",
    maintainDate: "2025-03-14",
    completeDate: "-",
    state: "Not Started",
    tenant: {
      firstName: "John",
      lastName: "Doe",
      nationalId: "1-2345-67890-12-3",
      phone: "012-345-6789",
      email: "JohnDoe@gmail.com",
      packageName: "1 Year",
      signDate: "2024-12-30",
      startDate: "2024-12-31",
      endDate: "2025-12-31",
    },
    technician: {
      name: "PSomchai",
      phone: "012-345-6789",
    },
  };

  const data = {
    ...fallback,
    ...row,
    tenant: { ...fallback.tenant, ...(row?.tenant || {}) },
    technician: { ...fallback.technician, ...(row?.technician || {}) },
  };

  const isComplete = String(data.state || "").toLowerCase() === "complete";
  const maintainPillVariant =
    String(data.maintainType || "").toLowerCase() === "fix"
      ? "subtleDanger"
      : "info";

  return (
    <Layout title="Maintenance Request" icon="pi pi-wrench" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-11 p-4">

            {/* Breadcrumb + Action */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <button
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => navigate("/maintenancerequest")}
                    >
                      Maintenance Request
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {data.id || "RR01"}
                  </li>
                </ol>
              </nav>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/maintenancerequest", { state: { edit: true, row: data } })
                }
              >
                <i className="bi bi-pencil-square me-1" />
                Edit Request
              </button>
            </div>

            {/* Row 1 */}
            <div className="row g-3 mb-3">
              {/* Room Information */}
              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Room Information</h6>
                    <KV label="Floor" value={data.floor} />
                    <KV label="Room" value={data.room} />
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Request Information</h6>

                    <div className="row">
                      <div className="col-md-4">
                        <KV label="Target">
                          <Pill text={data.target || "Asset"} variant="subtleSecondary" />
                        </KV>
                        <KV label="Maintain type">
                          <Pill text={data.maintainType || "Fix"} variant={maintainPillVariant} />
                        </KV>
                        <KV label="Maintain date" value={data.maintainDate} />
                      </div>

                      <div className="col-md-4">
                        <KV label="Issue" value={data.issue || "-"} />
                        <KV label="Request date" value={data.requestDate} />
                        <KV label="State">
                          {isComplete ? (
                            <Pill text="Complete" variant="success" />
                          ) : (
                            <Pill text="Not Started" variant="subtleSecondary" />
                          )}
                        </KV>
                      </div>

                      <div className="col-md-4">
                        <KV label="Complete date" value={data.completeDate || "-"} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row g-3">
              {/* Tenant Information */}
              <div className="col-md-7">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Tenant Information</h6>

                    <div className="row">
                      <div className="col-sm-6">
                        <KV label="First Name" value={data.tenant.firstName} />
                        <KV label="Last Name" value={data.tenant.lastName} />
                        <KV label="National ID" value={data.tenant.nationalId} />
                        <KV label="Phone Number" value={data.tenant.phone} />
                        <KV label="Email" value={data.tenant.email} />
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex justify-content-between align-items-center py-1">
                          <span className="text-muted small">Package</span>
                          <span>
                            <span
                              className="badge rounded-pill px-3"
                              style={{ backgroundColor: "#9691F9" }}
                            >
                              {data.tenant.packageName || "1 Year"}
                            </span>
                          </span>
                        </div>
                        <KV label="Sign date" value={data.tenant.signDate} />
                        <KV label="Start date" value={data.tenant.startDate} />
                        <KV label="End date" value={data.tenant.endDate} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technician Information */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Technician Information</h6>
                    <KV label="Technician’s name" value={data.technician.name} />
                    <KV label="Phone Number" value={data.technician.phone} />
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* /Main */}
        </div>
      </div>
    </Layout>
  );
}
