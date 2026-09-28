import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

type Health = { ok: boolean; timestamp: number };
type Hello = { message: string };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function Home() {
  const [name, setName] = useState("world");

  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => fetchJson<Health>("/api/health"),
  });

  const hello = useQuery({
    queryKey: ["hello", name],
    queryFn: () => fetchJson<Hello>(`/api/hello/${encodeURIComponent(name)}`),
  });

  return (
    <section>
      <h1>cf-saas</h1>
      <p>React + TanStack Router (file-based) + TanStack Query on a single origin.</p>

      <div className="card">
        <h2>API status</h2>
        {health.isPending ? (
          <p>Loading…</p>
        ) : health.isError ? (
          <p className="error">{String(health.error)}</p>
        ) : (
          <p>
            <span className={health.data.ok ? "ok" : "error"}>
              {health.data.ok ? "Healthy" : "Error"}
            </span>{" "}
            <code>{new Date(health.data.timestamp).toLocaleTimeString()}</code>
          </p>
        )}
      </div>

      <div className="card">
        <h2>Hello API</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Name"
        />
        <p>
          {hello.isPending ? "Loading…" : hello.isError ? String(hello.error) : hello.data.message}
        </p>
      </div>
    </section>
  );
}
