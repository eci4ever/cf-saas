import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BrandMark } from "@/components/landing/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Health = { ok: boolean; timestamp: number };
type Hello = { message: string };
type Task = { id: number; title: string; done: number; createdAt: string };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function Dashboard() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("world");
  const [title, setTitle] = useState("");

  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => fetchJson<Health>("/api/health"),
  });

  const hello = useQuery({
    queryKey: ["hello", name],
    queryFn: () => fetchJson<Hello>(`/api/hello/${encodeURIComponent(name)}`),
  });

  const tasks = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchJson<Task[]>("/api/tasks"),
  });

  const addTask = useMutation({
    mutationFn: (newTitle: string) =>
      fetchJson<Task>("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed) addTask.mutate(trimmed);
  };

  return (
    <div className="min-h-svh">
      <header className="border-border/70 border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
          <BrandMark />
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-6 py-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Live data from the Hono API and Neon Postgres.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">API status</span>
            {health.isError ? (
              <Badge variant="destructive">Offline</Badge>
            ) : health.data?.ok ? (
              <Badge variant="secondary">Healthy</Badge>
            ) : (
              <Badge variant="outline">Checking…</Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Stored in Neon Postgres via the Hono API.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {tasks.isError ? (
                <p className="text-destructive text-sm">{String(tasks.error)}</p>
              ) : tasks.data && tasks.data.length > 0 ? (
                tasks.data.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                  >
                    <span className="text-sm">{task.title}</span>
                    <Badge variant={task.done ? "secondary" : "outline"}>
                      {task.done ? "Done" : "Pending"}
                    </Badge>
                  </div>
                ))
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No tasks yet</EmptyTitle>
                    <EmptyDescription>Add your first task below.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="New task…"
                  aria-label="New task title"
                />
                <Button type="submit" disabled={addTask.isPending || title.trim().length === 0}>
                  Add
                </Button>
              </form>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hello API</CardTitle>
              <CardDescription>Query key reacts to the name you type.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                aria-label="Name"
              />
              <p className="text-sm">
                {hello.isPending
                  ? "Loading…"
                  : hello.isError
                    ? String(hello.error)
                    : hello.data.message}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
