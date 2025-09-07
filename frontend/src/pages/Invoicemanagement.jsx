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

    return (
        <Layout title="Invoice Management" icon="bi bi-currency-dollar" notifications={3}>
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
                                                placeholder="Search invoices..."
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
                                                <td className="align-middle text-center">{item.createDate}</td>
                                                <td className="align-middle text-start">{item.firstName}</td>
                                                <td className="align-middle text-start">{item.floor}</td>
                                                <td className="align-middle text-start">{item.room}</td>
                                                <td className="align-middle text-start">    {item.amount.toLocaleString()}</td>
                                                <td className="align-middle text-start">    {item.rent.toLocaleString()}</td>
                                                <td className="align-middle text-start">    {item.water.toLocaleString()}</td>
                                                <td className="align-middle text-start">    {item.electricity.toLocaleString()}</td>
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
                title="Create Invoice"
                icon="bi bi-receipt-cutoff"
                size="modal-lg"
                scrollable="modal-dialog-scrollable"
            >
                <p>Invoice creation form will go here</p>
            </Modal>
        </Layout>
    );
}

export default InvoiceManagement;