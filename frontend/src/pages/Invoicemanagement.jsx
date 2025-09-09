import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import Pagination from "../component/pagination";
import { pageSize as defaultPageSize } from "../config_variable";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function InvoiceManagement() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(3);
    const [totalRecords, setTotalRecords] = useState(25);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchData(page);
        }
    };
    
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        fetchData(1);
        setCurrentPage(1);
    };

    const [data, setData] = useState([
        {
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
            penalty: 1,
            penaltyDate: null
        },
        {
            id: 2,
            createDate: "2025-01-31",
            firstName: "Sarah",
            lastName: "Smith",
            nationalId: "1-2345-67890-12-4",
            phoneNumber: "012-345-6780",
            email: "sarah@gmail.com",
            package: "1 Year",
            signDate: "2024-12-29",
            startDate: "2024-12-31",
            endDate: "2025-12-31",
            floor: "2",
            room: "205",
            amount: 5100,
            rent: 4500,
            water: 250,
            waterUnit: 5,
            electricity: 350,
            electricityUnit: 180,
            status: "Complete",
            payDate: "2025-02-01",
            penalty: 0,
            penaltyDate: null
        },
        {
            id: 3,
            createDate: "2025-01-31",
            firstName: "Mike",
            lastName: "Johnson",
            nationalId: "1-2345-67890-12-5",
            phoneNumber: "012-345-6781",
            email: "mike@gmail.com",
            package: "1 Year",
            signDate: "2024-12-28",
            startDate: "2024-12-31",
            endDate: "2025-12-31",
            floor: "3",
            room: "301",
            amount: 4800,
            rent: 4200,
            water: 300,
            waterUnit: 6,
            electricity: 300,
            electricityUnit: 150,
            status: "Complete",
            payDate: "2025-02-03",
            penalty: 0,
            penaltyDate: null
        },
        {
            id: 4,
            createDate: "2025-01-31",
            firstName: "Lisa",
            lastName: "Wilson",
            nationalId: "1-2345-67890-12-6",
            phoneNumber: "012-345-6782",
            email: "lisa@gmail.com",
            package: "1 Year",
            signDate: "2024-12-27",
            startDate: "2024-12-31",
            endDate: "2025-12-31",
            floor: "1",
            room: "102",
            amount: 4700,
            rent: 4000,
            water: 350,
            waterUnit: 7,
            electricity: 350,
            electricityUnit: 170,
            status: "Complete",
            payDate: "2025-02-01",
            penalty: 0,
            penaltyDate: null
        },
        {
            id: 5,
            createDate: "2025-01-31",
            firstName: "Tom",
            lastName: "Brown",
            nationalId: "1-2345-67890-12-7",
            phoneNumber: "012-345-6783",
            email: "tom@gmail.com",
            package: "1 Year",
            signDate: "2024-12-26",
            startDate: "2024-12-31",
            endDate: "2025-12-31",
            floor: "2",
            room: "206",
            amount: 5200,
            rent: 4500,
            water: 300,
            waterUnit: 6,
            electricity: 400,
            electricityUnit: 200,
            status: "Complete",
            payDate: "2025-01-31",
            penalty: 0,
            penaltyDate: null
        }
    ]);

    const [selectedItems, setSelectedItems] = useState([]);

    const handleUpdate = (item) => {
        console.log("Update: ", item);
    };

    const handleDelete = (item) => {
        console.log("Delete: ", item);
    };

    const handleViewInvoice = (invoice) => {
        navigate("/InvoiceDetails", {
            state: {
                invoice: invoice,
                invoiceId: invoice.id,
                tenantName: `${invoice.firstName} ${invoice.lastName}`
            }
        });
    };

    const handleSelectRow = (rowIndex) => {
        setSelectedItems((prev) =>
            prev.includes(rowIndex)
                ? prev.filter((i) => i !== rowIndex)
                : [...prev, rowIndex]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === data.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map((_, idx) => idx));
        }
    };

    const isAllSelected = data.length > 0 && selectedItems.length === data.length;

    // ===== INVOICE FORM STATE (สำหรับ Modal) =====
    const [invForm, setInvForm] = useState({
        floor: "",
        room: "",
        createDate: new Date().toISOString().slice(0, 10),

        waterUnit: "",
        elecUnit: "",
        waterRate: 30,   // ค่าเริ่มต้น: น้ำ 30 บาท/หน่วย (แก้ได้)
        elecRate: 8,     // ค่าเริ่มต้น: ไฟ 8 บาท/หน่วย (แก้ได้)

        rent: "",
        status: "Incomplete",

        waterBill: 0,    // auto
        elecBill: 0,     // auto
        net: 0,          // auto
    });

