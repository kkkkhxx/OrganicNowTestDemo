import React, { useMemo, useState, useEffect } from "react";
import Layout from "../component/layout";
import Modal from "../component/modal";
import Pagination from "../component/pagination";
import { pageSize as defaultPageSize } from "../config_variable";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/* ===================== สีแบบวิธี B ===================== */
// พาเลตตามจำนวนเดือน (ถ้า match ใช้อันนี้ก่อน)
const COLOR_BY_MONTHS = {
    3:  "#FFC73B",
    6:  "#EF98C4",
    9:  "#87C6FF",
    12: "#9691F9",
};

// แปลง string -> สี HSL คงที่ (สำหรับ fallback)
function hashToColor(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    const hue = Math.abs(h) % 360;
    return `hsl(${hue}, 70%, 70%)`;
}

// รับประกันว่ามี color เสมอ (ถ้ามีมาแล้วก็ใช้, ไม่มีก็ derive)
function withColor(pkg) {
    if (pkg.color) return pkg;
    const key = String(pkg.label || pkg.id || "");
    const derived = COLOR_BY_MONTHS[pkg.months] || hashToColor(key);
    return { ...pkg, color: derived };
}

/* ===================== ปิดโมดัลแบบชัวร์ ๆ ===================== */
const closeModalSafely = (id) => {
    const el = document.getElementById(id);
    const inst = el ? (bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el)) : null;
    if (inst) {
        inst.hide();
        inst.dispose();
    } else {
        const opened = document.querySelector(".modal.show");
        if (opened) bootstrap.Modal.getInstance(opened)?.hide();
    }
    document.querySelectorAll(".modal-backdrop").forEach((d) => d.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("paddingRight");
};

