"use client";

import { useState } from "react";
import { Search, Check, ExternalLink, Server } from "lucide-react";
import Link from "next/link";
import { TableRowsSkeleton } from "@/components/skeletons/layout-skeletons";
import { CreateInstanceDialog } from "@/components/dialogs/create-instance-dialog";
import { InstanceDetailSheet } from "@/components/sheets/instance-detail-sheet";
import { useInstances } from "@/hooks/queries";
import { useAppContext } from "@/lib/context";
import { formatDistanceToNow } from "@/lib/format";
import type { Instance } from "@/lib/types";

const ACCENT_GRADIENTS = [
  "from-emerald-500 to-green-600",
  "from-cyan-400 to-blue-500",
  "from-amber-400 to-orange-500",
  "from-teal-400 to-emerald-500",
  "from-rose-400 to-pink-500",
  "from-teal-400 to-cyan-500",
  "from-sky-400 to-blue-500",
  "from-lime-400 to-emerald-500",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return ACCENT_GRADIENTS[Math.abs(hash) % ACCENT_GRADIENTS.length];
}

export default function InstancesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active">("all");
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(
    null,
  );

  const { activeInstanceId, setActiveInstance } = useAppContext();

  const { data: instances, isLoading } = useInstances();

  const filteredInstances = instances?.filter((instance) => {
    const matchesSearch =
      instance.name.toLowerCase().includes(search.toLowerCase()) ||
      instance.description?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && instance.id === activeInstanceId);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-sm font-medium text-white">Instances</h1>
          <p className="mt-0.5 text-xs text-muted-foreground/60">
            Manage your DocuMind instances
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="text-xs text-muted-foreground/60 underline underline-offset-4 decoration-muted-foreground/25 transition-colors hover:text-white hover:decoration-white/40"
        >
          + Create Instance
        </button>
      </div>

      {/* Search + filter row */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-white/6 bg-white/3 pl-8 pr-3 text-xs text-white outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-white/12"
          />
        </div>

        {/* Segmented status pills */}
        <div className="flex items-center gap-0.5 rounded-md border border-white/6 bg-white/2 p-0.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filter === "all"
                ? "bg-white/8 text-white"
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filter === "active"
                ? "bg-white/8 text-white"
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/6 bg-black">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1.5fr_0.7fr_0.7fr_100px] items-center gap-2 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50">
          <span>Name</span>
          <span>Description</span>
          <span>Created</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-px px-1 pb-1.5">
          {isLoading ? (
            <TableRowsSkeleton
              rows={3}
              gridClassName="grid grid-cols-[1fr_1.5fr_0.7fr_0.7fr_100px]"
              cellClassNames={[
                "w-28",
                "w-40",
                "w-16",
                "w-16",
                "ml-auto h-6 w-16",
              ]}
            />
          ) : filteredInstances && filteredInstances.length > 0 ? (
            filteredInstances.map((instance, index) => (
              <div
                key={instance.id}
                className={`group grid grid-cols-[1fr_1.5fr_0.7fr_0.7fr_100px] items-center gap-2 bg-[#141414] px-4 py-3 transition-colors duration-150 hover:bg-white/4 cursor-pointer ${index === 0 ? "rounded-t-lg" : ""} ${index === filteredInstances.length - 1 ? "rounded-b-lg" : ""}`}
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setSelectedInstance(instance)}
              >
                {/* Name + accent dot + active badge */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full bg-linear-to-r ${getGradient(instance.name)}`}
                  />
                  <span className="truncate text-sm font-medium text-white/90">
                    {instance.name}
                  </span>
                  {activeInstanceId === instance.id && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-400/70">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                      Active
                    </span>
                  )}
                </div>

                {/* Description */}
                <span className="truncate text-[11px] text-muted-foreground/40">
                  {instance.description || (
                    <span className="italic text-muted-foreground/25">
                      No description
                    </span>
                  )}
                </span>

                {/* Created */}
                <span className="text-[11px] tabular-nums text-muted-foreground/35">
                  {formatDistanceToNow(instance.created_at)}
                </span>

                {/* Updated */}
                <span className="text-[11px] tabular-nums text-muted-foreground/35">
                  {formatDistanceToNow(instance.updated_at)}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-muted-foreground/50 opacity-0 transition-all duration-150 hover:bg-white/6 hover:text-white group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-25 disabled:pointer-events-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveInstance(instance.id, instance.name);
                    }}
                    disabled={activeInstanceId === instance.id}
                  >
                    {activeInstanceId === instance.id ? (
                      <Check className="h-3 w-3" strokeWidth={1.5} />
                    ) : (
                      "Set Active"
                    )}
                  </button>
                  <Link
                    href={`/knowledge-bases?instance=${instance.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/30 opacity-0 transition-all duration-150 hover:bg-white/6 hover:text-muted-foreground group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/4">
                <Server
                  className="h-4 w-4 text-muted-foreground/40"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                No instances found
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground/40">
                Get started by creating your first instance.
              </p>
              <button
                onClick={() => setCreateOpen(true)}
                className="mt-3 text-xs text-primary transition-colors hover:text-primary/80"
              >
                Create your first instance →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs & Sheets */}
      <CreateInstanceDialog open={createOpen} onOpenChange={setCreateOpen} />
      <InstanceDetailSheet
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </div>
  );
}