// ===== คำนวณอัตโนมัติเมื่อ unit / rate / rent เปลี่ยน =====
    React.useEffect(() => {
        const wUnit = Number(invForm.waterUnit) || 0;
        const eUnit = Number(invForm.elecUnit) || 0;
        const wRate = Number(invForm.waterRate) || 0;
        const eRate = Number(invForm.elecRate) || 0;
        const rent  = Number(invForm.rent) || 0;

        const waterBill = wUnit * wRate;
        const elecBill  = eUnit * eRate;
        const net = rent + waterBill + elecBill;

        setInvForm((p) => ({ ...p, waterBill, elecBill, net }));
    }, [invForm.waterUnit, invForm.elecUnit, invForm.waterRate, invForm.elecRate, invForm.rent]);

    // ====== FILTER & SEARCH STATE ======
    const [filters, setFilters] = useState({
        status: "ALL",
        payFrom: "",
        payTo: "",
        floor: "",
        room: "",
        amountMin: "",
        amountMax: "",
    });
    const clearFilters = () =>
        setFilters({ status: "ALL", payFrom: "", payTo: "", floor: "", room: "", amountMin: "", amountMax: "" });

    const [search, setSearch] = useState("");

    // ====== FILTERED VIEW ======
    const filtered = React.useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = [...data];

        rows = rows.filter((r) => {
            if (filters.status !== "ALL" && r.status !== filters.status) return false;
            if (filters.payFrom && r.payDate && r.payDate < filters.payFrom) return false;
            if (filters.payTo && r.payDate && r.payDate > filters.payTo) return false;
            if (filters.floor && String(r.floor) !== String(filters.floor)) return false;
            if (filters.room && String(r.room) !== String(filters.room)) return false;
            if (filters.amountMin !== "" && r.amount < Number(filters.amountMin)) return false;
            if (filters.amountMax !== "" && r.amount > Number(filters.amountMax)) return false;
            return true;
        });

        if (q) {
            rows = rows.filter((r) =>
                `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
                String(r.room).includes(q) ||
                String(r.floor).includes(q) ||
                r.createDate.includes(q) ||
                r.status.toLowerCase().includes(q)
            );
        }

        return rows;
    }, [data, filters, search]);

    return (
        <Layout title="Invoice Management" icon="bi bi-currency-dollar" notifications={3}>
            <div className="container-fluid">
                <div className="row min-vh-100">
                    {/* Main */}
                    <div className="col-lg-11 p-4">
                        {/* Toolbar Card */}
                        <div className="toolbar-wrapper card border-0 bg-white">
                            <div className="card-header bg-white border-0 rounded-3">
                                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                                    {/* Left cluster: Filter / Sort / Search */}
                                    <div className="d-flex align-items-center gap-3">
                                        <button className="btn btn-link tm-link p-0" data-bs-toggle="offcanvas" data-bs-target="#invoiceFilterCanvas">
                                        <i className="bi bi-filter me-1"></i> Filter
                                        </button>

                                        <button className="btn btn-link tm-link p-0">
                                            <i className="bi bi-arrow-down-up me-1"></i> Sort
                                        </button>

                                        <div className="input-group tm-search">
                                            <span className="input-group-text bg-white border-end-0">
                                                <i className="bi bi-search"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0"
                                                placeholder="Search invoices..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Right cluster: Bulk delete / Create */}
                                    <div className="d-flex align-items-center gap-2">
                                        <button className="btn btn-outline-light text-danger border-0">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#createInvoiceModal"
                                        >
                                            <i className="bi bi-plus-lg me-1"></i> Create Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="table-wrapper">
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
                                        <th className="text-center align-middle header-color">Create date</th>
                                        <th className="text-start align-middle header-color">First Name</th>
                                        <th className="text-start align-middle header-color">Floor</th>
                                        <th className="text-start align-middle header-color">Room</th>
                                        <th className="text-start align-middle header-color">Amount</th>
                                        <th className="text-start align-middle header-color">Rent</th>
                                        <th className="text-start align-middle header-color">Water</th>
                                        <th className="text-start align-middle header-color">Electricity</th>
                                        <th className="text-start align-middle header-color">Status</th>
                                        <th className="text-start align-middle header-color">Pay date</th>
                                        <th className="text-start align-middle header-color">Penalty</th>
                                        <th className="text-center align-middle header-color">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.length > 0 ? (
                                        filtered.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="align-middle text-center checkbox-cell">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(idx)}
                                                        onChange={() => handleSelectRow(idx)}
                                                        aria-label={`Select row ${idx + 1}`}
                                                    />
                                                </td>
                                                <td className="align-middle text-center">{item.createDate}</td>
                                                <td className="align-middle text-start">{item.firstName}</td>
                                                <td className="align-middle text-start">{item.floor}</td>
                                                <td className="align-middle text-start">{item.room}</td>
                                                <td className="align-middle text-start">{item.amount.toLocaleString()}</td>
                                                <td className="align-middle text-start">{item.rent.toLocaleString()}</td>
                                                <td className="align-middle text-start">{item.water.toLocaleString()}</td>
                                                <td className="align-middle text-start">{item.electricity.toLocaleString()}</td>
                                                <td className="align-middle text-start">
                                                    <span className="badge bg-success">
                                                        <i className="bi bi-circle-fill me-1"></i>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="align-middle text-start">{item.payDate}</td>
                                                <td className="align-middle text-center">
                                                    <i className={`bi bi-circle-fill ${
                                                        item.penalty > 0 ? 'text-danger' : 'text-secondary'
                                                    }`}></i>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <button
                                                        className="btn btn-sm form-Button-Edit me-1"
                                                        onClick={() => handleViewInvoice(item)}
                                                        aria-label="View invoice"
                                                    >
                                                        <i className="bi bi-eye-fill"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm form-Button-Edit me-1"
                                                        onClick={() => handleUpdate(item)}
                                                        aria-label="Download PDF"
                                                    >
                                                        <i className="bi bi-file-earmark-pdf-fill"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm form-Button-Del me-1"
                                                        onClick={() => handleDelete(item)}
                                                        aria-label="Delete invoice"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="13" className="text-center">
                                                No invoices found
                                            </td>
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
                </div>
            </div>

            <Modal
                id="createInvoiceModal"
                title="Invoice add"
                icon="bi bi-receipt-cutoff"
                size="modal-lg"
                scrollable="modal-dialog-scrollable"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: push invForm ไปยัง data ถ้าต้องการบันทึกจริง
                        const el = document.getElementById("createInvoiceModal");
                        const modal = window.bootstrap?.Modal.getOrCreateInstance(el);
                        modal?.hide();
                    }}
                >
                    {/* ===== Room Information ===== */}
                    <div className="row g-3 align-items-start">
                        <div className="col-md-3">
                            <strong>Room Information</strong>
                        </div>

                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Floor</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select"
                                            value={invForm.floor}
                                            onChange={(e) => setInvForm((p) => ({ ...p, floor: e.target.value }))}
                                        >
                                            <option value="" hidden>Select Floor</option>
                                            <option>1</option><option>2</option><option>3</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Room</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select"
                                            value={invForm.room}
                                            onChange={(e) => setInvForm((p) => ({ ...p, room: e.target.value }))}
                                        >
                                            <option value="" hidden>Select Room</option>
                                            <option>101</option><option>205</option><option>301</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* ===== Invoice Information ===== */}
                    <div className="row g-3 align-items-start">
                        <div className="col-md-3">
                            <strong>Invoice Information</strong>
                        </div>

                        <div className="col-md-9">
                            <div className="row g-3">
                                {/* แถว 1: Create date + Rent */}
                                <div className="col-md-6">
                                    <label className="form-label">Create date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={invForm.createDate}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rent</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Rent"
                                        min={0}
                                        value={invForm.rent}
                                        onChange={(e) => setInvForm((p) => ({ ...p, rent: e.target.value }))}
                                    />
                                </div>

                                {/* แถว 2: Water */}
                                <div className="col-md-6">
                                    <label className="form-label">Water unit</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Add Water unit"
                                        min={0}
                                        value={invForm.waterUnit}
                                        onChange={(e) => setInvForm((p) => ({ ...p, waterUnit: e.target.value }))}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Water bill</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invForm.waterBill.toLocaleString()}
                                        disabled
                                    />
                                </div>

                                {/* แถว 3: Electricity */}
                                <div className="col-md-6">
                                    <label className="form-label">Electricity unit</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Add Electricity unit"
                                        min={0}
                                        value={invForm.elecUnit}
                                        onChange={(e) => setInvForm((p) => ({ ...p, elecUnit: e.target.value }))}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Electricity bill</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invForm.elecBill.toLocaleString()}
                                        disabled
                                    />
                                </div>

                                {/* แถว 4: NET + Status */}
                                <div className="col-md-6">
                                    <label className="form-label">NET</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invForm.net.toLocaleString()}
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={invForm.status}
                                        onChange={(e) => setInvForm((p) => ({ ...p, status: e.target.value }))}
                                    >
                                        <option>Incomplete</option>
                                        <option>Complete</option>
                                        <option>Pending</option>
                                        <option>Overdue</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Footer buttons ===== */}
                    <div className="d-flex justify-content-center gap-3 pt-4 pb-2">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="invoiceFilterCanvas"
                aria-labelledby="invoiceFilterCanvasLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="invoiceFilterCanvasLabel" className="mb-0">
                        <i className="bi bi-filter me-2"></i>Filters
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                            >
                                <option value="ALL">All</option>
                                <option value="Complete">Complete</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Pay date from</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.payFrom}
                                onChange={(e) => setFilters((f) => ({ ...f, payFrom: e.target.value }))}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Pay date to</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.payTo}
                                onChange={(e) => setFilters((f) => ({ ...f, payTo: e.target.value }))}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Floor</label>
                            <input
                                type="text"
                                className="form-control"
                                value={filters.floor}
                                onChange={(e) => setFilters((f) => ({ ...f, floor: e.target.value }))}
                                placeholder="e.g. 2"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Room</label>
                            <input
                                type="text"
                                className="form-control"
                                value={filters.room}
                                onChange={(e) => setFilters((f) => ({ ...f, room: e.target.value }))}
                                placeholder="e.g. 205"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Amount min</label>
                            <input
                                type="number"
                                className="form-control"
                                value={filters.amountMin}
                                onChange={(e) => setFilters((f) => ({ ...f, amountMin: e.target.value }))}
                                placeholder="e.g. 4000"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Amount max</label>
                            <input
                                type="number"
                                className="form-control"
                                value={filters.amountMax}
                                onChange={(e) => setFilters((f) => ({ ...f, amountMax: e.target.value }))}
                                placeholder="e.g. 6000"
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

export default InvoiceManagement;