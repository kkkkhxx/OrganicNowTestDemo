import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../component/layout";
import Modal from "../component/modal";
import { apiPath } from "../config_variable";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function TenantDetail() {
  const tenantInfoRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);
  const [tenant, setTenant] = useState(null);

  const navigate = useNavigate();
  const { contractId } = useParams();

  // จับความสูงฝั่งซ้าย → set ให้ขวาเท่ากัน
  useEffect(() => {
    if (!tenantInfoRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setLeftHeight(entry.contentRect.height);
    });
    observer.observe(tenantInfoRef.current);
    return () => observer.disconnect();
  }, []);

  // fetch detail จาก backend
  useEffect(() => {
    const fetchTenantDetail = async () => {
      try {
        const res = await axios.get(`${apiPath}/tenant/${contractId}`, {
          withCredentials: true,
        });
        setTenant(res.data);
      } catch (err) {
        console.error("Error fetching tenant detail:", err);
        navigate("/tenantmanagement");
      }
    };
    if (contractId) fetchTenantDetail();
  }, [contractId, navigate]);

  // map สี status invoice
  const getStatusColor = (status) => {
    if (!status) return "status-default";
    switch (status.toLowerCase()) {
      case "completed":
        return "status-complete";
      case "in process":
        return "status-warning";
      case "failed":
      case "overdue":
        return "status-danger";
      default:
        return "status-default";
    }
  };

  //======= ปุ่มยกเลิกสัญญา =======//
  const [endDate, setEndDate] = useState("");
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const handleCancelContract = () => {
    if (!window.confirm("ยืนยันการยกเลิกสัญญา? ระบบจะตั้ง End date เป็นวันนี้")) return;
    setEndDate(todayISO());
  };

  return (
    <Layout title="Tenant Management" icon="pi pi-user" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar Card */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0 rounded-3">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  {/* Breadcrumb */}
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="breadcrumb-link text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/tenantmanagement")}
                    >
                      Tenant Management
                    </span>
                    <span className="text-muted">›</span>
                    <span className="breadcrumb-current">
                      {tenant ? `${tenant.firstName} ${tenant.lastName}` : "Tenant"}
                    </span>
                  </div>
                  {/* Right cluster */}
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-light text-danger border-0">
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit Tenant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Section */}
            <div className="table-wrapper-detail rounded-0">
              <div className="row g-4">
                {/* Tenant Info */}
                <div className="col-lg-4" ref={tenantInfoRef}>
                  <div className="card border-0 shadow-sm rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Tenant Information</h5>
                      <p><span className="label">First Name:</span> <span className="value">{tenant?.firstName || "-"}</span></p>
                      <p><span className="label">Last Name:</span> <span className="value">{tenant?.lastName || "-"}</span></p>
                      <p><span className="label">National ID:</span> <span className="value">{tenant?.nationalId || "-"}</span></p>
                      <p><span className="label">Phone Number:</span> <span className="value">{tenant?.phoneNumber || "-"}</span></p>
                      <p><span className="label">Email:</span> <span className="value">{tenant?.email || "-"}</span></p>
                      <p>
                        <span className="label">Package:</span>
                        <span className="value">
                          <span className="package-badge badge bg-primary">
                            {tenant?.packageName || "-"}
                          </span>
                        </span>
                      </p>
                      <p><span className="label">Sign Date:</span> <span className="value">{tenant?.signDate?.split("T")[0] || "-"}</span></p>
                      <p><span className="label">Start Date:</span> <span className="value">{tenant?.startDate?.split("T")[0] || "-"}</span></p>
                      <p><span className="label">End Date:</span> <span className="value">{tenant?.endDate?.split("T")[0] || "-"}</span></p>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mt-3 rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Room Information</h5>
                      <p><span className="label">Floor:</span> <span className="value">{tenant?.floor || "-"}</span></p>
                      <p><span className="label">Room:</span> <span className="value">{tenant?.room || "-"}</span></p>
                    </div>
                  </div>
                </div>

                {/* Payment & Request History */}
                <div className="col-lg-8 d-flex flex-column">
                  <div
                    className="card border-0 shadow-sm flex-grow-1 rounded-2"
                    style={{ height: `${leftHeight}px`, overflowY: "auto", paddingRight: "8px" }}
                  >
                    <div className="card-body d-flex flex-column overflow-hidden">
                      {/* Tabs */}
                      <ul className="nav nav-tabs bg-white" id="historyTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active" id="payment-tab" data-bs-toggle="tab" data-bs-target="#payment" type="button" role="tab">
                            Payment History
                          </button>
                        </li>
                      </ul>

                      {/* Content */}
                      <div className="tab-content mt-3 overflow-auto flex-grow-1" style={{ maxHeight: "500px" }}>
                        <div className="tab-pane fade show active" id="payment" role="tabpanel">
                          <div className="row row-cols-1 row-cols-md-2 g-3">
                            {tenant?.invoices?.length > 0 ? (
                              tenant.invoices.map((inv, idx) => (
                                <div className="col-lg-12" key={idx}>
                                  <div className={`status-card ${getStatusColor(inv.status)} d-flex flex-column`}>
                                    <div className="row mb-1">
                                      <div className="col-4">
                                        <span className="label">Invoice date:</span>
                                        <span className="value">{inv.date?.split("T")[0]}</span>
                                      </div>
                                      <div className="col-4">
                                        <span className="label">Invoice ID:</span>
                                        <span className="value">{inv.id}</span>
                                      </div>
                                      <div className="col-4">
                                        <span className="label">NET:</span>
                                        <span className="value">{inv.net} Baht</span>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-4">
                                        <span className="label">Status:</span>
                                        <span className="value">{inv.status}</span>
                                      </div>
                                      <div className="col-4">
                                        <span className="label">Pay date:</span>
                                        <span className="value">{inv.pay?.split("T")[0] || "-"}</span>
                                      </div>
                                      <div className="col-4">
                                        <span className="label">Penalty:</span>
                                        <span className="value">{inv.penalty || "-"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>No invoices found</p>
                            )}
                          </div>
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

      {/* Modal แก้ไข */}
      <Modal id="exampleModal" title="Edit User" icon="pi pi-user" size="modal-lg" scrollable="modal-dialog-scrollable">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <div className="fw-semibold mb-2">General Information</div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" defaultValue={tenant?.firstName || ""} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" defaultValue={tenant?.lastName || ""} />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default TenantDetail;