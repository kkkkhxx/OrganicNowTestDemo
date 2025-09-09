// src/pages/tenantmanagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import Modal from "../component/modal";
import Pagination from "../component/pagination";
import { pageSize as defaultPageSize, apiPath } from "../config_variable";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function TenantManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [data, setData] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalId, setNationalId] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  // ---------- helpers (สำหรับตาราง) ----------
  const formatDate = (v) => {
    if (!v) return "";
    try {
      const d = new Date(v);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return v;
    }
  };

  // map packageId -> label ชั่วคราว
  const packageLabel = (pkgId) => {
    const map = { 1: "1 Year", 2: "6 Month", 3: "3 Month" };
    return map[pkgId] || "-";
  };

  const fetchData = async (page = 1) => {
    try {
      const res = await axios.get(`${apiPath}/tenant/list`, {
        withCredentials: true,
        params: { page, pageSize },
      });

      if (Array.isArray(res.data)) {
        const rows = res.data;
        setData(rows);
        setTotalRecords(rows.length);
        setTotalPages(Math.max(1, Math.ceil(rows.length / pageSize)));
      } else if (res.data && Array.isArray(res.data.results)) {
        setData(res.data.results);
        const total = Number(res.data.totalRecords ?? res.data.results.length);
        setTotalRecords(total);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      } else {
        setData([]);
        setTotalRecords(0);
        setTotalPages(1);
      }

      setCurrentPage(page);
      setSelectedItems([]);
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setData([]);
      setTotalRecords(0);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

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

  const handleSaveCreate = async () => {
    try {
      if (checkValidation() === false) return false;

      const payload = {
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalId,
      };

      const res = await axios.post(`${apiPath}/tenant/create`, payload, {
        withCredentials: true,
      });

      if (res.status === 201) {
        document.getElementById("modalForm_btnClose")?.click();
        showMessageSave();
        fetchData(currentPage);
      } else {
        showMessageError("Unexpected response: " + JSON.stringify(res.data));
      }
    } catch (e) {
      if (e.response && e.response.status === 409) {
        if (e.response.data.message === "duplicate_email") {
          setAlertvalidation?.("Email already exists");
        } else if (e.response.data.message === "duplicate_national_id") {
          setAlertvalidation?.("National ID already exists");
        }
        return false;
      }
      if (e.response && e.response.status === 401) {
        showMessagePermission?.();
      } else {
        showMessageError(e);
      }
    }
  };

  const handleEdit = (item) => {
    setTenantId(item.tenantId);
    setFirstName(item.firstName || "");
    setLastName(item.lastName || "");
    setEmail(item.email || "");
    setPhoneNumber(item.phoneNumber || "");
    setNationalId(item.nationalId || "");
    setAlertvalidation?.("");
  };

  const handleSaveUpdate = async () => {
    try {
      if (!tenantId) {
        setAlertvalidation?.("Missing tenantId");
        return false;
      }
      if (checkValidation && checkValidation() === false) return false;

      const payload = { firstName, lastName, email, phoneNumber, nationalId };

      const res = await axios.put(`${apiPath}/tenant/update/${tenantId}`, payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        document.getElementById("modalForm_btnClose")?.click();
        showMessageSave?.();
        fetchData(currentPage);
      } else {
        showMessageError?.("Unexpected response: " + JSON.stringify(res.data));
      }
    } catch (e) {
      if (e.response && e.response.status === 409) {
        const msg = e.response.data?.message;
        if (msg === "duplicate_email") setAlertvalidation?.("Email already exists");
        else if (msg === "duplicate_national_id") setAlertvalidation?.("National ID already exists");
        else setAlertvalidation?.("Duplicate data");
        return false;
      }
      if (e.response && e.response.status === 401) {
        showMessagePermission?.();
      } else {
        showMessageError?.(e);
      }
    }
  };

  const handleDelete = async (tenantId) => {
    try {
      const res = await axios.delete(`${apiPath}/tenant/delete/${tenantId}`, {
        withCredentials: true,
      });

      if (res.status === 204) {
        showMessageSave?.();
        fetchData(currentPage);
      } else {
        showMessageError?.("Unexpected response: " + res.status);
      }
    } catch (e) {
      if (e.response && e.response.status === 401) {
        showMessagePermission?.();
      } else {
        showMessageError?.(e);
      }
    }
  };

  const handleSelectRow = (rowIndex) => {
    setSelectedItems((prev) =>
        prev.includes(rowIndex) ? prev.filter((i) => i !== rowIndex) : [...prev, rowIndex]
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

  const handleViewTenant = (tenant) => {
    navigate("/tenantdetail", {
      state: { tenant, fullName: `${tenant.firstName} ${tenant.lastName}` },
    });
  };

  // แจ้งเตือนพื้นฐาน
  const showMessageError = (msg) => alert("❌ Error: " + msg);
  const showMessageSave = () => alert("✅ Success!");

  return (
      <Layout title="Tenant Management" icon="bi bi-people" notifications={3}>
        <div className="container-fluid">
          <div className="row min-vh-100">
            {/* Main */}
            <div className="col-lg-11 p-4">
              {/* Toolbar Card */}
              <div className="toolbar-wrapper card border-0 bg-white">
                <div className="card-header bg-white border-0">
                  <div className="tm-toolbar d-flex justify-content-between align-items-center">
                    {/* Left cluster */}
                    <div className="d-flex align-items-center gap-3">
                      <button className="btn btn-link tm-link p-0">
                        <i className="bi bi-filter me-1"></i> Filter
                      </button>
                      <button className="btn btn-link tm-link p-0">
                        <i className="bi bi-arrow-down-up me-1"></i> Sort
                      </button>
                      <div className="input-group tm-search">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search"></i>
                      </span>
                        <input type="text" className="form-control border-start-0" placeholder="Search" />
                      </div>
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
                        <i className="bi bi-plus-lg me-1"></i> Create Tenant
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
                    <th className="text-start align-middle header-color">First name</th>
                    <th className="text-start align-middle header-color">Last name</th>
                    <th className="text-center align-middle header-color">Floor</th>
                    <th className="text-center align-middle header-color">Room</th>
                    <th className="text-start align-middle header-color">Package</th>
                    <th className="text-start align-middle header-color">Start date</th>
                    <th className="text-start align-middle header-color">End date</th>
                    <th className="text-start align-middle header-color">Phone Number</th>
                    <th className="text-center align-middle header-color">Action</th>
                  </tr>
                  </thead>

                  <tbody>
                  {data.length > 0 ? (
                      data
                          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                          .map((item, idx) => {
                            const rowKey = item.tenantId ?? item.id ?? `${item.firstName}-${item.room}-${idx}`;
                            return (
                                <tr key={rowKey}>
                                  <td className="align-middle text-center checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(idx)}
                                        onChange={() => handleSelectRow(idx)}
                                        aria-label={`Select row ${idx + 1}`}
                                    />
                                  </td>

                                  <td className="align-middle text-start">{item.firstName}</td>
                                  <td className="align-middle text-start">{item.lastName}</td>
                                  <td className="align-middle text-center">{item.floor ?? "-"}</td>
                                  <td className="align-middle text-center">{item.room ?? "-"}</td>

                                  <td className="align-middle text-start">
                              <span className="badge rounded-pill text-bg-primary px-3">
                                {item.packageName || packageLabel(item.packageId)}
                              </span>
                                  </td>

                                  <td className="align-middle text-start">{formatDate(item.startDate)}</td>
                                  <td className="align-middle text-start">{formatDate(item.endDate)}</td>
                                  <td className="align-middle text-start">{item.phoneNumber || "-"}</td>

                                  <td className="align-middle text-center">
                                    <button
                                        className="btn btn-sm form-Button-Edit me-1"
                                        onClick={() => handleViewTenant(item)}
                                        aria-label="View"
                                    >
                                      <i className="bi bi-eye-fill"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm form-Button-Edit me-1"
                                        onClick={() => handleEdit(item)}
                                        aria-label="Edit"
                                    >
                                      <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm form-Button-Del me-1"
                                        onClick={() => handleDelete(item.tenantId)}
                                        aria-label="Delete"
                                    >
                                      <i className="bi bi-trash-fill"></i>
                                    </button>
                                  </td>
                                </tr>
                            );
                          })
                  ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          Data Not Found
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

export default TenantManagement;