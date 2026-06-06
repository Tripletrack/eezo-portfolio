"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          background: "#000",
        }}
      >
        {/* Left nav — hidden on mobile */}
        <nav className="header-nav" style={{ display: "flex", gap: "32px" }}>
          <Link href="/" className="header-nav-link" style={{ fontSize: "13px", letterSpacing: "0.12em", fontWeight: 500, color: pathname === "/" ? "#fff" : "#888", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}>
            Films
          </Link>
          <Link href="/contact" className="header-nav-link" style={{ fontSize: "13px", letterSpacing: "0.12em", fontWeight: 500, color: pathname === "/contact" ? "#fff" : "#888", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}>
            Contact
          </Link>
        </nav>

        {/* Center name */}
        <Link
          href="/"
          className="header-name"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "18px",
            letterSpacing: "0.2em",
            fontWeight: 600,
            color: "#fff",
            textDecoration: "none",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            transition: "color 0.25s",
            display: "inline-block",
          }}
        >
          Aviv Nachshon
        </Link>

        {/* Right: Instagram — hidden on mobile */}
        <a
          className="header-instagram"
          href="https://www.instagram.com/avivnachshon/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          style={{ color: "#888", transition: "color 0.2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* Hamburger — shown on mobile only */}
        <button
          className="header-burger"
          onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "none" }}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}>
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: "absolute", top: "20px", right: "24px", background: "none", border: "none", color: "#fff", fontSize: "28px", cursor: "pointer" }}
            aria-label="Close menu"
          >
            ✕
          </button>

          <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontSize: "18px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", textDecoration: "none", fontWeight: 500 }}>
            Films
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontSize: "18px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", textDecoration: "none", fontWeight: 500 }}>
            Contact
          </Link>

          {/* Instagram at bottom */}
          <a href="https://www.instagram.com/avivnachshon/" target="_blank" rel="noopener noreferrer" style={{ position: "absolute", bottom: "40px", color: "#fff" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      )}

      <style>{`
        .header-name:hover {
          color: #2d6a4f !important;
        }
        .header-nav-link:hover {
          color: #fff !important;
        }
        @media (max-width: 640px) {
          .header-nav { visibility: hidden !important; }
          .header-instagram { display: none !important; }
          .header-burger { display: block !important; }
          .header-name {
            font-size: 13px !important;
            letter-spacing: 0.1em !important;
          }
        }
      `}</style>
    </>
  );
}