function PackageManagement() {
    /* --------- DATA (mock เริ่มต้น) ---------- */
    const [packages, setPackages] = useState([
        { id: 1, label: "3 Month", months: 3, rent: 5500, createDate: "2024-12-31", active: true,  color: "#FFC73B" },
        { id: 2, label: "6 Month", months: 6, rent: 5000, createDate: "2025-01-30", active: true,  color: "#EF98C4" },
        { id: 3, label: "9 Month", months: 9, rent: 4500, createDate: "2025-01-30", active: true,  color: "#87C6FF" },
        { id: 4, label: "1 Year",  months: 12, rent: 4000, createDate: "2025-01-30", active: true,  color: "#9691F9" },
        { id: 5, label: "3 Month", months: 3, rent: 6000, createDate: "2025-01-30", active: true,  color: "#FFC73B" },
        { id: 6, label: "6 Month", months: 6, rent: 5500, createDate: "2025-01-30", active: false, color: "#EF98C4" },
        { id: 7, label: "9 Month", months: 9, rent: 5000, createDate: "2025-01-30", active: true,  color: "#87C6FF" },
        { id: 8, label: "1 Year",  months: 12, rent: 4500, createDate: "2025-01-30", active: true,  color: "#9691F9" },
    ]);

    // รับประกันว่ามีสีเสมอ (กรณีดึงจากฐานข้อมูลจริงแล้วไม่ได้ส่ง color มา)
    useEffect(() => {
        setPackages((prev) => prev.map(withColor));
    }, []);

    /* --------- TABLE CONTROLS ---------- */
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);

    const [filters, setFilters] = useState({
        label: "ALL",
        active: "ALL",
        rentMin: "",
        rentMax: "",
        dateFrom: "",
        dateTo: "",
    });

    const clearFilters = () =>
        setFilters({ label: "ALL", active: "ALL", rentMin: "", rentMax: "", dateFrom: "", dateTo: "" });

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = [...packages];

        rows = rows.filter((p) => {
            if (filters.label !== "ALL" && p.label !== filters.label) return false;
            if (filters.active !== "ALL") {
                const want = filters.active === "TRUE";
                if (p.active !== want) return false;
            }
            if (filters.rentMin !== "" && p.rent < Number(filters.rentMin)) return false;
            if (filters.rentMax !== "" && p.rent > Number(filters.rentMax)) return false;
            if (filters.dateFrom && p.createDate < filters.dateFrom) return false;
            if (filters.dateTo && p.createDate > filters.dateTo) return false;
            return true;
        });

        if (q) {
            rows = rows.filter(
                (p) =>
                    p.label.toLowerCase().includes(q) ||
                    String(p.rent).includes(q) ||
                    p.createDate.includes(q)
            );
        }

        rows.sort((a, b) =>
            sortAsc ? a.createDate.localeCompare(b.createDate) : b.createDate.localeCompare(a.createDate)
        );

        return rows;
    }, [packages, filters, search, sortAsc]);

    /* --------- PAGINATION ---------- */
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize || 10);
    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortAsc, pageSize, filters]);

    const pageRows = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    /* --------- SELECTION ---------- */
    const [selected, setSelected] = useState([]);
    const isAllSelected = pageRows.length > 0 && selected.length === pageRows.length;

    const toggleSelectRow = (rowId) => {
        setSelected((prev) =>
            prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
        );
    };
    const toggleSelectAll = () => {
        if (isAllSelected) setSelected([]);
        else setSelected(pageRows.map((r) => r.id));
    };

    /* --------- ACTIONS ---------- */
    const toggleActive = (row) => {
        setPackages((prev) => prev.map((p) => (p.id === row.id ? { ...p, active: !p.active } : p)));
    };

    const deleteSelected = () => {
        if (selected.length === 0) return;
        setPackages((prev) => prev.filter((p) => !selected.includes(p.id)));
        setSelected([]);
    };

    /* --------- CREATE PACKAGE (Modal) ---------- */
    const [newPkg, setNewPkg] = useState({
        label: "3 Month",
        months: 3,
        rent: 5000,
        createDate: new Date().toISOString().slice(0, 10),
        active: true,
        // ไม่ต้องกำหนด color ที่นี่ ปล่อยให้ withColor ตัดสินใจจาก months/label
    });

    // map เปลี่ยน label -> months (และสีจะ derive ด้วย withColor ตอนบันทึก)
    const labelToPreset = {
        "3 Month": { months: 3 },
        "6 Month": { months: 6 },
        "9 Month": { months: 9 },
        "1 Year":  { months: 12 },
    };

    const addPackage = () => {
        const nextId = packages.length ? Math.max(...packages.map((p) => p.id)) + 1 : 1;
        const prepared = withColor({ ...newPkg, id: nextId });
        setPackages((prev) => [...prev, prepared]);

        closeModalSafely("createPackageModal");

        // (ออปชัน) reset ฟอร์ม
        // setNewPkg({
        //   label: "3 Month",
        //   months: 3,
        //   rent: 5000,
        //   createDate: new Date().toISOString().slice(0, 10),
        //   active: true,
        // });
    };

    const hasAnyFilter =
        filters.label !== "ALL" ||
        filters.active !== "ALL" ||
        filters.rentMin !== "" ||
        filters.rentMax !== "" ||
        !!filters.dateFrom ||
        !!filters.dateTo;

    const filterSummary = [];
    if (filters.label !== "ALL") filterSummary.push(`Package: ${filters.label}`);
    if (filters.active !== "ALL") filterSummary.push(`Status: ${filters.active === "TRUE" ? "Active" : "Inactive"}`);
    if (filters.rentMin !== "") filterSummary.push(`Rent ≥ ${filters.rentMin}`);
    if (filters.rentMax !== "") filterSummary.push(`Rent ≤ ${filters.rentMax}`);
    if (filters.dateFrom) filterSummary.push(`From ${filters.dateFrom}`);
    if (filters.dateTo) filterSummary.push(`To ${filters.dateTo}`);

    return (
        <Layout title="Package Management" icon="bi bi-sticky" notifications={0}>
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <div className="col-lg-11 p-4">
                        {/* Toolbar */}
                        <div className="toolbar-wrapper card border-0 bg-white">
                            <div className="card-header bg-white border-0 rounded-3">
                                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <button
                                            className="btn btn-link tm-link p-0"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#packageFilterCanvas"
                                        >
                                            <i className="bi bi-filter me-1"></i> Filter
                                            {hasAnyFilter && <span className="badge bg-primary ms-2">●</span>}
                                        </button>

                                        <button
                                            className="btn btn-link tm-link p-0"
                                            onClick={() => setSortAsc((s) => !s)}
                                        >
                                            <i className="bi bi-arrow-down-up me-1"></i>
                                            Sort
                                        </button>

                                        <div className="input-group tm-search">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="bi bi-search"></i>
                                            </span>

                                            <input
                                                type="text"
                                                className="form-control border-start-0"
                                                placeholder="Search package"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#createPackageModal"
                                        >
                                            <i className="bi bi-plus-lg me-1"></i> Create Package
                                        </button>
                                    </div>
                                </div>

                                <div className={`collapse ${hasAnyFilter ? "show" : ""}`}>
                                    <div className="pt-2 d-flex flex-wrap gap-2">
                                        {filterSummary.map((txt, idx) => (
                                            <span key={idx} className="badge bg-light text-dark border">
                        {txt}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-wrapper mt-3">
                            <table className="table text-nowrap">
                                <thead>
                                <tr>
                                    <th className="text-center header-color checkbox-cell">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleSelectAll}
                                            aria-label="Select all"
                                        />
                                    </th>
                                    <th className="text-start align-middle header-color">Package</th>
                                    <th className="text-start align-middle header-color">Rent</th>
                                    <th className="text-start align-middle header-color">Create date</th>
                                    <th className="text-center align-middle header-color">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageRows.length ? (
                                    pageRows.map((item) => (
                                        <tr key={item.id}>
                                            <td className="align-middle text-center checkbox-cell">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(item.id)}
                                                    onChange={() => toggleSelectRow(item.id)}
                                                    aria-label={`Select row ${item.id}`}
                                                />
                                            </td>

                                            <td className="align-middle">
                          <span
                              className="badge rounded-pill px-3 py-2"
                              style={{ backgroundColor: withColor(item).color }}
                          >
                            <i className="bi bi-circle-fill me-2"></i>
                              {item.label}
                          </span>
                                            </td>

                                            <td className="align-middle">
                                                {item.rent.toLocaleString()}
                                            </td>

                                            <td className="align-middle">{item.createDate}</td>

                                            <td className="align-middle text-center">
                                                <div className="form-check form-switch d-inline-flex">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={item.active}
                                                        onChange={() => toggleActive(item)}
                                                        aria-label={`Toggle ${item.label}`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No packages found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalRecords={totalRecords}
                            onPageSizeChange={setPageSize}
                        />
                    </div>
                </div>
            </div>

            {/* Create Package Modal */}
            <Modal id="createPackageModal" title="Create Package" icon="bi bi-sticky" size="modal-lg">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addPackage(); // บันทึกข้อมูลและปิด modal
                    }}
                >
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Label</label>
                            <select
                                className="form-select"
                                value={newPkg.label}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    const preset = labelToPreset[v];
                                    setNewPkg((p) => ({
                                        ...p,
                                        label: v,
                                        months: preset.months, // สีจะ derive ตอนบันทึก
                                    }));
                                }}
                                required
                            >
                                <option>3 Month</option>
                                <option>6 Month</option>
                                <option>9 Month</option>
                                <option>1 Year</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Rent</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newPkg.rent}
                                onChange={(e) => setNewPkg((p) => ({ ...p, rent: Number(e.target.value) }))}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Create date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={newPkg.createDate}
                                onChange={(e) => setNewPkg((p) => ({ ...p, createDate: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="col-md-6 d-flex align-items-end">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={newPkg.active}
                                    onChange={(e) => setNewPkg((p) => ({ ...p, active: e.target.checked }))}
                                    id="newPkgActive"
                                />
                                <label className="form-check-label ms-2" htmlFor="newPkgActive">
                                    Active
                                </label>
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-center gap-3 pt-3 pb-3">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Filters Offcanvas */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="packageFilterCanvas"
                aria-labelledby="packageFilterCanvasLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="packageFilterCanvasLabel" className="mb-0">
                        <i className="bi bi-filter me-2"></i>Filters
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">Package</label>
                            <select
                                className="form-select"
                                value={filters.label}
                                onChange={(e) => setFilters((f) => ({ ...f, label: e.target.value }))}
                            >
                                <option value="ALL">All</option>
                                <option value="3 Month">3 Month</option>
                                <option value="6 Month">6 Month</option>
                                <option value="9 Month">9 Month</option>
                                <option value="1 Year">1 Year</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={filters.active}
                                onChange={(e) => setFilters((f) => ({ ...f, active: e.target.value }))}
                            >
                                <option value="ALL">All</option>
                                <option value="TRUE">Active</option>
                                <option value="FALSE">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Rent min</label>
                            <input
                                type="number"
                                className="form-control"
                                value={filters.rentMin}
                                onChange={(e) => setFilters((f) => ({ ...f, rentMin: e.target.value }))}
                                placeholder="e.g. 4500"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Rent max</label>
                            <input
                                type="number"
                                className="form-control"
                                value={filters.rentMax}
                                onChange={(e) => setFilters((f) => ({ ...f, rentMax: e.target.value }))}
                                placeholder="e.g. 6000"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Create date from</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.dateFrom}
                                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Create date to</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.dateTo}
                                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                            />
                        </div>

                        <div className="col-12 d-flex justify-content-between mt-2">
                            <button className="btn btn-outline-secondary" onClick={clearFilters}>
                                Clear
                            </button>
                            <button className="btn btn-primary" data-bs-dismiss="offcanvas">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default PackageManagement;
