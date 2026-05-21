"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Globe,
  FileText,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TiptapEditor } from "./tiptap-editor";

interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
}

export function AdminContentClient({ initialData }: { initialData: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialData);
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Editor State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const autoSlug = (t: string) =>
    t.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const openEditor = async (post?: Post) => {
    if (post) {
      // Fetch full content if not loaded
      let fullContent = post.content ?? "";
      if (!fullContent) {
        try {
          const res = await fetch(`/api/admin/posts/${post.id}`);
          if (res.ok) {
            const data = await res.json();
            fullContent = data.content ?? "";
          }
        } catch {
          toast.error("Eroare la încărcarea articolului.");
          return;
        }
      }
      setEditingPost(post);
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setImageUrl(post.imageUrl || "");
      setContent(fullContent);
    } else {
      setEditingPost(null);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setImageUrl("");
      setContent("");
    }
    setView("editor");
  };

  const handleSave = async (published: boolean) => {
    if (!title.trim()) {
      toast.error("Titlul este obligatoriu.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug-ul este obligatoriu.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      toast.error("Conținutul nu poate fi gol.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt: excerpt.trim() || null,
        imageUrl: imageUrl.trim() || null,
        published,
      };

      let res: Response;
      if (editingPost) {
        res = await fetch(`/api/admin/posts/${editingPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.text();
        toast.error(err || "Eroare la salvare.");
        return;
      }

      const saved: Post = await res.json();
      toast.success(
        editingPost
          ? published
            ? "Articol publicat!"
            : "Draft salvat!"
          : published
          ? "Articol creat și publicat!"
          : "Draft creat!"
      );

      if (editingPost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p))
        );
      } else {
        setPosts((prev) => [saved, ...prev]);
      }

      setView("list");
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest articol? Acțiunea este ireversibilă.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Articol șters.");
      } else {
        toast.error("Eroare la ștergere.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
        );
        toast.success(updated.published ? "Articol publicat!" : "Articol mutat în draft.");
      } else {
        toast.error("Eroare la actualizare.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    }
  };

  // ─── Editor View ──────────────────────────────────────────────────────────────

  if (view === "editor") {
    return (
      <div
        className="flex h-full flex-col"
        style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white px-7 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="size-4" /> Înapoi
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="text-[15px] font-bold text-slate-900">
              {editingPost ? "Editează Articolul" : "Articol Nou"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Salvează Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Globe className="size-4" />
              )}
              Publică
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          {/* Main editor */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingPost) setSlug(autoSlug(e.target.value));
              }}
              placeholder="Titlul articolului..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-2xl font-bold text-slate-900 shadow-sm outline-none placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
            />
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {/* Sidebar settings */}
          <div className="w-[300px] flex-shrink-0 space-y-4 overflow-y-auto">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                SEO & Publicare
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Slug (URL)
                  </label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(autoSlug(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                  />
                  <p className="mt-1 text-[10px] text-slate-400">/blog/{slug || "..."}</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Excerpt (descriere scurtă)
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    placeholder="Scurtă descriere pentru SEO și previzualizare..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Imagine copertă
              </h3>
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                />
                <button className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100">
                  <ImageIcon className="size-4" />
                </button>
              </div>
              {imageUrl && (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── List View ────────────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-full p-7"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Blog / Articole</h1>
          <p className="text-[12px] text-slate-400">
            {posts.length} articole total · {posts.filter((p) => p.published).length} publicate
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="size-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută articole..."
              className="w-44 bg-transparent text-[13px] text-slate-500 outline-none"
            />
          </div>
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="size-4" /> Articol Nou
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
          <div className="text-5xl">✍️</div>
          <h3 className="text-[17px] font-bold text-slate-900">
            {search ? "Niciun rezultat" : "Niciun articol încă"}
          </h3>
          <p className="text-[13px] text-slate-400">
            {search
              ? "Încearcă o altă căutare."
              : "Apasă \"Articol Nou\" pentru a scrie primul articol."}
          </p>
          {!search && (
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="size-4" /> Scrie Primul Articol
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Articol", "Status", "Data", "Acțiuni"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      {post.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-10 w-14 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <FileText className="size-4 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[13px] text-slate-900">{post.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">/blog/{post.slug}</p>
                        {post.excerpt && (
                          <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        post.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {post.published ? "✓ Publicat" : "⏸ Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[12px] text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditor(post)}
                        title="Editează"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        title={post.published ? "Mută în Draft" : "Publică"}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        {post.published ? (
                          <EyeOff className="size-3.5" />
                        ) : (
                          <Eye className="size-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        title="Șterge"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === post.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
