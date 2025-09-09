import React, { useEffect, useMemo, useState } from "react";
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

  // 1) Pagination state (คำนวณจาก data ในหน้านี้)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);      // แก้ค่าเริ่มให้เป็น 1
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 2) Mock data
  const [data, setData] = useState([
    { room: "101", floor: "1", status: "Unavailable", request: 1 },
    { room: "102", floor: "1", status: "Unavailable", request: 0 },
    { room: "103", floor: "1", status: "Available", request: 0 },
    { room: "104", floor: "1", status: "Unavailable", request: 0 },
    { room: "105", floor: "1", status: "Unavailable", request: 0 },
    { room: "110", floor: "1", status: "Available", request: 0 },
  ]);

  // 3) คำนวณ totalRecords/totalPages ทุกครั้งที่ data หรือ pageSize เปลี่ยน
  useEffect(() => {
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    setTotalRecords(total);
    setTotalPages(pages);
    setCurrentPage((p) => Math.min(Math.max(1, p), pages)); // กันหน้าเกิน
  }, [data, pageSize]);

  // 4) slice ข้อมูลตามหน้า + คำนวณลำดับ (order)
  const startIdx = (currentPage - 1) * pageSize;
  const pagedData = data.slice(startIdx, startIdx + pageSize);

  // 5) เปลี่ยนหน้า/เปลี่ยนขนาดหน้า (ลบ fetchData ออก)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // ----- ฟอร์มใน Modal -----
  const [form, setForm] = useState({ floor: "", room: "", assets: [] });

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

  const resetForm = () => setForm({ floor: "", room: "", assets: [] });

  const closeModal = () => {
    const el = document.getElementById("exampleModal");
    if (window.bootstrap && el) window.bootstrap.Modal.getInstance(el)?.hide();
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    const nextNum = data.length + 1;
    const newRid = `R${String(nextNum).padStart(2, "0")}`;
    const newRow = {
      rid: newRid,
      floor: form.floor,
      room: form.room,
      status: "Available",
      request: 0,
      assets: form.assets,
    };
      setData((prev) => [...prev, newRow]);

      resetForm();
      closeModal();

  };

  // ----- Selection/Toggles อิง "index รวม" + Select All เฉพาะหน้าปัจจุบัน -----
  const [selectedItems, setSelectedItems] = useState([]); // เก็บเป็น index รวม (global)

  const handleDelete = (item) => console.log("Delete: ", item);

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

  const toggleStatus = (globalIndex) => {
    setData((prev) =>
      prev.map((r, i) =>
        i === globalIndex
          ? { ...r, status: r.status === "Available" ? "Unavailable" : "Available" }
          : r
      )
    );
  };

  const StatusPill = ({ status }) => (
    <span className={`badge rounded-pill ${status === "Available" ? "bg-success" : "bg-danger"}`}>
      {status}
    </span>
  );

  return (
    <Layout title="Room Management" icon="bi bi-folder" notifications={3}>
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Main */}
          <div className="col-lg-11 p-4">
            {/* Toolbar */}
            <div className="toolbar-wrapper card border-0 bg-white">
              <div className="card-header bg-white border-0">
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
                <thead className="header-color">
                  <tr>
                    {/* Removed checkbox column */}
                    <th>Order</th>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Status</th>
                    <th>Request</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedData.length > 0 ? (
                    pagedData.map((item, idx) => {
                      const globalIndex = startIdx + idx; // index รวม
                      const order = startIdx + idx + 1;    // หมายเลขลำดับ

                      return (
                        <tr key={`${item.room}-${globalIndex}`}>
                          {/* Order */}
                          <td>{order}</td>

                          {/* Room */}
                          <td>{item.room}</td>

                          {/* Floor */}
                          <td>{item.floor}</td>

                          {/* Status */}
                          <td>
                            <StatusPill status={item.status} />
                          </td>

                          {/* Request */}
                          <td>
                            <span
                              className={`request-dot ${item.request === 1 ? "request-active" : "request-inactive"}`}
                              title={item.request === 1 ? "มีการรีเควส" : "ไม่มีรีเควส"}
                            />
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
                      <td colSpan="6">Data Not Found</td>
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
          </div>
          {/* /Main */}
        </div>
      </div>

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
                onChange={(e) => setForm((s) => ({ ...s, floor: e.target.value }))}
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
                onChange={(e) => setForm((s) => ({ ...s, room: e.target.value }))}
                disabled={!form.floor}
              >
                <option value="">{form.floor ? "Add Room" : "Select floor first"}</option>
                {allRooms.filter((r) => r.floor === form.floor).map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Asset</label>
              <select
                className="form-select"
                onChange={(e) => {
                  const asset = e.target.value;
                  if (asset && !form.assets.includes(asset)) {
                    setForm((s) => ({ ...s, assets: [...s.assets, asset] }));
                  }
                }}
                value=""
              >
                <option value="">Select Asset</option>
                {assetOptions.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {form.assets.map((asset) => (
                  <span key={asset} className="badge rounded-pill border border-primary text-primary px-3 py-2">
                    {asset}
                    <button
                      type="button"
                      className="btn-close btn-close-sm ms-2"
                      aria-label="Remove"
                      onClick={() => {
                        setForm((s) => ({
                          ...s,
                          assets: s.assets.filter((a) => a !== asset),
                        }));
                      }}
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
              data-bs-dismiss="modal"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!form.floor || !form.room || form.assets.length === 0}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default RoomManagement;
