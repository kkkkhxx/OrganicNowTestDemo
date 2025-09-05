import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/roomdetail.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function RoomDetail() {
  const [data, setData] = useState([
    {
      order: 1,
      RID: "R01",
      assets: "Light",
      status: "Active",
    },
  ]);
  // const tenantInfoRef = useRef(null);
  // const [leftHeight, setLeftHeight] = useState(0);

  // useEffect(() => {
  //   if (!tenantInfoRef.current) return;

  const observer = new ResizeObserver(([entry]) => {
    setLeftHeight(entry.contentRect.height);
  });

  //   observer.observe(tenantInfoRef.current);

  //   return () => observer.disconnect();
  // }, []);

  const handleDelete = (item) => {
    console.log("Delete: ", item);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((_, idx) => idx));
    }
  };

  const handleSelectRow = (rowIndex) => {
    setSelectedItems((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  // const navigate = useNavigate();
  // const location = useLocation();
  // const { tenant, fullName } = location.state || {};

  // useEffect(() => {
  //   if (!tenant) {
  //     navigate("/tenantmanagement"); // redirect ถ้าไม่มีข้อมูล
  //   }
  // }, [tenant, navigate]);

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

  return (
    <Layout title="Room Management" icon="bi bi-folder" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar Card */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  {/* Left cluster: Breadcrumb (แทน Filter/Sort/Search เดิม) */}
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="breadcrumb-link text-primary"
                      // style={{ cursor: "pointer" }}
                      // onClick={() => navigate("/tenantmanagement")}
                    >
                      Room Management
                    </span>
                    {/* <span className="text-muted">›</span>
                      <span className="breadcrumb-current">
                        {tenant
                          ? `${tenant.firstName} ${tenant.lastName}`
                          : "Tenant"}
                      </span> */}
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

            <div className="table-wrapper-detail">
              {/* code here */}
              <div className="row g-4">
                {/* Tenant Info */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
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
                      <p>
                        <span className="label">Status:</span>
                        <span className="value">Unavailable</span>
                      </p>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mt-3">
                    <div className="card-body">
                      <h5 className="card-title">Current Tenant</h5>
                      <p>
                        <span className="label">First Name:</span>
                        <span className="value">John</span>
                      </p>
                      <p>
                        <span className="label">Last Name:</span>
                        <span className="value">Doe</span>
                      </p>
                      <p>
                        <span className="label">Phone Number:</span>
                        <span className="value">012-345-6789</span>
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
                </div>

                {/* Payment & Request History */}
                <div className="col-lg-8 d-flex flex-column">
                  <div
                    className="card border-0 shadow-sm flex-grow-1"
                    style={{
                      // height: `${leftHeight}px`,
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
                            Assets
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link"
                            id="request-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#request"
                            type="button"
                            role="tab"
                          >
                            Request History
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
                          <table className="table text-nowrap">
                            <thead>
                              <tr>
                                <th className="text-center header-color checkbox-cell">
                                  <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    aria-label="Select all rows"
                                  />
                                </th>
                                <th className="text-center align-middle header-color">
                                  Order
                                </th>
                                <th className="text-center align-middle header-color">
                                  RID
                                </th>
                                <th className="text-center align-middle header-color">
                                  Assets
                                </th>
                                <th className="text-center align-middle header-color">
                                  Status
                                </th>
                                <th className="text-center align-middle header-color">
                                  <div className="btn-container">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModal"
                                    >
                                      <i className="bi bi-pencil me-1"></i> Add
                                    </button>
                                  </div>
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {data.length > 0 ? (
                                data.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="align-middle text-center checkbox-cell">
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.includes(idx)}
                                        onChange={() => handleSelectRow(idx)}
                                        aria-label={`Select row ${idx + 1}`}
                                      />
                                    </td>

                                    <td className="align-middle text-center">
                                      {item.order}
                                    </td>
                                    <td className="align-middle text-center">
                                      {item.RID}
                                    </td>
                                    <td className="align-middle text-center">
                                      {item.assets}
                                    </td>
                                    <td className="align-middle text-center">
                                      {item.status}
                                    </td>
                                    <td className="align-middle text-center">
                                      <button
                                        className="btn btn-sm form-Button-Del me-1"
                                        onClick={() => handleDelete(item)}
                                        aria-label="Delete row"
                                      >
                                        <i className="bi bi-trash-fill"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="11" className="text-center">
                                    Data Not Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Request History */}
                        <div
                          className="tab-pane fade"
                          id="request"
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
        title="Add User"
        icon="bi bi-person-plus"
        size="modal-lg"
        scrollable="modal-dialog-scrollable"
      >
        <p>Form ใส่เนื้อหา</p>
      </Modal>
    </Layout>
  );
}

export default RoomDetail;
