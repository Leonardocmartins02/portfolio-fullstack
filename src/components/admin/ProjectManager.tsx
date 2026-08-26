"use client";

import { useState, type FormEvent } from "react";
import type { Project } from "@prisma/client";

type FormState = {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  order: string;
};

const emptyForm: FormState = {
  title: "",
  category: "",
  description: "",
  imageUrl: "",
  link: "",
  order: "0",
};

export function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      imageUrl: project.imageUrl ?? "",
      link: project.link ?? "",
      order: String(project.order),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      imageUrl: form.imageUrl || "",
      link: form.link || "",
      order: Number(form.order) || 0,
    };

    try {
      const response = editingId
        ? await fetch(`/api/projects/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Erro ao salvar o projeto.");
      }

      const saved: Project = await response.json();

      setProjects((prev) => {
        if (editingId) {
          return prev
            .map((project) => (project.id === editingId ? saved : project))
            .sort((a, b) => a.order - b.order);
        }
        return [...prev, saved].sort((a, b) => a.order - b.order);
      });

      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Remover este projeto?");
    if (!confirmed) return;

    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProjects((prev) => prev.filter((project) => project.id !== id));
      if (editingId === id) cancelEdit();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-border bg-surface p-5"
      >
        <h3 className="text-sm font-semibold text-foreground">
          {editingId ? "Editar projeto" : "Novo projeto"}
        </h3>

        <div>
          <label className="mb-1 block text-xs text-muted">Título</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Categoria</label>
          <input
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Descrição</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Imagem (URL, opcional)</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Link do projeto (opcional)</label>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">Ordem de exibição</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Adicionar projeto"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-border px-5 py-2 text-sm text-foreground"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-sm text-muted">Nenhum projeto cadastrado ainda.</p>
        )}
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-4"
          >
            <div>
              <span className="text-xs uppercase tracking-wide text-accent">
                {project.category} · ordem {project.order}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{project.title}</h4>
              <p className="mt-1 text-xs text-muted line-clamp-2">{project.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => startEdit(project)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-red-400 hover:border-red-400"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
