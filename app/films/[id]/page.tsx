import { getSupabase } from "@/lib/supabase";
import Header from "@/components/Header";
import type { Project } from "@/lib/supabase";
import { notFound } from "next/navigation";

const DEMO: Project[] = [
  { id: 1, title: "Project One", category: "Film", subtitle: "A short film", youtube_id: "dQw4w9WgXcQ", thumbnail_url: null, sort_order: 1, created_at: "" },
  { id: 2, title: "Project Two", category: "Commercial", subtitle: null, youtube_id: "9bZkp7q19f0", thumbnail_url: null, sort_order: 2, created_at: "" },
  { id: 3, title: "Project Three", category: "Music Video", subtitle: null, youtube_id: "JGwWNGJdvx8", thumbnail_url: null, sort_order: 3, created_at: "" },
  { id: 4, title: "Project Four", category: "Film", subtitle: null, youtube_id: "YykjpeuMNEk", thumbnail_url: null, sort_order: 4, created_at: "" },
  { id: 5, title: "Project Five", category: "Commercial", subtitle: null, youtube_id: "RgKAFK5djSk", thumbnail_url: null, sort_order: 5, created_at: "" },
  { id: 6, title: "Project Six", category: "Music Video", subtitle: null, youtube_id: "OPf0YbXqDm0", thumbnail_url: null, sort_order: 6, created_at: "" },
];

async function getAllProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return DEMO;
  const { data } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  return (data && data.length > 0) ? (data as Project[]) : DEMO;
}

export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getAllProjects();
  const project = all.find((p) => p.id === Number(id));
  if (!project) notFound();

  const others = all.filter((p) => p.id !== project.id);

  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
        {/* Title block */}
        <div style={{ textAlign: "center", padding: "40px 24px 24px" }}>
          <h1
            style={{
              fontSize: "13px",
              letterSpacing: "0.12em",
              fontWeight: 500,
              textTransform: "uppercase",
              color: "#fff",
              marginBottom: project.subtitle ? "12px" : "0",
            }}
          >
            {project.title}
          </h1>
          {project.subtitle && (
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.08em",
                color: "#666",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                marginTop: "8px",
              }}
            >
              {project.subtitle}
            </p>
          )}
        </div>

        {/* Video player */}
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 0 2px" }}>
          <div style={{ aspectRatio: "16/9", background: "#111" }}>
            <iframe
              src={`https://www.youtube.com/embed/${project.youtube_id}?rel=0`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        </div>

      </main>
    </>
  );
}

export const revalidate = 60;
