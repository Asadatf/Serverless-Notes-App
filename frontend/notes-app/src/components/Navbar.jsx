import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { MdMenuBook } from "react-icons/md";
// import "./Navbar.css";
import { useState } from "react";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [menuActive, setMenuActive] = useState(false);

  const handleClick = () => {
    logout();
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        Notes App
      </Link>

      <div id="menu-icon" onClick={() => setMenuActive(!menuActive)}>
        <MdMenuBook />
      </div>

      <nav className={`navbar ${menuActive ? "active" : ""}`}>
        {user && (
          <div className="user">
            <Link to="/profile" className="navbar-username">
              {user.username}
            </Link>
            {user.pic && (
              <img
                src={user.pic}
                alt="Profile"
                width="40"
                height="40"
                style={{
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            )}
            <button onClick={handleClick} className="navbar-link">
              Log out
            </button>
          </div>
        )}
        {!user && (
          <div>
            <Link to="/login" className="navbar-link">
              Log in
            </Link>
            <Link to="/signup" className="navbar-link">
              Signup
            </Link>
          </div>
        )}
      </nav>
      <div className={`nav-bg ${menuActive ? "active" : ""}`}></div>
    </header>
  );
};

export default Navbar;
