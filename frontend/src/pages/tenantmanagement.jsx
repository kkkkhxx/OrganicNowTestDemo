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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [signDate, setSignDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [rentAmountSnapshot, setRentAmountSnapshot] = useState(0);
  const [packageId, setPackageId] = useState("");
  const [startDate, setStartDate] = useState("");
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
        const res = await axios.get(`${apiPath}/packages`, {
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

  useEffect(() => {
    if (packageId) {
      const pkg = packages.find((p) => p.id === parseInt(packageId));
      if (pkg) {
        const price = pkg.price ?? 0;
        setRentAmountSnapshot(price);
        setDeposit(price);
      }
    }
  }, [packageId, packages]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${apiPath}/rooms`, {
          withCredentials: true,
        });
        console.log("Rooms API data:", res.data); 

        if (Array.isArray(res.data)) {
          setRooms(res.data);
        } else if (Array.isArray(res.data.result)) {
          setRooms(res.data.result); 
        } else {
          console.warn("Unexpected rooms API format:", res.data);
          setRooms([]);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      }
    };

    fetchRooms();
  }, []);

  const packageLabel = (pkgId) => {
    const pkg = packages.find((p) => p.id === pkgId);
    return pkg ? pkg.contract_name : "-";
  };

  const packageColor = (contractName) => {
    const map = {
      "3 เดือน": "#FFC73B", 
      "6 เดือน": "#EF98C4", 
      "9 เดือน": "#87C6FF", 
      "1 ปี": "#9691F9", 
    };
    return map[contractName] || "#D3D3D3"; 
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
      const payload = {
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalId,
        roomId: selectedRoomId,
        packageId,
        startDate: startDate ? `${startDate}T00:00:00` : null,
        endDate: endDate ? `${endDate}T23:59:59` : null,
        deposit,
        rentAmountSnapshot,
        signDate: new Date().toISOString(),
      };

      if (checkValidation(payload) === false) return false;

      const res = await axios.post(`${apiPath}/tenant/create`, payload, {
        withCredentials: true,
      });

      if (res.status === 200 || res.status === 201) {
        document.getElementById("modalForm_btnClose")?.click();

        fetchData(currentPage);

        showMessageSave();
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

  const checkValidation = (payload) => {
    if (!payload.firstName) {
      showMessageError("กรุณากรอก First Name");
      return false;
    }
    if (!payload.lastName) {
      showMessageError("กรุณากรอก Last Name");
      return false;
    }
    if (!payload.email) {
      showMessageError("กรุณากรอก Email");
      return false;
    }
    if (!payload.phoneNumber) {
      showMessageError("กรุณากรอก Phone Number");
      return false;
    }
    if (!payload.nationalId) {
      showMessageError("กรุณากรอก National ID");
      return false;
    }

    if (!payload.roomId) {
      showMessageError("กรุณาเลือกห้อง");
      return false;
    }

    if (!payload.packageId) {
      showMessageError("กรุณาเลือก Package");
      return false;
    }
    if (!payload.startDate) {
      showMessageError("กรุณาเลือก Start Date");
      return false;
    }
    if (!payload.signDate) {
      showMessageError("กรุณาเลือก Sign Date");
      return false;
    }

    return true;
  };

  const handleDelete = async (contractId) => {
    if (!contractId) {
      showMessageError("❌ contractId is missing");
      return;
    }

    try {
      const res = await axios.delete(`${apiPath}/tenant/delete/${contractId}`, {
        withCredentials: true,
      });

      if (res.status === 204) {
        showMessageSave?.("ลบข้อมูลสำเร็จ");
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

  const clearForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setSignDate(today);
    setStartDate("");
    setEndDate("");
    setDeposit("");
    setRentAmountSnapshot("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setNationalId("");
    setSelectedFloor(""); 
    setSelectedRoomId("");
    setPackageId("");
  };

  useEffect(() => {
    if (startDate && packageId) {
      const pkg = packages.find((p) => p.id === parseInt(packageId));
      if (pkg && pkg.duration) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + pkg.duration); 
        const yyyy = end.getFullYear();
        const mm = String(end.getMonth() + 1).padStart(2, "0");
        const dd = String(end.getDate()).padStart(2, "0");
        setEndDate(`${yyyy}-${mm}-${dd}`);
      }
    }
  }, [startDate, packageId, packages]);

  const handleViewTenant = (item) => {
    navigate(`/tenantdetail/${item.contractId}`);
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
                      onClick={clearForm}
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
                                color: "#fff",
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
                              // onClick={() => handleEdit(item)}
                              aria-label="Edit"
                            >
                              <i className="bi bi-file-earmark-pdf-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm form-Button-Del"
                              onClick={() => {
                                if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?")) {
                                  handleDelete(item.contractId);
                                }
                              }}
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
              {/* Floor Select */}
              <div className="col-md-6">
                <label className="form-label">Floor</label>
                <div className="position-relative">
                  <select
                    className="form-select"
                    value={selectedFloor}
                    onChange={(e) => {
                      setSelectedFloor(e.target.value);
                      setSelectedRoomId(""); 
                    }}
                  >
                    <option value="">Select Floor</option>
                    {[...new Set(rooms.map((r) => r.roomFloor))].map(
                      (floor) => (
                        <option key={floor} value={floor}>
                          {floor}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Room Select */}
              <div className="col-md-6">
                <label className="form-label">Room</label>
                <div className="position-relative">
                  <select
                    className="form-select"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    readOnly={!selectedFloor}
                  >
                    <option value="">
                      {selectedFloor ? "Select Room" : "Choose floor first"}
                    </option>
                    {rooms
                      .filter(
                        (r) => String(r.roomFloor) === String(selectedFloor)
                      )
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roomNumber}
                        </option>
                      ))}
                  </select>
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
                <label className="form-label">Rent Amount</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rent Amount"
                  value={rentAmountSnapshot}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sign date</label>
                <input
                  type="date"
                  className="form-control"
                  value={signDate}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Start date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">End date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Deposit</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Deposit"
                  value={deposit}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* ---------- Footer Buttons ---------- */}
          <div className="d-flex justify-content-center gap-3 pt-3 pb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              id="modalForm_btnClose"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
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
