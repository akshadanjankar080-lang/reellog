import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Icon } from "../Icon";

/**
 * Navbar Component
 * Navigation bar with logo, links, profile, and settings
 * Handles navigation, auth state, and dropdown logic
 */
export function Navbar({
  page,
  session,
  onPageChange,
  onShowAuth,
  onShowSettings,
  navScrolled,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navDropdownRef = useRef(null);
  const [navDropdown, setNavDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdown(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleNavClick = (newPage, path) => {
    onPageChange(newPage);
    navigate(path);
    setNavDropdown(null);
  };

  const handleLogoClick = () => {
    onPageChange("home");
    navigate("/");
    setNavDropdown(null);
  };

  const handleProfileClick = () => {
    if (session) {
      navigate("/profile");
      setNavDropdown(null);
    } else {
      onShowAuth();
    }
  };

  const handleSettingsClick = () => {
    onShowSettings();
    setNavDropdown(null);
  };

  return (
    <nav className={`nav${navScrolled ? " nav-scrolled" : ""}`} ref={navDropdownRef}>
      <div className="nav-logo" onClick={handleLogoClick}>
        <div className="nav-dot" />
        Reel<span>log</span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-link${page === "home" && location.pathname === "/" ? " active" : ""}`}
          onClick={() => handleNavClick("home", "/")}
        >
          Home
        </button>

        <div className="nav-dropdown-wrapper">
          <button
            className={`nav-link${page === "explore" ? " active" : ""}`}
            onClick={() => handleNavClick("explore", "/explore")}
          >
            Explore
          </button>
        </div>

        <button
          className={`nav-link${page === "mylist" && location.pathname === "/" ? " active" : ""}`}
          onClick={() => handleNavClick("mylist", "/")}
        >
          My List
        </button>

        <button
          className={`nav-link${location.pathname === "/profile" ? " active" : ""}`}
          onClick={() => {
            navigate("/profile");
            setNavDropdown(null);
          }}
        >
          Profile
        </button>
      </div>

      <div className="nav-right">
        <button
          className="btn-icon"
          onClick={handleProfileClick}
          title={session ? "Profile" : "Sign in / Join"}
        >
          <Icon name="user" size={17} />
        </button>

        <button
          className="btn-icon"
          onClick={handleSettingsClick}
          title="Settings"
        >
          <Icon name="settings" size={17} />
        </button>
      </div>
    </nav>
  );
}
