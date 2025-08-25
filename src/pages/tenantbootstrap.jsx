import React, { useState } from "react";
import SideBar from "../component/sidebar";
import Layout from "../layouts/MainLayout";
import "../assets/css/tenantmanagement.css";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า Bootstrap

function TenantBootstrap() {
  const [data, setData] = useState([
    {
      order: 1,
      fullName: "John Doe",
      nickName: "Johnny",
      division: "Engineering",
      academicPosition: "Professor",
      status: "Active",
      changeStatus: <input type="checkbox" className="form-check-input" />,
      actions: (
        <>
          <button className="btn btn-sm form-Button-Edit me-1">
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button className="btn btn-sm form-Button-Del me-1">
            <i className="bi bi-trash-fill"></i>
          </button>
        </>
      ),
    },
    // เพิ่มข้อมูลตัวอย่างที่นี่
  ]);

  const handleToggleStatus = (item) => {
    console.log(item);
  };

  const handleUpdate = (item) => {
    console.log("Update: ", item);
  };

  const handleDelete = (item) => {
    console.log("Delete: ", item);
  };

  return (
    <Layout>
      <div className="container">
        <SideBar />
        <div className="mb-5 mt-5">
          <div className="card">
            <div className="card-body table-responsive p-0">
              {/* ใช้ Bootstrap table */}
              <table className="table table-bordered table-striped text-nowrap">
                <thead>
                  <tr>
                    <th className="text-center">Order</th>
                    <th>Full Name</th>
                    <th>Nick Name</th>
                    <th>Division</th>
                    <th>Academic Position</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, key) => (
                      <tr key={key}>
                        <td className="align-top text-center">{key + 1}</td>
                        <td className="align-top text-start">{item.fullName}</td>
                        <td className="align-top text-start">{item.nickName}</td>
                        <td className="align-top text-start">{item.division}</td>
                        <td className="align-top text-start">{item.academicPosition}</td>
                        <td className="align-top text-start">{item.status}</td>
                        <td className="align-top text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={item.status === "Active"}
                            onChange={() => handleToggleStatus(item)}
                          />
                        </td>
                        <td className="align-top text-center">
                          <button
                            className="btn btn-sm form-Button-Edit me-1"
                            onClick={() => handleUpdate(item)}
                          >
                            <i className="bi bi-pencil-fill"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm form-Button-Del me-1"
                            onClick={() => handleDelete(item)}
                          >
                            <i className="bi bi-trash-fill"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Data Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TenantBootstrap;
