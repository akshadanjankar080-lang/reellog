import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({
  navScrolled,
  navDropdownRef,
  setPage,
  setNavDropdown,
  page,
  session,
  setShowAuth,
  setShowSettings,
  Icon
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={`nav${navScrolled ? " nav-scrolled" : ""}`} ref={navDropdownRef}>
      <div className="nav-logo" onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
        <div className="nav-dot" />
        Reel<span>log</span>
      </div>
      <div className="nav-links">
        <button className={`nav-link${page === "home" && location.pathname === "/" ? " active" : ""}`} onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
          Home
        </button>
        <div className="nav-dropdown-wrapper">
          <button className={`nav-link${page === "explore" ? " active" : ""}`} onClick={() => { setPage("explore"); navigate("/explore"); setNavDropdown(null); }}>
            Explore
          </button>
        </div>
        <button className={`nav-link${page === "mylist" && location.pathname === "/" ? " active" : ""}`} onClick={() => { setPage("mylist"); navigate("/"); setNavDropdown(null); }}>
          My List
        </button>
        <button className={`nav-link${location.pathname === "/profile" ? " active" : ""}`} onClick={() => { navigate("/profile"); setNavDropdown(null); }}>
          Profile
        </button>
      </div>
      <div className="nav-right">
        <button className="btn-icon" onClick={() => {
          if (session) { navigate("/profile"); setNavDropdown(null); }
          else setShowAuth(true);
        }} title={session ? "Profile" : "Sign in / Join"}>
          <Icon name="user" size={17} />
        </button>
        <button className="btn-icon" onClick={() => { setShowSettings(s => !s); setNavDropdown(null); }} title="Settings">
          <Icon name="settings" size={17} />
        </button>
      </div>
    </nav>
  );
}
