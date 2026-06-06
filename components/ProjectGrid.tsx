"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/supabase";

type Props = { projects: Project[] };

function thumb(p: Project) {
  return p.thumbnail_url || `https://img.youtube.com/vi/${p.youtube_id}/hqdefault.jpg`;
}

function GridItem({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/films/${project.id}`}
      style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#111", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={thumb(project)}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{
          objectFit: "cover",
          transition: "transform 0.5s ease, filter 0.4s ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          filter: hovered ? "grayscale(1)" : "grayscale(0)",
        }}
      />
      {/* Dark overlay + title on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
          transition: "background 0.4s ease",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#fff",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {project.title}
        </span>
      </div>
    </Link>
  );
}

export default function ProjectGrid({ projects }: Props) {
  return (
    <>
      <style>{`
        .project-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 640px) {
          .project-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="project-grid">
        {projects.map((project) => (
          <GridItem key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
