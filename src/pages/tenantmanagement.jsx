import React from "react";
import SideBar from "../component/sidebar";
import Layout from "../layouts/MainLayout";
import "../assets/css/tenantmanagement.css";
import "primeicons/primeicons.css";

// PrimeReact imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function TenantManagement() {
  const tableHeaders = [
    "Order",
    "Full Name",
    "Nick Name",
    "Division",
    "Academic Position",
    "Status",
    "Change Status",
    "Actions",
  ];

  const data = [
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
    // Add more data objects here as necessary
  ];

  return (
    <Layout>
      <div className="container">
        <SideBar />
        <div className="mb-5 mt-5">
          <div className="card">
            <div className="card-body table-responsive p-0">
              {/* PrimeReact DataTable */}
              <DataTable
                value={data}
                className="table data-mouse table-head-fixed text-nowrap form-Table"
              >
                <Column
                  header={tableHeaders[0]}
                  body={(rowData, { rowIndex }) => rowIndex + 1}
                  className="text-center"
                />
                <Column header={tableHeaders[1]} field="fullName" />
                <Column header={tableHeaders[2]} field="nickName" />
                <Column header={tableHeaders[3]} field="division" />
                <Column header={tableHeaders[4]} field="academicPosition" />
                <Column header={tableHeaders[5]} field="status" />
                <Column
                  header={tableHeaders[6]}
                  body={(rowData) => (
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={rowData.status === "Active"}
                    />
                  )}
                />
                <Column
                  header={tableHeaders[7]}
                  body={(rowData) => (
                    <div className="text-center">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-sm p-button-rounded p-button-text form-Button-Edit me-1"
                        onClick={() => {
                          console.log("Edit button clicked");
                        }}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-sm p-button-rounded p-button-text form-Button-Del me-1"
                        onClick={() => {
                          console.log("Delete button clicked");
                        }}
                      />
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TenantManagement;
