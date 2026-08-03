import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    console.log("LOGOUT_CLICKED");

    // Later:
    // Call backend logout endpoint
    // Clear user state
    // Destroy session

    navigate("/");
  }

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">
        🍴 Palate
      </h1>

      <div className="navbar-links">
        {/* Main recipe discovery page */}
        <Link to="/discover">
          Discover
        </Link>

        {/* Allows users to change their food preferences */}
        <Link to="/onboarding">
          Update Preferences
        </Link>

        {/* Logs the user out */}
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}