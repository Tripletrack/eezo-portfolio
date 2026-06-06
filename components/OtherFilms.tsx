"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/supabase";

type Props = { projects: Project[] };

function thumb(p: Project) {
  return p.thumbnail_url || `https://img.youtube.com/vi/${p.youtube_id}/hqdefault.jpg`;
}

export default function OtherFilms({ projects }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2px",
        marginTop: "2px",
      }}
    >
      {projects.map((p) => (
        <Link key={p.id} href={`/films/${p.id}`} style={{ display: "block", position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#111" }}>
          <Image
            src={thumb(p)}
            alt={p.title}
            fill
            sizes="33vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
          <div
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "16px" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.45)"; const s = e.currentTarget.querySelector("span") as HTMLSpanElement; if (s) s.style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = ""; const s = e.currentTarget.querySelector("span") as HTMLSpanElement; if (s) s.style.opacity = "0"; }}
          >
            <span style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", opacity: 0, transition: "opacity 0.3s ease", fontWeight: 500 }}>
              {p.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
