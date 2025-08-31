import React, { useState } from "react";
import Layout from "../component/layout";
import Modal from "../component/modal";
import "../assets/css/tenantmanagement.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function TenantManagement() {
  /* -------------------- Data (ไม่เปลี่ยนข้อมูล) -------------------- */
  const [data, setData] = useState([
    {
      order: 1,
      firstName: "John Doe",
      lastName: "Doe",
      floor: "5th",
      room: "101",
      package: "Premium",
      startDate: "2022-01-01",
      phoneNumber: "123-456-7890",
    },
    {
      order: 2,
      firstName: "Jane Smith",
      lastName: "Smith",
      floor: "3rd",
      room: "205",
      package: "Standard",
      startDate: "2023-03-15",
      phoneNumber: "987-654-3210",
    },
    {
      order: 3,
      firstName: "Alice Johnson",
      lastName: "Johnson",
      floor: "7th",
      room: "707",
      package: "Premium",
      startDate: "2021-11-20",
      phoneNumber: "555-666-7777",
    },
  ]);

  /* -------------------- Selection State -------------------- */
  const [selectedItems, setSelectedItems] = useState([]); // เก็บ index ของแถวที่เลือก

  /* -------------------- Handlers -------------------- */
  const handleUpdate = (item) => {
    console.log("Update: ", item);
  };

  const handleDelete = (item) => {
    console.log("Delete: ", item);
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

  /* -------------------- Render -------------------- */
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
                  {/* Left cluster: Filter / Sort / Search */}
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

                  {/* Right cluster: Bulk delete / Create */}
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-light text-danger border-0">
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      // onClick={() => console.log("ปุ่ม Create Tenant ถูกคลิก")}
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
                    <th className="text-center align-middle header-color">
                      Order
                    </th>
                    <th className="text-center align-middle header-color">
                      First Name
                    </th>
                    <th className="text-center align-middle header-color">
                      Last Name
                    </th>
                    <th className="text-center align-middle header-color">
                      Floor
                    </th>
                    <th className="text-center align-middle header-color">
                      Room
                    </th>
                    <th className="text-center align-middle header-color">
                      Package
                    </th>
                    <th className="text-center align-middle header-color">
                      Start Date
                    </th>
                    <th className="text-center align-middle header-color">
                      Phone Number
                    </th>
                    <th className="text-center align-middle header-color">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((item, idx) => (
                      <tr key={idx}>
                        <td className="align-middle text-center checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(idx)}
                            onChange={() => handleSelectRow(idx)}
                            aria-label={`Select row ${idx + 1}`}
                          />
                        </td>

                        <td className="align-middle text-center">
                          {item.order}
                        </td>
                        <td className="align-middle text-center">
                          {item.firstName}
                        </td>
                        <td className="align-middle text-center">
                          {item.lastName}
                        </td>
                        <td className="align-middle text-center">
                          {item.floor}
                        </td>
                        <td className="align-middle text-center">
                          {item.room}
                        </td>
                        <td className="align-middle text-center">
                          {item.package}
                        </td>
                        <td className="align-middle text-center">
                          {item.startDate}
                        </td>
                        <td className="align-middle text-center">
                          {item.phoneNumber}
                        </td>

                        <td className="align-middle text-center">
                          <button
                            className="btn btn-sm form-Button-Edit me-1"
                            onClick={() => handleUpdate(item)}
                            aria-label="Edit row"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm form-Button-Del me-1"
                            onClick={() => handleDelete(item)}
                            aria-label="Delete row"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        Data Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* /Data Table */}
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
