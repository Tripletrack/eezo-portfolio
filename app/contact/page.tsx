import Header from "@/components/Header";
import { createClient } from "@supabase/supabase-js";

async function getContactConfig() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from("site_config").select("*");
    if (!data) return null;
    const config: Record<string, string> = {};
    for (const row of data) config[row.key] = row.value;
    return config;
  } catch {
    return null;
  }
}

export const revalidate = 60;

export default async function ContactPage() {
  const config = await getContactConfig();
  const email = config?.contact_email || "your@email.com";
  const imageUrl = config?.contact_image_url || "";
  const bio = config?.contact_bio || "";
  const imageWidth = config?.contact_image_width || "700";

  return (
    <>
      <Header />
      <main style={{ paddingTop: "72px", minHeight: "100vh", background: "#000" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px" }}>

          {/* Title */}
          <h1 style={{
            fontSize: "13px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: "#fff",
            marginBottom: "32px",
            textAlign: "center",
          }}>
            Contact
          </h1>

          {/* Bio */}
          {bio && (
            <p style={{
              fontSize: "14px",
              lineHeight: "1.7",
              color: "#aaa",
              maxWidth: "560px",
              margin: "0 auto 24px",
              textAlign: "center",
            }}>
              {bio}
            </p>
          )}

          {/* Email */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <a
              href={`mailto:${email}`}
              style={{
                fontSize: "13px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {email}
            </a>
          </div>

          {/* Large photo */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Contact"
              style={{
                width: "100%",
                maxWidth: `${imageWidth}px`,
                display: "block",
                margin: "0 auto",
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}
