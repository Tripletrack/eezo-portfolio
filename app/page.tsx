import { getSupabase } from "@/lib/supabase";
import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import type { Project } from "@/lib/supabase";

const DEMO_PROJECTS: Project[] = [
  { id: 1, title: "Project One", category: "Film", subtitle: null, youtube_id: "dQw4w9WgXcQ", thumbnail_url: null, sort_order: 1, created_at: "" },
  { id: 2, title: "Project Two", category: "Commercial", subtitle: null, youtube_id: "9bZkp7q19f0", thumbnail_url: null, sort_order: 2, created_at: "" },
  { id: 3, title: "Project Three", category: "Music Video", subtitle: null, youtube_id: "JGwWNGJdvx8", thumbnail_url: null, sort_order: 3, created_at: "" },
  { id: 4, title: "Project Four", category: "Film", subtitle: null, youtube_id: "YykjpeuMNEk", thumbnail_url: null, sort_order: 4, created_at: "" },
  { id: 5, title: "Project Five", category: "Commercial", subtitle: null, youtube_id: "RgKAFK5djSk", thumbnail_url: null, sort_order: 5, created_at: "" },
  { id: 6, title: "Project Six", category: "Music Video", subtitle: null, youtube_id: "OPf0YbXqDm0", thumbnail_url: null, sort_order: 6, created_at: "" },
];

async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return DEMO_PROJECTS;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return DEMO_PROJECTS;
  return data as Project[];
}

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main style={{ paddingTop: "72px" }}>
        <ProjectGrid projects={projects} />
      </main>
    </>
  );
}
