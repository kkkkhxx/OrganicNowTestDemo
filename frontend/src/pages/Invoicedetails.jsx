import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap";

function InvoiceDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoice, invoiceId, tenantName } = location.state || {};

    // วางไว้บนสุดของไฟล์ (นอก component ก็ได้)
    const todayISO = () => new Date().toISOString().slice(0, 10);

    // ===== Mock (fallback) =====
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
        // ค่าที่โชว์บนหน้าหลัก (bill/amount จะถูกคำนวณใหม่จาก unit และ rent เสมอ)
        amount: 5356,
        rent: 4000,
        water: 120,
        waterUnit: 4,
        electricity: 1236,
        electricityUnit: 206,
        status: "pending",
        payDate: "",
        penalty: 0,
        penaltyDate: null,
    };

    const initial = invoice || defaultInvoice;
    const displayName = tenantName || `${initial.firstName} ${initial.lastName}`;

    // ===== Config อัตราค่าน้ำ/ไฟ (คุณสามารถย้ายไป .env หรือ DB ได้) =====
    // TODO(DB): โหลด rate เหล่านี้จาก API/DB ถ้าต้องการให้เปลี่ยนได้แบบ dynamic
    const RATE_WATER_PER_UNIT = 30;       // ตัวอย่าง: 30 บาท/หน่วย
    const RATE_ELEC_PER_UNIT = 6.5;       // ตัวอย่าง: 6.5 บาท/หน่วย
    const SERVICE_FEE = 0;                // ค่าบริการคงที่ (ถ้ามี)
    const ROUND_TO = 2;                   // ปัดทศนิยม 2 ตำแหน่ง

    const [invoiceForm, setInvoiceForm] = useState({
        id: initial.id,
        createDate: initial.createDate,
        floor: initial.floor || "",
        room: initial.room || "",
        rent: Number(initial.rent) || 0,
        waterUnit: Number(initial.waterUnit) || 0,
        electricityUnit: Number(initial.electricityUnit) || 0,
        // ฟิลด์ที่คำนวณอัตโนมัติ
        water: Number(initial.water) || 0,
        electricity: Number(initial.electricity) || 0,
        amount: Number(initial.amount) || 0,
        status: initial.status || "pending",
        penalty: Number(initial.penalty) || 0,
        penaltyDate: initial.penaltyDate || null,
        payDate: initial.payDate || null,
    });

    // ===== ฟังก์ชันช่วย =====
    const toNumber = (v) => {
        const n = Number(v);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    };
    const round = (v, d = ROUND_TO) => Number(Math.round((v + Number.EPSILON) * 10 ** d) / 10 ** d);

    const parseISO = (s) => (s ? new Date(s + "T00:00:00") : null);

    const diffDays = (fromISO, toISO) => {
        const a = parseISO(fromISO);
        const b = parseISO(toISO);
        if (!a || !b) return null;
        const ms = b.getTime() - a.getTime();
        return Math.floor(ms / (1000 * 60 * 60 * 24));
    };

    // คำนวณ bill และ net แบบ derived ทุกครั้งที่ unit/rent/penalty เปลี่ยน
    useEffect(() => {
        const waterBill = round(toNumber(invoiceForm.waterUnit) * RATE_WATER_PER_UNIT);
        const elecBill  = round(toNumber(invoiceForm.electricityUnit) * RATE_ELEC_PER_UNIT);
        const rent      = toNumber(invoiceForm.rent);

        const subtotal  = round(rent + waterBill + elecBill + SERVICE_FEE); // ยังไม่รวมปรับ

        // ✅ ใช้ payDate เทียบกับ createDate
        const days = diffDays(invoiceForm.createDate, invoiceForm.payDate);
        const within15 = (days !== null && days <= 15); // จ่ายใน 15 วัน

        let net, penalty;
        if (within15) {
            // ไม่โดนปรับ
            penalty = 0;
            net = subtotal;
        } else {
            // เกิน 15 วัน (หรือยังไม่มี payDate) → โดนปรับ 10% ของ NET
            net = subtotal === 0 ? 0 : round(subtotal / 0.9);
            penalty = round(net - subtotal);
        }

        setInvoiceForm((p) => ({
            ...p,
            water: waterBill,
            electricity: elecBill,
            penalty,
            amount: net,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceForm.waterUnit, invoiceForm.electricityUnit, invoiceForm.rent, invoiceForm.payDate, invoiceForm.createDate]);

    //============= cleanupBackdrops =============//
    const cleanupBackdrops = () => {
        // ล้าง backdrop ที่ค้าง
        document.querySelectorAll(".modal-backdrop").forEach((n) => n.remove());
        // ล้าง state ของ body
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("paddingRight");
    };

    //============= handleSave =============//
    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            id: invoiceForm.id,
            createDate: invoiceForm.createDate,
            floor: invoiceForm.floor,
            room: invoiceForm.room,
            rent: toNumber(invoiceForm.rent),
            waterUnit: toNumber(invoiceForm.waterUnit),
            electricityUnit: toNumber(invoiceForm.electricityUnit),
            water: toNumber(invoiceForm.water),
            electricity: toNumber(invoiceForm.electricity),
            amount: toNumber(invoiceForm.amount),
            status: invoiceForm.status,
            penalty: toNumber(invoiceForm.penalty),
            penaltyDate: invoiceForm.penaltyDate,
            payDate: initial.payDate || null,
        };

        try {
            console.log("Updated Invoice (ready to send):", payload);
            // TODO(DB): await axios.put(`/api/invoices/${payload.id}`, payload);

            const el = document.getElementById("editRequestModal");
            if (el) {
                // ❗️ใช้ instance เดิมเท่านั้น
                const inst = bootstrap.Modal.getInstance(el);
                if (inst) {
                    // รอให้งาน cleanup ของ Bootstrap ทำเสร็จ
                    el.addEventListener(
                        "hidden.bs.modal",
                        () => {
                            try {
                                inst.dispose();
                            } finally {
                                cleanupBackdrops(); // fallback กันไว้
                            }
                        },
                        { once: true }
                    );
                    inst.hide();
                } else {
                    // กรณีไม่มี instance (ไม่ควรเกิดถ้าใช้ data-bs-toggle)
                    // สร้างชั่วคราว → hide → dispose → cleanup
                    const temp = new bootstrap.Modal(el);
                    el.addEventListener(
                        "hidden.bs.modal",
                        () => {
                            try {
                                temp.dispose();
                            } finally {
                                cleanupBackdrops();
                            }
                        },
                        { once: true }
                    );
                    temp.hide();
                }
            } else {
                // ไม่มี modal element ก็ล้าง backdrop กันไว้
                cleanupBackdrops();
            }
        } catch (err) {
            console.error("Save failed:", err);
            // แสดง toast/error ได้ตามต้องการ
        }
    };

    // ===== Status style helper =====
    const statusBadge = useMemo(() => {
        const s = (invoiceForm.status || "").toLowerCase();
        if (s === "complete") return "bg-success";
        if (s === "overdue") return "bg-danger";
        if (s === "pending") return "bg-warning text-dark";
        return "bg-secondary";
    }, [invoiceForm.status]);

    const handleStatusChange = (value) => {
        const v = String(value).toLowerCase(); // 'incomplete' | 'complete' | 'pending' | 'overdue'
        setInvoiceForm((p) => ({
            ...p,
            status: v,
            // ถ้าเปลี่ยนเป็น complete ให้ตั้ง payDate เป็นวันนี้ทุกครั้ง
            // ถ้าไม่ใช่ complete ให้ล้าง payDate
            payDate: v === "complete" ? todayISO() : null,
        }));
    };

    return (
        <Layout title="Invoice Management" icon="bi bi-currency-dollar" notifications={3}>
            <div className="container-fluid">
                <div className="row min-vh-100">
                    <div className="col-lg-11 p-4">
                        {/* Toolbar */}
                        <div className="toolbar-wrapper card border-0 bg-white">
                            <div className="card-header bg-white border-0 rounded-2">
                                <div className="tm-toolbar d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-2">
                    <span
                        className="breadcrumb-link text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/invoicemanagement")}
                    >
                      Invoice Management
                    </span>
                                        <span className="text-muted">›</span>
                                        <span className="breadcrumb-current">
                      {tenantName || `${initial.firstName} ${initial.lastName}`}
                    </span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editRequestModal"
                                        >
                                            <i className="bi bi-pencil me-1"></i> Edit Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="table-wrapper-detail rounded-0">
                            <div className="row g-4">
                                {/* Left column */}
                                <div className="col-lg-6">
                                    <div className="card border-0 shadow-sm mb-3 rounded-2">
                                        <div className="card-body">
                                            <h5 className="card-title">Room Information</h5>
                                            <p><span className="label">Floor:</span> <span className="value">{invoiceForm.floor}</span></p>
                                            <p><span className="label">Room:</span> <span className="value">{invoiceForm.room}</span></p>
                                        </div>
                                    </div>

                                    <div className="card border-0 shadow-sm rounded-2">
                                        <div className="card-body">
                                            <h5 className="card-title">Tenant Information</h5>
                                            <p><span className="label">First Name:</span> <span className="value">{initial.firstName}</span></p>
                                            <p><span className="label">Last Name:</span> <span className="value">{initial.lastName}</span></p>
                                            <p><span className="label">National ID:</span> <span className="value">{initial.nationalId}</span></p>
                                            <p><span className="label">Phone Number:</span> <span className="value">{initial.phoneNumber}</span></p>
                                            <p><span className="label">Email:</span> <span className="value">{initial.email}</span></p>
                                            <p>
                                                <span className="label">Package:</span>
                                                <span className="value"><span className="package-badge badge bg-primary">{initial.package}</span></span>
                                            </p>
                                            <p><span className="label">Sign date:</span> <span className="value">{initial.signDate}</span></p>
                                            <p><span className="label">Start date:</span> <span className="value">{initial.startDate}</span></p>
                                            <p><span className="label">End date:</span> <span className="value">{initial.endDate}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="col-lg-6">
                                    <div className="card border-0 shadow-sm mb-3 rounded-2">
                                        <div className="card-body">
                                            <h5 className="card-title">Invoice Information</h5>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p><span className="label">Create date:</span> <span className="value">{invoiceForm.createDate}</span></p>
                                                    <p><span className="label">Water unit:</span> <span className="value">{invoiceForm.waterUnit}</span></p>
                                                    <p><span className="label">Electricity unit:</span> <span className="value">{invoiceForm.electricityUnit}</span></p>
                                                    <p><span className="label">NET:</span> <span className="value">{invoiceForm.amount.toLocaleString()}</span></p>
                                                    <p><span className="label">Pay date:</span> <span className="value">{invoiceForm.payDate || "-"}</span></p>
                                                </div>
                                                <div className="col-6">
                                                    <p><span className="label">Rent:</span> <span className="value">{invoiceForm.rent.toLocaleString()}</span></p>
                                                    <p><span className="label">Water bill:</span> <span className="value">{invoiceForm.water.toLocaleString()}</span></p>
                                                    <p><span className="label">Electricity bill:</span> <span className="value">{invoiceForm.electricity.toLocaleString()}</span></p>
                                                    <p>
                                                        <span className="label">Status:</span>{" "}
                                                        <span className="value">
                                                            <span className={`badge ${statusBadge}`}>
                                                                <i className="bi bi-circle-fill me-1"></i>{invoiceForm.status}
                                                            </span>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card border-0 shadow-sm rounded-2">
                                        <div className="card-body">
                                            <h5 className="card-title">Penalty Information</h5>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p><span className="label">Penalty:</span> <span className="value">{invoiceForm.penalty > 0 ? invoiceForm.penalty.toLocaleString() : "-"}</span></p>
                                                </div>
                                                <div className="col-6">
                                                    <p><span className="label">Penalty date:</span> <span className="value">{invoiceForm.penaltyDate || "-"}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Right */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Modal Edit (คำนวณอัตโนมัติ) ===== */}
            <Modal
                id="editRequestModal"
                title="Edit Invoice"
                icon="bi bi-pencil"
                size="modal-lg"
                scrollable="modal-dialog-scrollable"
            >
                <form onSubmit={handleSave}>
                    {/* Room */}
                    <div className="row g-3 align-items-start">
                        <div className="col-md-3"><strong>Room Information</strong></div>
                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Floor</label>
                                    <select
                                        className="form-select"
                                        value={invoiceForm.floor}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, floor: e.target.value }))}
                                        disabled   // 🔒 ห้ามแก้ใน modal
                                        title="Floor is locked in edit modal"
                                    >
                                        <option value="" hidden>Select Floor</option>
                                        <option>1</option><option>2</option><option>3</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Room</label>
                                    <select
                                        className="form-select"
                                        value={invoiceForm.room}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, room: e.target.value }))}
                                        disabled   // 🔒 ห้ามแก้ใน modal
                                        title="Room is locked in edit modal"
                                    >
                                        <option value="" hidden>Select Room</option>
                                        <option>101</option><option>205</option><option>301</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* Invoice */}
                    <div className="row g-3 align-items-start">
                        <div className="col-md-3"><strong>Invoice Information</strong></div>
                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Create date</label>
                                    <input type="date" className="form-control" value={invoiceForm.createDate} disabled />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rent</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="form-control"
                                        value={invoiceForm.rent}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, rent: toNumber(e.target.value) }))}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Water unit</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="form-control"
                                        value={invoiceForm.waterUnit}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, waterUnit: toNumber(e.target.value) }))}
                                    />
                                    <div className="form-text">
                                        Rate: {RATE_WATER_PER_UNIT.toLocaleString()} / unit
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Water bill</label>
                                    <input type="text" className="form-control" value={invoiceForm.water.toLocaleString()} disabled />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Electricity unit</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="form-control"
                                        value={invoiceForm.electricityUnit}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, electricityUnit: toNumber(e.target.value) }))}
                                    />
                                    <div className="form-text">
                                        Rate: {RATE_ELEC_PER_UNIT.toLocaleString()} / unit
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Electricity bill</label>
                                    <input type="text" className="form-control" value={invoiceForm.electricity.toLocaleString()} disabled />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">NET</label>
                                    <input type="text" className="form-control" value={invoiceForm.amount.toLocaleString()} disabled />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={invoiceForm.status}                 // 'complete' | 'pending' | 'overdue'
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                    >
                                        <option value="complete">Complete</option>
                                        <option value="pending">Pending</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Pay date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={invoiceForm.payDate || ""}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, payDate: e.target.value || null }))}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* Penalty Information */}
                    <div className="row g-3 align-items-start">
                        <div className="col-md-3"><strong>Penalty Information</strong></div>
                        <div className="col-md-9">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Penalty (auto, 10% of NET)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={invoiceForm.penalty.toLocaleString()}
                                        disabled
                                    />
                                    {/*<div className="form-text">
                                        คำนวณจากสมการ: NET = Subtotal / 0.9 → Penalty = NET - Subtotal
                                    </div>*/}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Penalty date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={invoiceForm.penaltyDate || ""}
                                        onChange={(e) => setInvoiceForm((p) => ({ ...p, penaltyDate: e.target.value || null }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Footer */}
                    <div className="d-flex justify-content-center gap-3 pt-4 pb-2">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}

export default InvoiceDetails;
