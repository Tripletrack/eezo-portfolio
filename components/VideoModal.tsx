"use client";

import { useEffect } from "react";

type Props = {
  youtubeId: string;
  title: string;
  onClose: () => void;
};

export default function VideoModal({ youtubeId, title, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "28px",
          cursor: "pointer",
          lineHeight: 1,
          padding: "8px",
        }}
      >
        ×
      </button>

      {/* Video container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "960px",
          aspectRatio: "16/9",
          background: "#111",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>

      <p
        style={{
          marginTop: "16px",
          fontSize: "13px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#aaa",
        }}
      >
        {title}
      </p>
    </div>
  );
}
