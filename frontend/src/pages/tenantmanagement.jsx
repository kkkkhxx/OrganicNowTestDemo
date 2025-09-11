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

    // ===== New states for modal form =====
    const [packageId, setPackageId] = useState("");
    const [startDate, setStartDate] = useState("");

// Floor / Room (dependent selects)
    const [rooms, setRooms] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState("");

    const navigate = useNavigate();

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

  const [packages, setPackages] = useState([]);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get("http://localhost:8080/packages", {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };

    fetchPackages();
  }, []);

  const packageLabel = (pkgId) => {
    const pkg = packages.find((p) => p.id === pkgId);
    return pkg ? pkg.contract_name : "-";
  };

  const packageColor = (contractName) => {
    const map = {
      "3 เดือน": "#FFC73B", // น้ำเงิน
      "6 เดือน": "#EF98C4", // เขียว
      "9 เดือน": "#87C6FF", // เหลือง
      "1 ปี": "#9691F9", // แดง
    };
    return map[contractName] || "#D3D3D3"; // default เทา
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
    } catch (err) {
      console.error("Error fetching tenants:", err);
      setData([]);
      setTotalRecords(0);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

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

      const res = await axios.put(
        `${apiPath}/tenant/update/${tenantId}`,
        payload,
        {
          withCredentials: true,
        }
      );

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
        if (msg === "duplicate_email")
          setAlertvalidation?.("Email already exists");
        else if (msg === "duplicate_national_id")
          setAlertvalidation?.("National ID already exists");
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

  const handleViewTenant = (tenant) => {
    navigate("/tenantdetail", {
      state: { tenant, fullName: `${tenant.firstName} ${tenant.lastName}` },
    });
  };

  const showMessageError = (msg) => alert("❌ Error: " + msg);
  const showMessageSave = () => alert("✅ Success!");

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
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search"
                      />
                    </div>
                  </div>

                  {/* Right cluster */}
                  <div className="d-flex align-items-center gap-2">
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
                    <th className="text-center align-top header-color">
                      Order
                    </th>
                    <th className="align-top header-color">First name</th>
                    <th className="text-start align-top header-color">
                      Last name
                    </th>
                    <th className="text-center align-top header-color">
                      Floor
                    </th>
                    <th className="text-center align-top header-color">Room</th>
                    <th className="text-start align-top header-color">
                      Package
                    </th>
                    <th className="text-start align-top header-color">
                      Start date
                    </th>
                    <th className="text-start align-top header-color">
                      End date
                    </th>
                    <th className="text-start align-top header-color">
                      Phone Number
                    </th>
                    <th className="text-center align-top header-color">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.slice(startIndex, endIndex).map((item, idxInPage) => {
                      const globalIndex = startIndex + idxInPage;
                      const order = globalIndex + 1;
                      const rowKey =
                        item.tenantId ??
                        item.id ??
                        `${item.firstName}-${item.room}-${globalIndex}`;

                      return (
                        <tr key={rowKey}>
                          {/* Order */}
                          <td className="align-top text-center">{order}</td>
                          <td className="align-top text-center">
                            {item.firstName}
                          </td>
                          <td className="align-top text-start">
                            {item.lastName}
                          </td>
                          <td className="align-top text-center">
                            {item.floor ?? "-"}
                          </td>
                          <td className="align-top text-center">
                            {item.room ?? "-"}
                          </td>

                          <td className="align-top text-start">
                            <span
                              className="badge rounded-pill px-3"
                              style={{
                                backgroundColor: packageColor(
                                  packageLabel(item.packageId)
                                ),
                                color: "#fff", // ✅ ตัวหนังสือขาว
                              }}
                            >
                              {packageLabel(item.packageId)}
                            </span>
                          </td>

                          <td className="align-top text-start">
                            {formatDate(item.startDate)}
                          </td>
                          <td className="align-top text-start">
                            {formatDate(item.endDate)}
                          </td>
                          <td className="align-top text-start">
                            {item.phoneNumber || "-"}
                          </td>

                          <td className="align-top text-center">
                            <button
                              className="btn btn-sm form-Button-Edit"
                              onClick={() => handleViewTenant(item)}
                              aria-label="View"
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm form-Button-Edit"
                              onClick={() => handleEdit(item)}
                              aria-label="Edit"
                            >
                              <i className="bi bi-file-earmark-pdf-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm form-Button-Del"
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
                                <select className="form-select">
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
                                <select className="form-select">
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
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
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

export default TenantManagement;
