import { NavLink } from "react-router-dom";
import "primeicons/primeicons.css";
import "../assets/css/sidebar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function SideBar() {
  const linkClass = ({ isActive }) =>
    "sidebar-link" + (isActive ? " active" : "");

  return (
    <aside className="sidebar">

      <nav className="sidebar-icons">
          <NavLink to="/" end className={linkClass}><i className="pi pi-home icon-lg" /></NavLink>
          <NavLink to="/TenantManagement" className={linkClass}><i className="pi pi-user icon-lg" /></NavLink>
          <NavLink to="/test" className={linkClass}><i className="bi bi-building icon-lg" /> </NavLink>
          <NavLink to="/test" end className={linkClass}><i className="pi pi-wrench icon-lg" /></NavLink>
          <NavLink to="/test" className={linkClass}><i className="bi bi-box-seam icon-lg" /></NavLink>
          <NavLink to="/Invoicemanagement" className={linkClass}><i className="bi bi-currency-dollar icon-lg" /> </NavLink>
          <NavLink to="/test" className={linkClass}><i className="bi bi-alarm icon-lg" /> </NavLink>
          <NavLink to="/PackageManagement" className={linkClass}><i className="bi bi-sticky icon-lg" /> </NavLink>

      </nav>
    </aside>
  );
}
