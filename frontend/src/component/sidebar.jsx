import { NavLink } from "react-router-dom";
import "primeicons/primeicons.css";
import "../assets/css/sidebar.css";

export default function SideBar() {
  const linkClass = ({ isActive }) =>
    "sidebar-link" + (isActive ? " active" : "");

  return (
    <aside className="sidebar">

      <nav className="sidebar-icons">
        <NavLink to="/" end className={linkClass}><i className="pi pi-home icon-lg" /></NavLink>
        <NavLink to="/test" className={linkClass}><i className="pi pi-cog icon-lg" /></NavLink>
        <NavLink to="/test2" className={linkClass}><i className="pi pi-user icon-lg" /> </NavLink>
        <NavLink to="/" end className={linkClass}><i className="pi pi-home icon-lg" /></NavLink>
        <NavLink to="/test" className={linkClass}><i className="pi pi-cog icon-lg" /></NavLink>
        <NavLink to="/test2" className={linkClass}><i className="pi pi-user icon-lg" /> </NavLink>
      </nav>

    </aside>
  );
}
