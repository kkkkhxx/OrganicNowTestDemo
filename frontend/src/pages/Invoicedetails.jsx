import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function InvoiceDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { invoice, invoiceId, tenantName } = location.state || {};

  // Mock data fallback for direct URL access
  const defaultInvoice = {
    id: 1,
    createDate: "2025-01-31",
    firstName: "John",
    lastName: "Doe",
    nationalId: "1-2345-67890-12-3",
    phoneNumber: "012-345-6789",
    email: "JohnDoe@gmail.com",
    package: "1 Year",
    signDate: "2024-12-30",
    startDate: "2024-12-31",
    endDate: "2025-12-31",
    floor: "1",
    room: "101",
    amount: 5356,
    rent: 4000,
    water: 120,
    waterUnit: 4,
    electricity: 1236,
    electricityUnit: 206,
    status: "Complete",
    payDate: "2025-01-31",
    penalty: 0,
    penaltyDate: null
  };

  const invoiceData = invoice || defaultInvoice;
  const displayName = tenantName || `${invoiceData.firstName} ${invoiceData.lastName}`;

  return (
    <Layout title="Invoice Management" icon="bi bi-currency-dollar" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar Card */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  {/* Left cluster: Breadcrumb */}
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="breadcrumb-link text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/invoicemanagement")}
                    >
                      Invoice Management
                    </span>
                    <span className="text-muted">›</span>
                    <span className="breadcrumb-current">{displayName}</span>
                  </div>
                  {/* Right cluster: Edit Request Button */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editRequestModal"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit Request
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-wrapper-detail">
              <div className="row g-4">
                {/* Left Column - Room & Tenant Info */}
                <div className="col-lg-6">
                  {/* Room Information */}
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Room Information</h5>
                      <p>
                        <span className="label">Floor:</span>
                        <span className="value">{invoiceData.floor}</span>
                      </p>
                      <p>
                        <span className="label">Room:</span>
                        <span className="value">{invoiceData.room}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tenant Information */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Tenant Information</h5>
                      <p>
                        <span className="label">First Name:</span>
                        <span className="value">{invoiceData.firstName}</span>
                      </p>
                      <p>
                        <span className="label">Last Name:</span>
                        <span className="value">{invoiceData.lastName}</span>
                      </p>
                      <p>
                        <span className="label">National ID:</span>
                        <span className="value">{invoiceData.nationalId}</span>
                      </p>
                      <p>
                        <span className="label">Phone Number:</span>
                        <span className="value">{invoiceData.phoneNumber}</span>
                      </p>
                      <p>
                        <span className="label">Email:</span>
                        <span className="value">{invoiceData.email}</span>
                      </p>
                      <p>
                        <span className="label">Package:</span>
                        <span className="value">
                          <span className="package-badge badge bg-primary">
                            {invoiceData.package}
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className="label">Sign date:</span>
                        <span className="value">{invoiceData.signDate}</span>
                      </p>
                      <p>
                        <span className="label">Start date:</span>
                        <span className="value">{invoiceData.startDate}</span>
                      </p>
                      <p>
                        <span className="label">End date:</span>
                        <span className="value">{invoiceData.endDate}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Invoice & Penalty Info */}
                <div className="col-lg-6">
                  {/* Invoice Information */}
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Invoice Information</h5>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <span className="label">Create date:</span>
                            <span className="value">{invoiceData.createDate}</span>
                          </p>
                          <p>
                            <span className="label">Water unit:</span>
                            <span className="value">{invoiceData.waterUnit}</span>
                          </p>
                          <p>
                            <span className="label">Electricity unit:</span>
                            <span className="value">{invoiceData.electricityUnit}</span>
                          </p>
                          <p>
                            <span className="label">NET:</span>
                            <span className="value">{invoiceData.amount.toLocaleString()}</span>
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <span className="label">Rent:</span>
                            <span className="value">{invoiceData.rent.toLocaleString()}</span>
                          </p>
                          <p>
                            <span className="label">Water bill:</span>
                            <span className="value">{invoiceData.water.toLocaleString()}</span>
                          </p>
                          <p>
                            <span className="label">Electricity bill:</span>
                            <span className="value">{invoiceData.electricity.toLocaleString()}</span>
                          </p>
                          <p>
                            <span className="label">Status:</span>
                            <span className="value">
                              <span className="badge bg-success">
                                <i className="bi bi-circle-fill me-1"></i>
                                {invoiceData.status}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Penalty Information */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Penalty Information</h5>
                      <div className="row">
                        <div className="col-6">
                          <p>
                            <span className="label">Penalty:</span>
                            <span className="value">{invoiceData.penalty > 0 ? invoiceData.penalty.toLocaleString() : '-'}</span>
                          </p>
                        </div>
                        <div className="col-6">
                          <p>
                            <span className="label">Penalty date:</span>
                            <span className="value">{invoiceData.penaltyDate || '-'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Main */}
        </div>
      </div>
      
      <Modal
        id="editRequestModal"
        title="Edit Request"
        icon="bi bi-pencil"
        size="modal-lg"
        scrollable="modal-dialog-scrollable"
      >
        <p>Edit request form will go here</p>
      </Modal>
    </Layout>
  );
}

export default InvoiceDetails;