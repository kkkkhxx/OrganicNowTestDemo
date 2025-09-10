import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import Pagination from "../component/pagination";
import { pageSize as defaultPageSize } from "../config_variable";
import "../assets/css/maintenancerequest.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function MaintenanceRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- Pagination ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // ---------------- Mock options ----------------
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
    { value: "203", label: "Room 203", floor: "2" },
  ];
  const targetOptions = [
    { value: "asset", label: "Asset" },
    { value: "building", label: "Building" },
  ];
  const issueOptions = [
    { value: "air", label: "Air conditioner" },
    { value: "light", label: "Light" },
    { value: "wall", label: "Wall" },
    { value: "plumbing", label: "Plumbing" },
  ];
  const maintainTypeOptions = [
    { value: "fix", label: "Fix" },
    { value: "shift", label: "Shift" },
    { value: "clean", label: "Clean" },
  ];

  // ---------------- Table data (mock) ----------------
  const [rows, setRows] = useState([
    {
      id: 1,
      room: "101",
      floor: "1",
      target: "Asset",
      issue: "Air conditioner",
      maintainType: "Fix",
      requestDate: "2025-03-11",
      maintainDate: "2025-03-14",
      completeDate: "-",
      state: "Not Started",
    },
    {
      id: 2,
      room: "102",
      floor: "1",
      target: "Building",
      issue: "Wall",
      maintainType: "Fix",
      requestDate: "2025-02-28",
      maintainDate: "2025-02-28",
      completeDate: "2025-02-28",
      state: "Complete",
    },
    {
      id: 3,
      room: "203",
      floor: "2",
      target: "Asset",
      issue: "Light",
      maintainType: "Shift",
      requestDate: "2025-02-28",
      maintainDate: "2025-02-28",
      completeDate: "2025-02-28",
      state: "Complete",
    },
  ]);

  // ------------- Toolbar: selection + search -------------
  const [selected, setSelected] = useState([]);
  const isAllSelected = rows.length > 0 && selected.length === rows.length;

  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    const kw = search.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (!kw) return true;
      return (
        r.room.toLowerCase().includes(kw) ||
        r.floor.toLowerCase().includes(kw) ||
        r.issue.toLowerCase().includes(kw) ||
        r.target.toLowerCase().includes(kw) ||
        r.maintainType.toLowerCase().includes(kw) ||
        r.state.toLowerCase().includes(kw)
      );
    });
    setTotalRecords(list.length);
    setTotalPages(1); // mock
    return list;
  }, [rows, search]);

  const toggleRow = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleAll = () =>
    setSelected((prev) => (prev.length === rows.length ? [] : rows.map((r) => r.id)));

  const removeRow = (row) => {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setSelected((prev) => prev.filter((id) => id !== row.id));
  };

  // ---------------- Create Request (modal form) ----------------
  const [form, setForm] = useState({
    floor: "",
    room: "",
    target: "",
    issue: "",
    maintainType: "",
    requestDate: "",
    maintainDate: "",
    completeDate: "",
    state: "Not Started",
    technician: "",
    phone: "",
  });

  const roomOptions = useMemo(
    () => allRooms.filter((r) => r.floor === form.floor),
    [form.floor]
  );

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: value,
      ...(name === "floor" ? { room: "" } : {}),
    }));
  };

  const isFormValid =
    form.floor &&
    form.room &&
    form.target &&
    form.issue &&
    form.maintainType &&
    form.requestDate;

  const resetForm = () =>
    setForm({
      floor: "",
      room: "",
      target: "",
      issue: "",
      maintainType: "",
      requestDate: "",
      maintainDate: "",
      completeDate: "",
      state: "Not Started",
      technician: "",
      phone: "",
    });

  const closeModal = () => {
    const el = document.getElementById("requestModal");
    if (window.bootstrap && el) window.bootstrap.Modal.getInstance(el)?.hide();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;

    const newRow = {
      id: nextId,
      room: form.room,
      floor: form.floor,
      target: targetOptions.find((t) => t.value === form.target)?.label || form.target,
      issue: issueOptions.find((i) => i.value === form.issue)?.label || form.issue,
      maintainType:
        maintainTypeOptions.find((m) => m.value === form.maintainType)?.label ||
        form.maintainType,
      requestDate: form.requestDate,
      maintainDate: form.maintainDate || "-",
      completeDate: form.completeDate || "-",
      state: form.state || "Not Started",
    };

    setRows((prev) => [newRow, ...prev]);
    resetForm();
    closeModal();
  };

  const viewRow = (row) => {
    navigate("/requestdetail", {
      state: {
        room: row.room,
        floor: row.floor,
        status: row.state === "Complete" ? "Available" : "Unavailable",
        from: location.pathname,
      },
    });
  };

  const MaintainTypePill = ({ type }) => {
    const isFix = type.toLowerCase() === "fix";
    const isShift = type.toLowerCase() === "shift";
    return (
      <span
        className={`badge rounded-pill px-2 ${
          isFix ? "bg-danger-subtle text-danger" : isShift ? "bg-info-subtle text-info" : "bg-secondary-subtle text-secondary"
        }`}
        style={{ fontWeight: 600 }}
      >
        {type}
      </span>
    );
  };

  const StateBadge = ({ state }) => {
    const complete = state.toLowerCase() === "complete";
    return (
      <span className={`badge rounded-pill ${complete ? "bg-success" : "bg-secondary-subtle text-secondary"}`}>
        {complete ? "Complete" : "Not Started"}
      </span>
    );
  };

  return (
    <Layout title="Maintenance Request" icon="bi bi-wrench-adjustable" notifications={3}>
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                      data-bs-target="#requestModal"
                    >
                      <i className="bi bi-plus-lg me-1" /> Create Request
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper card border-0 bg-white shadow-sm overflow-hidden">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table text-nowrap align-middle tm-left mb-0">
                    <thead className="header-color">
                      <tr>
                        <th>Order</th>
                        <th>Room</th>
                        <th>Floor</th>
                        <th>Target</th>
                        <th>Issue</th>
                        <th>Maintain type</th>
                        <th>Request date</th>
                        <th>Maintain date</th>
                        <th>Complete date</th>
                        <th>State</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.length ? (
                        filteredRows.map((row, index) => (
                          <tr key={row.id}>
                            <td>{index + 1}</td> {/* Display index + 1 for Order */}
                            <td>{row.room}</td>
                            <td>{row.floor}</td>
                            <td>{row.target}</td>
                            <td>{row.issue}</td>
                            <td><MaintainTypePill type={row.maintainType} /></td>
                            <td>{row.requestDate}</td>
                            <td>{row.maintainDate}</td>
                            <td>{row.completeDate}</td>
                            <td><StateBadge state={row.state} /></td>

                            <td>
                              <button
                                className="btn btn-sm form-Button-Edit me-1"
                                onClick={() => viewRow(row)}
                                title="View"
                              >
                                <i className="bi bi-eye-fill" />
                              </button>
                              <button
                                className="btn btn-sm form-Button-Del"
                                onClick={() => removeRow(row)}
                                title="Delete"
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
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalRecords={totalRecords}
              onPageSizeChange={handlePageSizeChange}
            />

            {/* Create Request Modal */}
            <Modal
              id="requestModal"
              title="Repair Add"
              icon="bi bi-tools"
              size="modal-xl"
              scrollable="modal-dialog-scrollable"
            >
              <form onSubmit={handleCreate}>
                <div className="row g-4">
                  {/* Room Information */}
                  <div className="col-12">
                    <h6 className="text-muted mb-2">Room Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Floor</label>
                        <select
                          name="floor"
                          className="form-select"
                          value={form.floor}
                          onChange={onFormChange}
                        >
                          <option value="">Select Floor</option>
                          {floorOptions.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Room</label>
                        <select
                          name="room"
                          className="form-select"
                          value={form.room}
                          onChange={onFormChange}
                          disabled={!form.floor}
                        >
                          <option value="">{form.floor ? "Select Room" : "Select floor first"}</option>
                          {roomOptions.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Repair Information */}
                  <div className="col-12">
                    <h6 className="text-muted mb-2">Repair Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Target</label>
                        <select
                          name="target"
                          className="form-select"
                          value={form.target}
                          onChange={onFormChange}
                        >
                          <option value="">Select Target</option>
                          {targetOptions.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Issue</label>
                        <select
                          name="issue"
                          className="form-select"
                          value={form.issue}
                          onChange={onFormChange}
                        >
                          <option value="">Select Issue</option>
                          {issueOptions.map((i) => (
                            <option key={i.value} value={i.value}>{i.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Maintain type</label>
                        <select
                          name="maintainType"
                          className="form-select"
                          value={form.maintainType}
                          onChange={onFormChange}
                        >
                          <option value="">Select Maintain type</option>
                          {maintainTypeOptions.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Request date</label>
                        <div className="input-group">
                          <input
                            type="date"
                            className="form-control"
                            name="requestDate"
                            value={form.requestDate}
                            onChange={onFormChange}
                          />
                          <span className="input-group-text"><i className="bi bi-calendar-event" /></span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Maintain date</label>
                        <div className="input-group">
                          <input
                            type="date"
                            className="form-control"
                            name="maintainDate"
                            value={form.maintainDate}
                            onChange={onFormChange}
                          />
                          <span className="input-group-text"><i className="bi bi-calendar-event" /></span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Complete date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="completeDate"
                          value={form.completeDate}
                          onChange={onFormChange}
                          disabled={form.state !== "Complete"}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">State</label>
                        <select
                          name="state"
                          className="form-select"
                          value={form.state}
                          onChange={onFormChange}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Technician Information */}
                  <div className="col-12">
                    <h6 className="text-muted mb-2">Technician Information</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Technician’s name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Add Technician’s name"
                          name="technician"
                          value={form.technician}
                          onChange={onFormChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="Add Phone Number"
                          name="phone"
                          value={form.phone}
                          onChange={onFormChange}
                        />
                      </div>
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

export default MaintenanceRequest;
