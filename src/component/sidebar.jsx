import { NavLink } from "react-router-dom";
import "../assets/css/sidebar.css";
import "primeicons/primeicons.css";

function SideBar() {
  return (
    <nav className="nav">
      <div className="nav-icons">
        <NavLink to="/" end><i className="pi pi-home"></i></NavLink>
        <NavLink to="/test"><i className="pi pi-cog"></i></NavLink>
        <NavLink to="/test2"><i className="pi pi-user"></i></NavLink>
        <NavLink to="/" end><i className="pi pi-home"></i></NavLink>
        <NavLink to="/test"><i className="pi pi-cog"></i></NavLink>
        <NavLink to="/test2"><i className="pi pi-user"></i></NavLink>
      </div>

      <button className="logout-btn">
        <i className="pi pi-sign-out"></i>
        <span className="logout-label">Logout</span>
      </button>
    </nav>
  );
}

export default SideBar;
