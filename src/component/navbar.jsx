import { Link } from "react-router-dom";
import "../assets/css/styles.css";

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/">Land</Link>
      <Link to="/test">Test</Link>
      <Link to="/test2">Test2</Link>
    </nav>
  );
}


export default NavBar;
