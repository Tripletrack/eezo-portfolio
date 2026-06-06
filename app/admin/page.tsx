"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ContactConfig = {
  contact_email: string;
  contact_instagram: string;
  contact_image_url: string;
  contact_bio: string;
  contact_image_width: string;
};

type Project = {
  id: number;
  title: string;
  category: string | null;
  subtitle: string | null;
  youtube_id: string;
  thumbnail_url: string | null;
  sort_order: number;
};

const EMPTY: Omit<Project, "id"> = {
  title: "",
  category: "",
  subtitle: "",
  youtube_id: "",
  thumbnail_url: "",
  sort_order: 0,
};

const s = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Helvetica Neue, sans-serif", padding: "40px 24px" },
  center: { maxWidth: "760px", margin: "0 auto" },
  h1: { fontSize: "14px", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "32px", color: "#888" },
  loginBox: { maxWidth: "320px", margin: "120px auto", textAlign: "center" as const },
  input: { width: "100%", background: "#111", border: "1px solid #222", color: "#fff", padding: "10px 14px", fontSize: "13px", outline: "none", marginBottom: "12px", boxSizing: "border-box" as const },
  btn: { background: "#fff", color: "#000", border: "none", padding: "10px 24px", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer", fontWeight: 600 },
  btnDanger: { background: "transparent", color: "#ff4444", border: "1px solid #ff4444", padding: "6px 14px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer" },
  btnSmall: { background: "transparent", color: "#888", border: "1px solid #333", padding: "6px 14px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer" },
  label: { fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#555", marginBottom: "4px", display: "block" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  formRow: { marginBottom: "12px" },
  modal: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99 },
  modalBox: { background: "#111", border: "1px solid #222", padding: "32px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto" as const },
} as const;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbDragOver, setThumbDragOver] = useState(false);

  // Contact config state
  const [contact, setContact] = useState<ContactConfig>({ contact_email: "", contact_instagram: "", contact_image_url: "", contact_bio: "", contact_image_width: "700" });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactImgDragOver, setContactImgDragOver] = useState(false);
  const [contactImgUploading, setContactImgUploading] = useState(false);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const api = useCallback(async (method: string, body?: object) => {
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error((await res.json()).error || "Error");
    return res.json();
  }, [password]);

  const load = useCallback(async () => {
    try {
      const data = await api("GET");
      setProjects(data);
    } catch { setError("Failed to load"); }
  }, [api]);

  const loadContact = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contact", { headers: { "x-admin-password": password } });
      if (res.ok) {
        const data = await res.json();
        setContact({ contact_email: data.contact_email || "", contact_instagram: data.contact_instagram || "", contact_image_url: data.contact_image_url || "", contact_bio: data.contact_bio || "", contact_image_width: data.contact_image_width || "700" });
      }
    } catch { /* ignore */ }
  }, [password]);

  useEffect(() => { if (authed) { load(); loadContact(); } }, [authed, load, loadContact]);

  const saveContact = async () => {
    setContactSaving(true);
    setContactError("");
    setContactSuccess(false);
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error");
      setContactSuccess(true);
      setTimeout(() => setContactSuccess(false), 3000);
    } catch (e: unknown) { setContactError(e instanceof Error ? e.message : "Error"); }
    setContactSaving(false);
  };

  const uploadContactImage = async (file: File) => {
    setContactImgUploading(true);
    setContactError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const { url } = await res.json();
      setContact(c => ({ ...c, contact_image_url: url }));
    } catch (e: unknown) { setContactError(e instanceof Error ? e.message : "Upload failed"); }
    setContactImgUploading(false);
  };

  const login = async () => {
    try {
      const res = await fetch("/api/admin/projects", { headers: { "x-admin-password": password } });
      if (!res.ok) throw new Error();
      setAuthed(true);
    } catch { setError("Wrong password"); }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api("PUT", { ...form, id: editing.id });
      } else {
        await api("POST", form);
      }
      await load();
      setEditing(null);
      setCreating(false);
      setForm(EMPTY);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try { await api("DELETE", { id }); await load(); }
    catch { setError("Delete failed"); }
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, category: p.category || "", subtitle: p.subtitle || "", youtube_id: p.youtube_id, thumbnail_url: p.thumbnail_url || "", sort_order: p.sort_order });
    setCreating(false);
  };
  const openCreate = () => { setCreating(true); setEditing(null); setForm({ ...EMPTY, sort_order: projects.length + 1 }); };
  const closeModal = () => { setEditing(null); setCreating(false); setError(""); };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const { url } = await res.json();
      setForm(f => ({ ...f, thumbnail_url: url }));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Upload failed"); }
    setUploading(false);
  };

  const onThumbDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setThumbDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadImage(file);
  };

  // Drag handlers
  const onDragStart = (i: number) => { dragIndex.current = i; };
  const onDragEnter = (i: number) => { setDragOver(i); };
  const onDragEnd = () => { setDragOver(null); dragIndex.current = null; };

  const onDrop = async (dropIndex: number) => {
    const fromIndex = dragIndex.current;
    if (fromIndex === null || fromIndex === dropIndex) { setDragOver(null); return; }

    const reordered = [...projects];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(dropIndex, 0, moved);

    // Assign new sort_order values
    const updated = reordered.map((p, i) => ({ ...p, sort_order: i + 1 }));
    setProjects(updated);
    setDragOver(null);
    dragIndex.current = null;

    // Save all updated sort orders
    setSavingOrder(true);
    try {
      await Promise.all(updated.map(p => api("PUT", { id: p.id, sort_order: p.sort_order })));
    } catch { setError("Failed to save order"); await load(); }
    setSavingOrder(false);
  };

  if (!authed) return (
    <div style={s.page}>
      <div style={s.loginBox}>
        <p style={{ ...s.h1, marginBottom: "24px" }}>Admin</p>
        <input style={s.input} type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} autoFocus />
        <button style={s.btn} onClick={login}>Enter</button>
        {error && <p style={{ color: "#ff4444", fontSize: "12px", marginTop: "12px" }}>{error}</p>}
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <p style={s.h1}>
            Projects
            {savingOrder && <span style={{ color: "#555", marginLeft: "12px", fontSize: "11px" }}>Saving order...</span>}
          </p>
          <button style={s.btn} onClick={openCreate}>+ Add Project</button>
        </div>

        <p style={{ fontSize: "11px", color: "#444", marginBottom: "16px", letterSpacing: "0.06em" }}>
          Drag rows to reorder
        </p>

        {error && <p style={{ color: "#ff4444", fontSize: "12px", marginBottom: "16px" }}>{error}</p>}

        {projects.map((p, i) => (
          <div
            key={p.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragEnter={() => onDragEnter(i)}
            onDragOver={e => e.preventDefault()}
            onDragEnd={onDragEnd}
            onDrop={() => onDrop(i)}
            style={{
              background: dragOver === i ? "#1a1a1a" : "#111",
              border: dragOver === i ? "1px solid #444" : "1px solid #1e1e1e",
              padding: "16px 20px",
              marginBottom: "4px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
              cursor: "grab",
              transition: "border-color 0.15s, background 0.15s",
              userSelect: "none",
            }}
          >
            {/* Drag handle */}
            <div style={{ color: "#333", fontSize: "16px", flexShrink: 0, cursor: "grab" }}>⠿</div>

            {p.thumbnail_url && (
              <img src={p.thumbnail_url} alt="" style={{ width: "72px", height: "40px", objectFit: "cover", flexShrink: 0 }} />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 500, marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "11px", color: "#555" }}>{p.category} · {p.youtube_id}</p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button style={s.btnSmall} onClick={() => openEdit(p)}>Edit</button>
              <button style={s.btnDanger} onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}

        {projects.length === 0 && <p style={{ color: "#444", fontSize: "13px" }}>No projects yet.</p>}

        {/* Contact Section */}
        <div style={{ marginTop: "64px", paddingTop: "40px", borderTop: "1px solid #1e1e1e" }}>
          <p style={{ ...s.h1, marginBottom: "24px" }}>Contact Page</p>

          <div style={s.formRow}>
            <label style={s.label}>Bio</label>
            <textarea style={{ ...s.input, height: "80px", resize: "vertical" }} value={contact.contact_bio} onChange={e => setContact(c => ({ ...c, contact_bio: e.target.value }))} placeholder="Award-winning director based in..." />
          </div>

          <div style={s.formRow}>
            <label style={s.label}>Email</label>
            <input style={s.input} value={contact.contact_email} onChange={e => setContact(c => ({ ...c, contact_email: e.target.value }))} placeholder="your@email.com" />
          </div>

          <div style={s.formRow}>
            <label style={s.label}>Instagram URL</label>
            <input style={s.input} value={contact.contact_instagram} onChange={e => setContact(c => ({ ...c, contact_instagram: e.target.value }))} placeholder="https://instagram.com/yourhandle" />
          </div>

          <div style={s.formRow}>
            <label style={s.label}>Profile Picture</label>
            <div
              onDragOver={e => { e.preventDefault(); setContactImgDragOver(true); }}
              onDragLeave={() => setContactImgDragOver(false)}
              onDrop={e => { e.preventDefault(); setContactImgDragOver(false); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith("image/")) uploadContactImage(file); }}
              onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadContactImage(f); }; inp.click(); }}
              style={{
                border: `2px dashed ${contactImgDragOver ? "#fff" : "#333"}`,
                borderRadius: "2px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                background: contactImgDragOver ? "#1a1a1a" : "transparent",
                transition: "all 0.2s",
                marginBottom: "8px",
              }}
            >
              {contact.contact_image_url ? (
                <img src={contact.contact_image_url} alt="profile" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto 8px" }} />
              ) : null}
              <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>
                {contactImgUploading ? "Uploading..." : contact.contact_image_url ? "Drop new image to replace" : "Drop image here or click to upload"}
              </p>
            </div>
            <input
              style={{ ...s.input, marginBottom: 0, fontSize: "11px", color: "#555" }}
              value={contact.contact_image_url}
              onChange={e => setContact(c => ({ ...c, contact_image_url: e.target.value }))}
              placeholder="Or paste a URL manually"
            />
          </div>

          <div style={s.formRow}>
            <label style={s.label}>Image Width — {contact.contact_image_width}px</label>
            <input
              type="range"
              min="300"
              max="1200"
              step="10"
              value={contact.contact_image_width}
              onChange={e => setContact(c => ({ ...c, contact_image_width: e.target.value }))}
              style={{ width: "100%", accentColor: "#fff" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444", marginTop: "4px" }}>
              <span>300px</span><span>1200px</span>
            </div>
          </div>

          {contactError && <p style={{ color: "#ff4444", fontSize: "12px", marginBottom: "12px" }}>{contactError}</p>}
          {contactSuccess && <p style={{ color: "#44ff88", fontSize: "12px", marginBottom: "12px" }}>Saved!</p>}

          <button style={s.btn} onClick={saveContact} disabled={contactSaving}>
            {contactSaving ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {(editing || creating) && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <p style={{ ...s.h1, marginBottom: "24px" }}>{editing ? "Edit Project" : "New Project"}</p>

            <div style={s.formRow}>
              <label style={s.label}>Title *</label>
              <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Red Bull // Branded" />
            </div>

            <div style={s.formGrid}>
              <div>
                <label style={s.label}>YouTube ID *</label>
                <input style={s.input} value={form.youtube_id} onChange={e => setForm(f => ({ ...f, youtube_id: e.target.value }))} placeholder="dQw4w9WgXcQ" />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <input style={s.input} value={form.category || ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Film / Commercial / Music Video" />
              </div>
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Thumbnail</label>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setThumbDragOver(true); }}
                onDragLeave={() => setThumbDragOver(false)}
                onDrop={onThumbDrop}
                onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadImage(f); }; inp.click(); }}
                style={{
                  border: `2px dashed ${thumbDragOver ? "#fff" : "#333"}`,
                  borderRadius: "2px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: thumbDragOver ? "#1a1a1a" : "transparent",
                  transition: "all 0.2s",
                  marginBottom: "8px",
                  position: "relative",
                }}
              >
                {form.thumbnail_url ? (
                  <img src={form.thumbnail_url} alt="thumbnail" style={{ height: "80px", objectFit: "cover", display: "block", margin: "0 auto 8px" }} />
                ) : null}
                <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>
                  {uploading ? "Uploading..." : form.thumbnail_url ? "Drop new image to replace" : "Drop image here or click to upload"}
                </p>
              </div>
              {/* Also allow pasting a URL manually */}
              <input
                style={{ ...s.input, marginBottom: 0, fontSize: "11px", color: "#555" }}
                value={form.thumbnail_url || ""}
                onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                placeholder="Or paste a URL manually"
              />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Subtitle / Credits</label>
              <textarea style={{ ...s.input, height: "80px", resize: "vertical" }} value={form.subtitle || ""}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder={"Director: Aviv Nachshon\nClient: Red Bull"} />
            </div>

            {error && <p style={{ color: "#ff4444", fontSize: "12px", marginBottom: "12px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button style={s.btn} onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
              <button style={s.btnSmall} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
