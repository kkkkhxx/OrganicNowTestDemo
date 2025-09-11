import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function TenantDetail() {
  const tenantInfoRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(0);

  useEffect(() => {
    if (!tenantInfoRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setLeftHeight(entry.contentRect.height);
    });

    observer.observe(tenantInfoRef.current);

    return () => observer.disconnect();
  }, []);

  const handleDelete = (item) => {
    console.log("Delete: ", item);
  };

  const handleSelectRow = (rowIndex) => {
    setSelectedItems((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { tenant, fullName } = location.state || {};
  
  useEffect(() => {
    if (!tenant) {
      navigate("/tenantmanagement"); // redirect ถ้าไม่มีข้อมูล
    }
  }, [tenant, navigate]);

  // อยู่ในฟังก์ชัน TenantDetail ด้านบน return
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "complete":
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
    // helper: คืนค่าวันนี้รูปแบบ YYYY-MM-DD
    const todayISO = () => new Date().toISOString().slice(0, 10);
    // ยกเลิกสัญญา -> เซ็ต End date เป็นวันนี้ (ยืนยันก่อน)
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
                  {/* Left cluster: Breadcrumb (แทน Filter/Sort/Search เดิม) */}
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
                  {/* Right cluster: Edit Tenant Button */}
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

            <div className="table-wrapper-detail rounded-0">
              {/* code here */}
              <div className="row g-4">
                {/* Tenant Info */}
                <div className="col-lg-4" ref={tenantInfoRef}>
                  <div className="card border-0 shadow-sm rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Tenant Information</h5>

                      <p>
                        <span className="label">First Name:</span>
                        <span className="value">John</span>
                      </p>
                      <p>
                        <span className="label">Last Name:</span>
                        <span className="value">Doe</span>
                      </p>
                      <p>
                        <span className="label">National ID:</span>
                        <span className="value">1-2345-67890-12-3</span>
                      </p>
                      <p>
                        <span className="label">Phone Number:</span>
                        <span className="value">012-345-6789</span>
                      </p>
                      <p>
                        <span className="label">Email:</span>
                        <span className="value">JohnDoe@gmail.com</span>
                      </p>
                      <p>
                        <span className="label">Package:</span>
                        <span className="value">
                          <span className="package-badge badge bg-primary">
                            1 Year
                          </span>
                        </span>
                      </p>
                      <p>
                        <span className="label">Sign Date:</span>
                        <span className="value">2024-12-31</span>
                      </p>
                      <p>
                        <span className="label">Start Date:</span>
                        <span className="value">2024-12-31</span>
                      </p>
                      <p>
                        <span className="label">End Date:</span>
                        <span className="value">2025-12-31</span>
                      </p>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mt-3 rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Room Information</h5>
                      <p>
                        <span className="label">Floor:</span>
                        <span className="value">1</span>
                      </p>
                      <p>
                        <span className="label">Room:</span>
                        <span className="value">101</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment & Request History */}
                <div className="col-lg-8 d-flex flex-column">
                  <div
                    className="card border-0 shadow-sm flex-grow-1 rounded-2"
                    style={{
                      height: `${leftHeight}px`,
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    <div className="card-body d-flex flex-column overflow-hidden">
                      {/* Tabs */}
                      <ul
                        className="nav nav-tabs bg-white"
                        id="historyTabs"
                        role="tablist"
                      >
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            id="payment-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#payment"
                            type="button"
                            role="tab"
                          >
                            Payment History
                          </button>
                        </li>
                      </ul>

                      {/* Scrollable Content Area */}
                      <div
                        className="tab-content mt-3 overflow-auto flex-grow-1"
                        style={{ maxHeight: "500px" }}
                      >
                        {/* Payment History */}
                        <div
                          className="tab-pane fade show active"
                          id="payment"
                          role="tabpanel"
                        >
                          <div className="row row-cols-1 row-cols-md-2 g-3">
                            {[
                              {
                                date: "2025-04-30",
                                id: "iv0001250430",
                                net: "4,438 Baht",
                                status: "In process",
                                pay: "2025-04-16",
                                penalty: "-",
                              },
                              {
                                date: "2025-03-31",
                                id: "iv0001250331",
                                net: "4,438 Baht",
                                status: "Complete",
                                pay: "2025-04-16",
                                penalty: "1,000 Baht",
                              },
                            ].map((inv, idx) => (
                              <div className="col-lg-12" key={idx}>
                                <div
                                  className={`status-card ${getStatusColor(
                                    inv.status
                                  )} d-flex flex-column`}
                                >
                                  <div className="row mb-1">
                                    <div className="col-4">
                                      <span className="label">
                                        Invoice date:{" "}
                                      </span>
                                      <span className="value">{inv.date}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">
                                        Invoice ID:{" "}
                                      </span>
                                      <span className="value">{inv.id}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">NET: </span>
                                      <span className="value">{inv.net}</span>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-4">
                                      <span className="label">Status: </span>
                                      <span className="value">
                                        {inv.status}
                                      </span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">Pay date:</span>
                                      <span className="value">{inv.pay}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">Penalty: </span>
                                      <span className="value">
                                        {inv.penalty}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Request History */}
                        <div
                          className="tab-pane fade"
                          id="request"
                          role="tabpanel"
                        >
                          <p className="mb-0">No requests found.</p>
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
        id="exampleModal"
        title="Edit User"
        icon="pi pi-user"
        size="modal-lg"
        scrollable="modal-dialog-scrollable"
      >
          <form
              onSubmit={(e) => {
                  e.preventDefault();
                  // ผูก Save กับฟังก์ชันเดิม
                  handleSaveCreate();
              }}
          >
              {/* ---------- General Information ---------- */}
              <div className="mb-4">
                  <div className="fw-semibold mb-2">General Information</div>

                  <div className="row g-3">
                      <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Tenant First Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                          />
                      </div>
                      <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Tenant Last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                          />
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">National ID</label>
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Tenant National ID"
                              disabled
                              value={nationalId}
                              onChange={(e) => setNationalId(e.target.value)}
                          />
                      </div>
                      <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input
                              type="tel"
                              className="form-control"
                              placeholder="Tenant Phone Number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                              type="email"
                              className="form-control"
                              placeholder="Tenant Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                          />
                      </div>
                  </div>
              </div>

              {/* ---------- Room Information ---------- */}
              <div className="mb-4">
                  <div className="fw-semibold mb-2">Room Information</div>

                  <div className="row g-3">
                      <div className="col-md-6">
                          <label className="form-label">Floor</label>
                          <div className="position-relative">
                              <select className="form-select"
                                      disabled>
                                  <option>1</option>
                              </select>
                              {/*<select*/}
                              {/*    className="form-select"*/}
                              {/*    value={selectedFloor}*/}
                              {/*    onChange={(e) => onChangeFloor(e.target.value)}*/}
                              {/*>*/}
                              {/*    <option value="">Tenant Floor</option>*/}
                              {/*    {floors.map((f) => (*/}
                              {/*        <option key={f} value={f}>*/}
                              {/*            {f}*/}
                              {/*        </option>*/}
                              {/*    ))}*/}
                              {/*</select>*/}
                          </div>
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">Room</label>
                          <div className="position-relative">
                              <select className="form-select"
                                      disabled>
                                  <option>101</option>
                                  <option>102</option>
                              </select>
                              {/*<select*/}
                              {/*    className="form-select"*/}
                              {/*    value={selectedRoomId}*/}
                              {/*    onChange={(e) => setSelectedRoomId(e.target.value)}*/}
                              {/*    disabled={!selectedFloor}*/}
                              {/*>*/}
                              {/*    <option value="">*/}
                              {/*        {selectedFloor ? "Tenant Room" : "Choose floor first"}*/}
                              {/*    </option>*/}
                              {/*    {roomsInSelectedFloor.map((r) => (*/}
                              {/*        <option key={r.id} value={r.id}>*/}
                              {/*            {r.name ?? r.room ?? r.id}*/}
                              {/*        </option>*/}
                              {/*    ))}*/}
                              {/*</select>*/}
                          </div>
                      </div>
                  </div>
              </div>

              {/* ---------- Contract Information ---------- */}
              <div className="mb-4">
                  <div className="fw-semibold mb-2">Contract Information</div>

                  <div className="row g-3">
                      <div className="col-md-6">
                          <label className="form-label">Package</label>
                          <div className="position-relative">
                              <select
                                  className="form-select"
                                  disabled
                                  value={packageId}
                                  onChange={(e) => setPackageId(e.target.value)}
                              >
                                  <option value="">Tenant Package</option>
                                  {packages.map((p) => (
                                      <option key={p.id} value={p.id}>
                                          {p.contract_name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">Sign date</label>
                          <div className="position-relative">
                              <input
                                  type="date"
                                  className="form-control"
                                  placeholder="Tenant Sign date"
                                  disabled
                                  // value={startDate}
                                  // onChange={(e) => setStartDate(e.target.value)}
                              />
                          </div>
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">Start date</label>
                          <div className="position-relative">
                              <input
                                  type="date"
                                  className="form-control"
                                  placeholder="Tenant Start date"
                                  disabled
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                              />
                          </div>
                      </div>

                      <div className="col-md-6">
                          <label className="form-label">End date</label>
                          <div className="input-group">
                              <input
                                  type="date"
                                  className="form-control"
                                  placeholder="Tenant End date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                              />
                              <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={handleCancelContract}
                                  title="ตั้ง End date เป็นวันนี้และยกเลิกสัญญา"
                              >
                                  Terminate
                              </button>
                          </div>
                      </div>

                  </div>

              </div>

              {/* ---------- Footer Buttons ---------- */}
              <div className="d-flex justify-content-center gap-3 pt-3 pb-3">
                  <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                  >
                      Cancel
                  </button>

                  <button
                      type="submit"
                      className="btn btn-primary"
                      // disabled={
                      //     !firstName ||
                      //     !lastName ||
                      //     !email ||
                      //     !phoneNumber ||
                      //     !nationalId ||
                      //     !selectedFloor ||
                      //     !selectedRoomId ||
                      //     !packageId ||
                      //     !startDate
                      // }
                  >
                      Save
                  </button>
              </div>
          </form>
      </Modal>
    </Layout>
  );
}

export default TenantDetail;
