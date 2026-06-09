import Navbar from "../components/layout/Navbar";

export default function MainLayout({
  children,
  accentClass,
  CSS,
  settings,
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
  return (
    <div className={accentClass}>
      <style>{CSS}</style>

      {/* Cinematic grain overlay */}
      {settings?.cinematicBg && (
        <svg className="grain-svg" aria-hidden="true">
          <filter id="grain-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-noise)" />
        </svg>
      )}

      {/* NAV */}
      <Navbar
        navScrolled={navScrolled}
        navDropdownRef={navDropdownRef}
        setPage={setPage}
        setNavDropdown={setNavDropdown}
        page={page}
        session={session}
        setShowAuth={setShowAuth}
        setShowSettings={setShowSettings}
        Icon={Icon}
      />

      {children}
    </div>
  );
}
