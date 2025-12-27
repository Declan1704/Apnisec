"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2, Edit2, Filter } from "lucide-react";

interface Issue {
  id: string;
  type: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
}

const issueTypes = ["cloud-security", "reteaming-assessment", "vapt"] as const;
const priorities = ["low", "medium", "high"] as const;
const statuses = ["open", "in-progress", "closed"] as const;

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    type: "cloud-security" as (typeof issueTypes)[number],
    title: "",
    description: "",
    priority: "medium" as (typeof priorities)[number],
    status: "open" as (typeof statuses)[number],
  });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Fetch issues
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/issues", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIssues(data);
        setFilteredIssues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, router]);

  // Filter issues
  useEffect(() => {
    if (filterType === "all") {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter((i) => i.type === filterType));
    }
  }, [filterType, issues]);

  // Create Issue
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create issue");
      }

      const newIssue = await res.json();
      setIssues([newIssue, ...issues]);
      setShowCreateForm(false);
      setForm({
        type: "cloud-security",
        title: "",
        description: "",
        priority: "medium",
        status: "open",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Delete Issue
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this issue?")) return;

    await fetch(`/api/issues/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token!}` },
    });

    setIssues(issues.filter((i) => i.id !== id));
  };

  // Update Status (quick inline)
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token!}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    setIssues(
      issues.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Issue Dashboard
            </h1>
            <p className="text-xl text-gray-400">
              Welcome back,{" "}
              <span className="text-blue-400">{user.name || user.email}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Issue
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-800 hover:bg-red-600/30 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 outline-none"
          >
            <option value="all">All Types</option>
            {issueTypes.map((t) => (
              <option key={t} value={t}>
                {t
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          <span className="text-gray-400">{filteredIssues.length} issues</span>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-10 p-8 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              Create New Issue
            </h2>
            {error && (
              <p className="text-red-400 mb-4 bg-red-900/20 p-3 rounded-lg">
                {error}
              </p>
            )}
            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as any })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                >
                  {issueTypes.map((t) => (
                    <option key={t} value={t}>
                      {t
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as any })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as any })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Issue"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-8 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Issues List */}
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-6">No issues found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 rounded-lg font-semibold text-white"
            >
              Create Your First Issue
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {issue.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-blue-400 mb-3 capitalize">
                  {issue.type.split("-").join(" ")}
                </p>

                {issue.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {issue.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {issue.priority && (
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        issue.priority === "high"
                          ? "bg-red-900/50 text-red-300"
                          : issue.priority === "medium"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : "bg-green-900/50 text-green-300"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  )}
                  <select
                    value={issue.status || "open"}
                    onChange={(e) =>
                      handleStatusUpdate(issue.id, e.target.value)
                    }
                    className="px-3 py-1 text-xs rounded-full bg-slate-700/50 text-white border border-slate-600"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() +
                          s.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
