"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Project } from "@prisma/client";
import { AlertCircle, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fields = [
  { key: "title", label: "Título", required: true },
  { key: "category", label: "Categoria", required: true },
  { key: "imageUrl", label: "Imagem (URL, opcional)", placeholder: "https://…" },
  { key: "link", label: "Link do projeto (opcional)", placeholder: "https://…" },
] as const;

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deletingRef = useRef<string | null>(null);

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

  // Confirmado no AlertDialog (o botão "Remover" de cada card abre o diálogo).
  async function handleDelete(id: string) {
    if (deletingRef.current) return;
    deletingRef.current = id;
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Erro ao remover o projeto.");
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      deletingRef.current = null;
      setDeletingId(null);
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card className="lg:sticky lg:top-6">
        <form onSubmit={handleSubmit} className="grid gap-5 p-6">
          <h3 className="text-lg font-medium">{editingId ? "Editar projeto" : "Novo projeto"}</h3>

          {fields.slice(0, 2).map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={`project-${field.key}`}>{field.label}</Label>
              <Input
                id={`project-${field.key}`}
                required
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            </div>
          ))}

          <div className="grid gap-2">
            <Label htmlFor="project-description">Descrição</Label>
            <Textarea
              id="project-description"
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {fields.slice(2).map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={`project-${field.key}`}>{field.label}</Label>
              <Input
                id={`project-${field.key}`}
                inputMode="url"
                placeholder={"placeholder" in field ? field.placeholder : undefined}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            </div>
          ))}

          <div className="grid gap-2">
            <Label htmlFor="project-order">Ordem de exibição</Label>
            <Input
              id="project-order"
              type="number"
              inputMode="numeric"
              className="max-w-[8rem]"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>

          {error && (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertCircle aria-hidden="true" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              ) : editingId ? null : (
                <Plus aria-hidden="true" />
              )}
              {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Adicionar projeto"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <ul className="grid gap-3">
        {projects.length === 0 && (
          <li>
            <Card className="border-dashed bg-transparent p-6 text-sm text-muted-foreground">
              Nenhum projeto cadastrado ainda.
            </Card>
          </li>
        )}
        {projects.map((project, i) => (
          <li
            key={project.id}
            className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Card
              data-editing={editingId === project.id ? "" : undefined}
              className="card-hover flex flex-col gap-4 p-5 data-[editing]:border-primary/60 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="soft">{project.category}</Badge>
                  <span className="text-[13px] tabular-nums text-muted-foreground">
                    ordem {project.order}
                  </span>
                </div>
                <h4 className="font-medium text-foreground">{project.title}</h4>
                <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(project)}
                  disabled={deletingId === project.id}
                >
                  <Pencil aria-hidden="true" />
                  Editar
                  <span className="sr-only">: {project.title}</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === project.id}
                      className="text-destructive hover:border-destructive hover:bg-destructive/10"
                    >
                      {deletingId === project.id ? (
                        <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                      ) : (
                        <Trash2 aria-hidden="true" />
                      )}
                      {deletingId === project.id ? "Removendo…" : "Remover"}
                      <span className="sr-only">: {project.title}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover este projeto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        “{project.title}” sai do portfólio e do banco. Não dá para desfazer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => handleDelete(project.id)}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
