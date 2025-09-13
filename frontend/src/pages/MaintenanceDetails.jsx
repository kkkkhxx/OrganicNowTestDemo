// src/pages/MaintenanceDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Pill({ text, variant = "secondary" }) {
  const cls =
    variant === "success"
      ? "badge bg-success"
      : variant === "warning"
      ? "badge bg-warning text-dark"
      : variant === "danger"
      ? "badge bg-danger"
      : variant === "subtle"
      ? "badge bg-secondary-subtle text-secondary"
      : "badge bg-secondary";
  return <span className={cls}>{text}</span>;
}

export default function MaintenanceDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ได้มาจาก /maintenancerequest ด้วย navigate(..., { state: { row } })
  const row = state?.row || state || {};

  // Fallback (เปิดหน้านี้ตรง ๆ)
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
    technician: { name: "PSomchai", phone: "012-345-6789" },
  };

  const data = {
    ...fallback,
    ...row,
    tenant: { ...fallback.tenant, ...(row?.tenant || {}) },
    technician: { ...fallback.technician, ...(row?.technician || {}) },
  };

  const isComplete = String(data.state || "").toLowerCase() === "complete";

  return (
    <Layout title="Maintenance Request" icon="pi pi-wrench" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          <div className="col-lg-11 p-4">
            {/* ===== Toolbar (เหมือน InvoiceDetails) ===== */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0 rounded-2">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="breadcrumb-link text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/maintenancerequest")}
                    >
                      Maintenance Request
                    </span>
                    <span className="text-muted">›</span>
                    <span className="breadcrumb-current">{data.id || "RR01"}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        navigate("/maintenancerequest", {
                          state: { edit: true, row: data },
                        })
                      }
                    >
                      <i className="bi bi-pencil me-1" /> Edit Request
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Details (layout เดียวกับ InvoiceDetails) ===== */}
            <div className="table-wrapper-detail rounded-0">
              <div className="row g-4">
                {/* Left column */}
                <div className="col-lg-6">
                  {/* Room Information */}
                  <div className="card border-0 shadow-sm mb-3 rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Room Information</h5>
                      <p>
                        <span className="label">Floor:</span>{" "}
                        <span className="value">{data.floor}</span>
                      </p>
                      <p>
                        <span className="label">Room:</span>{" "}
                        <span className="value">{data.room}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tenant Information */}
                  <div className="card border-0 shadow-sm rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Tenant Information</h5>

                      <div className="row">
                        <div className="col-sm-6">
                          <p>
                            <span className="label">First Name:</span>{" "}
                            <span className="value">{data.tenant.firstName}</span>
                          </p>
                          <p>
                            <span className="label">Last Name:</span>{" "}
                            <span className="value">{data.tenant.lastName}</span>
                          </p>
                          <p>
                            <span className="label">National ID:</span>{" "}
                            <span className="value">{data.tenant.nationalId}</span>
                          </p>
                          <p>
                            <span className="label">Phone Number:</span>{" "}
                            <span className="value">{data.tenant.phone}</span>
                          </p>
                          <p>
                            <span className="label">Email:</span>{" "}
                            <span className="value">{data.tenant.email}</span>
                          </p>
                        </div>

                        <div className="col-sm-6">
                          <p className="d-flex align-items-center justify-content-between">
                            <span className="label">Package:</span>
                            <span className="value">
                              <span className="badge bg-primary">{data.tenant.packageName}</span>
                            </span>
                          </p>
                          <p>
                            <span className="label">Sign date:</span>{" "}
                            <span className="value">{data.tenant.signDate}</span>
                          </p>
                          <p>
                            <span className="label">Start date:</span>{" "}
                            <span className="value">{data.tenant.startDate}</span>
                          </p>
                          <p>
                            <span className="label">End date:</span>{" "}
                            <span className="value">{data.tenant.endDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="col-lg-6">
                  {/* Request Information */}
                  <div className="card border-0 shadow-sm mb-3 rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Request Information</h5>

                      <div className="row">
                        <div className="col-6">
                          <p>
                            <span className="label">Target:</span>{" "}
                            <span className="value">
                              <span className="badge bg-secondary-subtle text-secondary">
                                {data.target || "Asset"}
                              </span>
                            </span>
                          </p>
                          <p>
                            <span className="label">Maintain type:</span>{" "}
                            <span className="value">
                              <span className="badge bg-danger-subtle text-danger">
                                {data.maintainType || "Fix"}
                              </span>
                            </span>
                          </p>
                          <p>
                            <span className="label">Maintain date:</span>{" "}
                            <span className="value">{data.maintainDate}</span>
                          </p>
                        </div>

                        <div className="col-6">
                          <p>
                            <span className="label">Issue:</span>{" "}
                            <span className="value">{data.issue || "-"}</span>
                          </p>
                          <p>
                            <span className="label">Request date:</span>{" "}
                            <span className="value">{data.requestDate}</span>
                          </p>
                          <p>
                            <span className="label">State:</span>{" "}
                            <span className="value">
                              {isComplete ? (
                                <Pill text="Complete" variant="success" />
                              ) : (
                                <Pill text="Not Started" variant="subtle" />
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <p>
                            <span className="label">Complete date:</span>{" "}
                            <span className="value">{data.completeDate || "-"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technician Information */}
                  <div className="card border-0 shadow-sm rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Technician Information</h5>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <span className="label">Technician’s name:</span>{" "}
                            <span className="value">{data.technician.name}</span>
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <span className="label">Phone Number:</span>{" "}
                            <span className="value">{data.technician.phone}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Right */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
