import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import Pagination from "../component/pagination";
import { pageSize as defaultPageSize } from "../config_variable";
import "../assets/css/roommanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function RoomManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchData?.(page);
    }
  };
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    fetchData?.(1);
    setCurrentPage(1);
  };

  // ข้อมูลเริ่มต้นไม่มี rid มีเฉพาะ room/floor/status/request
  const [data, setData] = useState([
    { room: "101", floor: "1", status: "Unavailable", request: 1 },
    { room: "102", floor: "1", status: "Unavailable", request: 0 },
    { room: "103", floor: "1", status: "Available", request: 0 },
    { room: "104", floor: "1", status: "Unavailable", request: 0 },
    { room: "105", floor: "1", status: "Unavailable", request: 0 },
    { room: "110", floor: "1", status: "Available", request: 0 },
  ]);

  const floorOptions = [
    { value: "1", label: "Floor 1" },
    { value: "2", label: "Floor 2" },
  ];
  const allRooms = [
    { value: "101", label: "Room 101", floor: "1" },
    { value: "102", label: "Room 102", floor: "1" },
    { value: "110", label: "Room 110", floor: "1" },
    { value: "201", label: "Room 201", floor: "2" },
    { value: "202", label: "Room 202", floor: "2" },
  ];
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

  const [form, setForm] = useState({ floor: "", room: "", assets: [] });

  const roomOptions = useMemo(
    () => allRooms.filter((r) => r.floor === form.floor),
    [form.floor]
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "floor") {
      setForm((s) => ({ ...s, floor: value, room: "" }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleAddAsset = (e) => {
    const val = e.target.value;
    if (!val) return;
    const label = assetOptions.find((a) => a.value === val)?.label ?? val;
    setForm((s) =>
      s.assets.includes(label) ? s : { ...s, assets: [...s.assets, label] }
    );
    e.target.value = "";
  };

  const handleRemoveAsset = (label) => {
    setForm((s) => ({ ...s, assets: s.assets.filter((a) => a !== label) }));
  };

  const isFormValid = form.floor && form.room && form.assets.length > 0;

  const resetForm = () => setForm({ floor: "", room: "", assets: [] });

  const closeModal = () => {
    const el = document.getElementById("exampleModal");
    if (window.bootstrap && el) window.bootstrap.Modal.getInstance(el)?.hide();
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // สร้างแถวใหม่ (ไม่จำเป็นต้องแสดง rid ในตาราง)
    const nextNum = data.length + 1;
    const newRid = `R${String(nextNum).padStart(2, "0")}`;

    const newRow = {
      rid: newRid, // เก็บไว้เผื่อใช้ภายหลัง แต่ไม่ได้แสดงในตารางนี้
      floor: form.floor,
      room: form.room,
      status: "Available",
      request: 0,
      assets: form.assets,
    };

    setData((prev) => [newRow, ...prev]);
    resetForm();
    closeModal();
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectRow = (rowIndex) => {
    setSelectedItems((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) setSelectedItems([]);
    else setSelectedItems(data.map((_, idx) => idx));
  };
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  const handleDelete = (item) => console.log("Delete: ", item);

  // เอา rid ออกเพื่อหลีกเลี่ยง undefined ในรายการเริ่มต้น
  const handleViewRoom = (item) => {
    navigate("/roomdetail", {
      state: {
        room: item.room,
        floor: item.floor,
        status: item.status,
        from: location.pathname,
      },
    });
  };

  const toggleStatus = (idx) => {
    setData((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, status: r.status === "Available" ? "Unavailable" : "Available" }
          : r
      )
    );
  };

  const StatusPill = ({ ok }) => (
    <span className={`badge rounded-pill ${ok ? "bg-success" : "bg-danger"}`}>
      {ok ? "Available" : "Unavailable"}
    </span>
  );

  return (
    <Layout title="Room Management" icon="bi bi-building" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0 rounded-3">
                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-link tm-link p-0">
                      <i className="bi bi-filter me-1" /> Filter
                    </button>
                    <button className="btn btn-link tm-link p-0">
                      <i className="bi bi-arrow-down-up me-1" /> Sort
                    </button>
                    <div className="input-group tm-search">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search"
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-light text-danger border-0">
                      <i className="bi bi-trash" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i className="bi bi-plus-lg me-1" /> Create Room
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <table className="table text-nowrap align-middle tm-left">
                {/* หัวตารางสีน้ำเงิน */}
                <thead className="header-color">
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </th>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Status</th>
                    <th>Request</th>
                    <th>Action</th>
                  </tr>
                </thead>

                {/* เนื้อหาตาราง ให้ลำดับและฟิลด์ตรงกับหัวตาราง */}
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, idx) => {
                      const ok = item.status.toLowerCase() === "available";
                      return (
                        <tr key={idx}>
                          {/* checkbox */}
                          <td className="checkbox-cell">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(idx)}
                              onChange={() => handleSelectRow(idx)}
                              aria-label={`Select row ${idx + 1}`}
                            />
                          </td>

                          {/* Room */}
                          <td>{item.room}</td>

                          {/* Floor */}
                          <td>{item.floor}</td>

                          {/* Status */}
                          <td>
                            <button
                              className="btn btn-link p-0 border-0 text-decoration-none"
                              onClick={() => toggleStatus(idx)}
                              title="Toggle status"
                            >
                              <StatusPill ok={ok} />
                            </button>
                          </td>

                          {/* Request */}
                          <td>
                            <span
                              className={`request-dot ${
                                item.request === 1 ? "request-active" : "request-inactive"
                              }`}
                              title={item.request === 1 ? "มีการรีเควส" : "ไม่มีรีเควส"}
                            ></span>
                          </td>

                          {/* Action */}
                          <td>
                            <button
                              className="btn btn-sm form-Button-Edit me-1"
                              onClick={() => handleViewRoom(item)}
                              aria-label="View"
                              title="View"
                            >
                              <i className="bi bi-eye-fill" />
                            </button>
                            <button
                              className="btn btn-sm form-Button-Del"
                              onClick={() => handleDelete(item)}
                              aria-label="Delete"
                              title="Delete"
                            >
                              <i className="bi bi-trash-fill" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7">Data Not Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalRecords={totalRecords}
              onPageSizeChange={handlePageSizeChange}
            />

            {/* Modal */}
            <Modal
              id="exampleModal"
              title="Create Room"
              icon="bi bi-door-open"
              size="modal-lg"
              scrollable="modal-dialog-scrollable"
            >
              <form onSubmit={handleCreateRoom}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Floor</label>
                    <select
                      name="floor"
                      className="form-select"
                      value={form.floor}
                      onChange={handleFormChange}
                    >
                      <option value="">Add Floor</option>
                      {floorOptions.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Room</label>
                    <select
                      name="room"
                      className="form-select"
                      value={form.room}
                      onChange={handleFormChange}
                      disabled={!form.floor}
                    >
                      <option value="">
                        {form.floor ? "Add Room" : "Select floor first"}
                      </option>
                      {roomOptions.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Asset multi-select + tags */}
                  <div className="col-12">
                    <label className="form-label">Asset</label>
                    <select className="form-select" onChange={handleAddAsset} defaultValue="">
                      <option value="">Select Asset</option>
                      {assetOptions.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {form.assets.map((a) => (
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
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      resetForm();
                      closeModal();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                    Save
                  </button>
                </div>
              </form>
            </Modal>
          </div>
          {/* /Main */}
        </div>
      </div>
    </Layout>
  );
}

export default RoomManagement;
