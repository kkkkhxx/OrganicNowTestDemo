import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/roomdetail.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function RoomDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // รับค่าที่ส่งมาจาก RoomManagement
  const { room, rid, floor, from, status } = location.state || {};
  const backPath = from || "/roommanagement";

  // ---- Room info (ใช้ในการแสดงผล + แบบฟอร์ม) ----
  const [roomInfo, setRoomInfo] = useState({
    room: room ?? "",
    floor: floor ?? "",
    status: status ?? "Unavailable",
  });

  // ถ้าไม่มี room ให้ย้อนกลับ
  useEffect(() => {
    if (!room) navigate("/roommanagement");
  }, [room, navigate]);

  // อัปเดตข้อมูลเมื่อ location.state เปลี่ยน (กันกรณีเข้ามาพร้อมค่าใหม่)
  useEffect(() => {
    setRoomInfo({
      room: room ?? "",
      floor: floor ?? "",
      status: status ?? "Unavailable",
    });
  }, [room, floor, status]);

  // ---- ตาราง Assets (เหมือนเดิม) ----
  const [data, setData] = useState([{ order: 1, RID: "", assets: "Light", status: "Active" }]);
  useEffect(() => {
    if (rid) setData((prev) => prev.map((r) => ({ ...r, RID: rid })));
  }, [rid]);

  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) setSelectedItems([]);
    else setSelectedItems(data.map((_, idx) => idx));
  };
  const handleSelectRow = (rowIndex) => {
    setSelectedItems((prev) =>
      prev.includes(rowIndex) ? prev.filter((i) => i !== rowIndex) : [...prev, rowIndex]
    );
  };
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  const handleDelete = (item) => console.log("Delete: ", item);

  const getStatusColor = (s) => {
    switch ((s || "").toLowerCase()) {
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

  // ---- ฟอร์มแก้ไขห้องในโมดัล (คงฟังก์ชันเดิม) ----
  const [form, setForm] = useState({ room: "", floor: "", status: "Unavailable" });

  // เปิดโมดัลครั้งแรก ให้โหลดค่าปัจจุบันเข้าฟอร์ม
  useEffect(() => {
    setForm({
      room: roomInfo.room ?? "",
      floor: roomInfo.floor ?? "",
      status: roomInfo.status ?? "Unavailable",
    });
  }, [roomInfo]);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const closeModal = () => {
    const el = document.getElementById("editRoomModal");
    if (window.bootstrap && el) window.bootstrap.Modal.getInstance(el)?.hide();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // อัปเดตข้อมูลที่แสดงบนหน้า (Room Information card)
    setRoomInfo((prev) => ({
      ...prev,
      room: form.room.trim(),
      floor: form.floor.trim(),
      status: form.status, // คงเดิม แม้ไม่ได้แสดงในฟอร์ม
    }));
    closeModal();
  };

  /* ==================== เพิ่มเฉพาะส่วน Asset สำหรับโมดัล ==================== */
  const assetOptions = [
    { value: "mesh", label: "Mesh screen" },
    { value: "light", label: "Light" },
    { value: "plumbing", label: "Plumbing" },
    { value: "fridge", label: "Fridge" },
    { value: "wardrobe", label: "Wardrobe" },
    { value: "dining_table", label: "Dining table" },
    { value: "chair", label: "Chair" },
    { value: "bedside_table", label: "Bedside table" },
    { value: "air", label: "Air Conditioner" },
    { value: "fan", label: "Fan" },
  ];

  // เก็บ Asset ที่เลือกไว้ในโมดัล (คงค่าเดิมอัตโนมัติ)
  const [selectedAssets, setSelectedAssets] = useState([]);

  // เติมค่าเริ่มต้นของ selectedAssets ให้ “คงค่าเดิม”
  // 1) ใช้ location.state.assets ถ้ามี
  // 2) ถ้าไม่มีก็รวมจากตาราง data (รองรับทั้ง string/array)
  useEffect(() => {
    const assetsFromState = Array.isArray(location.state?.assets)
      ? location.state.assets
      : [];

    const assetsFromTable = Array.from(
      new Set(
        (data || [])
          .map((r) => r.assets)
          .flatMap((a) =>
            Array.isArray(a) ? a : (a ? String(a).split(",") : [])
          )
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );

    const initial = assetsFromState.length ? assetsFromState : assetsFromTable;
    setSelectedAssets(initial);
  }, [location.state, data]);

  const handleAddAsset = (e) => {
    const val = e.target.value;
    if (!val) return;
    const label = assetOptions.find((a) => a.value === val)?.label ?? val;
    setSelectedAssets((prev) => (prev.includes(label) ? prev : [...prev, label]));
    e.target.value = "";
  };

  const handleRemoveAsset = (label) =>
    setSelectedAssets((prev) => prev.filter((x) => x !== label));
  /* ======================================================================== */

  return (
    <Layout title="Room Detail" icon="bi bi-folder" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar Card */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0 rounded-2">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  {/* Breadcrumb */}
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="breadcrumb-link text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(backPath)}
                    >
                      Room Management
                    </span>
                    <span className="text-muted">›</span>
                    <span className="breadcrumb-current">{roomInfo.room || "-"}</span>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-light text-danger border-0">
                      <i className="bi bi-trash" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#editRoomModal"
                    >
                      <i className="bi bi-pencil me-1" /> Edit Room
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-wrapper-detail rounded-0">
              <div className="row g-4">
                {/* Room Info */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm rounded-2">
                    <div className="card-body">
                      <h5 className="card-title">Room Information</h5>

                      <p>
                        <span className="label">Floor:</span>
                        <span className="value">{roomInfo.floor || "-"}</span>
                      </p>
                      <p>
                        <span className="label">Room:</span>
                        <span className="value">{roomInfo.room || "-"}</span>
                      </p>
                      <p>
                        <span className="label">Status:</span>
                        <span
                          className={`value fw-bold ${
                            roomInfo.status === "Available" ? "text-success" : "text-danger"
                          }`}
                        >
                          {roomInfo.status || "-"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm mt-3 rounded-2">
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
                          <span className="package-badge badge bg-primary">1 Year</span>
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

                {/* Assets & Requests */}
                <div className="col-lg-8 d-flex flex-column">
                  <div className="card border-0 shadow-sm flex-grow-1 rounded-2" style={{ overflowY: "auto", paddingRight: "8px" }}>
                    <div className="card-body d-flex flex-column overflow-hidden">
                      {/* Tabs */}
                      <ul className="nav nav-tabs bg-white" id="historyTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button className="nav-link active" id="payment-tab" data-bs-toggle="tab" data-bs-target="#payment" type="button" role="tab">
                            Assets
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button className="nav-link" id="request-tab" data-bs-toggle="tab" data-bs-target="#request" type="button" role="tab">
                            Request History
                          </button>
                        </li>
                      </ul>

                      {/* Content */}
                      <div className="tab-content mt-3 overflow-auto flex-grow-1" style={{ maxHeight: "500px" }}>
                        {/* Assets */}
                        <div className="tab-pane fade show active rounded-2" id="payment" role="tabpanel">
                          <table className="table text-nowrap">
                            <thead>
                              <tr>
                                {/*<th className="text-center header-color checkbox-cell">*/}
                                {/*  <input*/}
                                {/*    type="checkbox"*/}
                                {/*    checked={isAllSelected}*/}
                                {/*    onChange={handleSelectAll}*/}
                                {/*    aria-label="Select all rows"*/}
                                {/*  />*/}
                                {/*</th>*/}
                                <th className="text-center align-middle header-color">Order</th>
                                <th className="text-center align-middle header-color">RID</th>
                                <th className="text-center align-middle header-color">Assets</th>
                                <th className="text-center align-middle header-color">Status</th>
                                  <th className="text-center align-middle header-color">Action</th>
                                {/*<th className="text-center align-middle header-color">*/}
                                {/*  <div className="btn-container">*/}
                                {/*    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editRoomModal">*/}
                                {/*      <i className="bi bi-pencil me-1" /> Add*/}
                                {/*    </button>*/}
                                {/*  </div>*/}
                                {/*</th>*/}
                              </tr>
                            </thead>

                            <tbody>
                              {data.length > 0 ? (
                                data.map((item, idx) => (
                                  <tr key={idx}>
                                    {/*<td className="align-middle text-center checkbox-cell">*/}
                                    {/*  <input*/}
                                    {/*    type="checkbox"*/}
                                    {/*    checked={selectedItems.includes(idx)}*/}
                                    {/*    onChange={() => handleSelectRow(idx)}*/}
                                    {/*    aria-label={`Select row ${idx + 1}`}*/}
                                    {/*  />*/}
                                    {/*</td>*/}

                                    <td className="align-middle text-center">{item.order}</td>
                                    <td className="align-middle text-center">{item.RID || rid || "-"}</td>
                                    <td className="align-middle text-center">{item.assets}</td>
                                    <td className="align-middle text-center">{item.status}</td>
                                    <td className="align-middle text-center">
                                      <button
                                        className="btn btn-sm form-Button-Del me-1"
                                        onClick={() => handleDelete(item)}
                                        aria-label="Delete row"
                                      >
                                        <i className="bi bi-trash-fill" />
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="11" className="text-center">Data Not Found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Request History */}
                        <div className="tab-pane fade" id="request" role="tabpanel">
                          <div className="row row-cols-1 row-cols-md-2 g-3">
                            {[
                              { date: "2025-04-30", id: "iv0001250430", net: "4,438 Baht", status: "In process", pay: "2025-04-16", penalty: "-" },
                              { date: "2025-03-31", id: "iv0001250331", net: "4,438 Baht", status: "Complete",  pay: "2025-04-16", penalty: "1,000 Baht" },
                            ].map((inv, idx) => (
                              <div className="col-lg-12" key={idx}>
                                <div className={`status-card ${getStatusColor(inv.status)} d-flex flex-column`}>
                                  <div className="row mb-1">
                                    <div className="col-4">
                                      <span className="label">Invoice date: </span>
                                      <span className="value">{inv.date}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">Invoice ID: </span>
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
                                      <span className="value">{inv.status}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">Pay date:</span>
                                      <span className="value">{inv.pay}</span>
                                    </div>
                                    <div className="col-4">
                                      <span className="label">Penalty: </span>
                                      <span className="value">{inv.penalty}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* /Content */}
                    </div>
                  </div>
                </div>
                {/* /Assets & Requests */}
              </div>
            </div>
          </div>
          {/* /Main */}
        </div>
      </div>

      {/* ==== Modal: Edit Room (เอา Status ออก + เลือก Asset และคงค่าเดิม) ==== */}
      <Modal
        id="editRoomModal"
        title="Edit Room"
        icon="bi bi-pencil-square"
        size="modal-lg"
        scrollable="modal-dialog-scrollable"
      >
        <form onSubmit={onSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Floor</label>
              <input
                type="text"
                name="floor"
                className="form-control"
                value={form.floor}
                onChange={onFormChange}
                placeholder="e.g. 1"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Room</label>
              <input
                type="text"
                name="room"
                className="form-control"
                value={form.room}
                onChange={onFormChange}
                placeholder="e.g. 101"
              />
            </div>

            {/* Asset selector */}
            <div className="col-md-4">
              <label className="form-label">Asset</label>
              <select className="form-select" onChange={handleAddAsset} defaultValue="">
                <option value="">Select Asset</option>
                {assetOptions.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Chips แสดง Asset เดิม + ที่เลือกเพิ่ม */}
            <div className="col-12">
              <div className="d-flex flex-wrap gap-2">
                {selectedAssets.length > 0 ? (
                  selectedAssets.map((a) => (
                    <span
                      key={a}
                      className="badge rounded-pill border border-primary text-primary px-3 py-2"
                    >
                      {a}
                      <button
                        type="button"
                        className="btn-close btn-close-sm ms-2"
                        aria-label="Remove"
                        onClick={() => handleRemoveAsset(a)}
                        style={{ fontSize: "0.6rem" }}
                      />
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No assets selected</span>
                )}
              </div>
            </div>

            {/* คงฟังก์ชันเดิม: ไม่แสดง status ในฟอร์ม แต่ state form.status ยังอยู่ */}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default RoomDetail;
