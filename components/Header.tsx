"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
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
      {/* Left nav */}
      <nav style={{ display: "flex", gap: "32px" }}>
        <Link
          href="/"
          className="header-nav-link"
          style={{
            fontSize: "13px",
            letterSpacing: "0.12em",
            fontWeight: 500,
            color: pathname === "/" ? "#fff" : "#888",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          Films
        </Link>
        <Link
          href="/contact"
          className="header-nav-link"
          style={{
            fontSize: "13px",
            letterSpacing: "0.12em",
            fontWeight: 500,
            color: pathname === "/contact" ? "#fff" : "#888",
            textDecoration: "none",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
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
          transition: "color 0.25s, transform 0.25s",
          display: "inline-block",
        }}
      >
        Aviv Nachshon
      </Link>
      <style>{`
        .header-name:hover {
          color: #2d6a4f !important;
        }
        .header-nav-link:hover {
          color: #fff !important;
        }
        @media (max-width: 640px) {
          .header-name {
            font-size: 13px !important;
            letter-spacing: 0.12em !important;
          }
        }
      `}</style>

      {/* Right: Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        style={{ color: "#888", transition: "color 0.2s" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </header>
  );
}
