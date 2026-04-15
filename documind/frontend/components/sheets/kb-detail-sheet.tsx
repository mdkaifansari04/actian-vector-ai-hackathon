"use client";

import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppContext } from "@/lib/context";
import { formatDateTime } from "@/lib/format";
import type { KnowledgeBase } from "@/lib/types";

interface KnowledgeBaseDetailSheetProps {
  knowledgeBase: KnowledgeBase | null;
  onClose: () => void;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusClasses(status: KnowledgeBase["status"]) {
  if (status === "active") {
    return "border-emerald-400/20 text-emerald-400/70";
  }
  if (status === "inactive") {
    return "border-red-400/20 text-red-400/70";
  }
  return "border-amber-300/30 text-amber-200/80";
}

export function KnowledgeBaseDetailSheet({
  knowledgeBase,
  onClose,
}: KnowledgeBaseDetailSheetProps) {
  const { activeKbId, setActiveKb, activeInstanceId, activeNamespaceId } =
    useAppContext();

  const copyId = () => {
    if (knowledgeBase) {
      navigator.clipboard.writeText(knowledgeBase.id);
      toast.success("Knowledge Base ID copied to clipboard");
    }
  };

  const isActive = activeKbId === knowledgeBase?.id;
  const canSetActive =
    knowledgeBase &&
    activeInstanceId === knowledgeBase.instance_id &&
    activeNamespaceId === knowledgeBase.namespace_id;

  return (
    <Sheet open={!!knowledgeBase} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-lg border-white/6 bg-[#111] p-0 gap-0">
        {knowledgeBase && (
          <>
            <SheetHeader className="px-6 pt-6 pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <SheetTitle className="truncate text-sm font-medium text-white">
                    {knowledgeBase.name}
                  </SheetTitle>
                  <SheetDescription className="mt-1 truncate font-mono text-xs text-muted-foreground/50">
                    {knowledgeBase.namespace_id}
                  </SheetDescription>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border border-dashed px-2 py-0.5 text-[10px] ${getStatusClasses(
                      knowledgeBase.status,
                    )}`}
                  >
                    {titleCase(knowledgeBase.status)}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-emerald-400/20 px-2 py-0.5 text-[10px] text-emerald-400/70">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-0 px-6 pb-6">
              {canSetActive ? (
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/8 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-emerald-300/70">
                      {isActive
                        ? "This knowledge base is active for the current scope."
                        : "This knowledge base matches the current scope."}
                    </p>
                    <button
                      onClick={() =>
                        setActiveKb(isActive ? null : knowledgeBase.id)
                      }
                      className="flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-emerald-300/75 transition-colors hover:bg-emerald-300/12 hover:text-emerald-200"
                    >
                      {isActive ? (
                        <>
                          <Check className="h-3 w-3" strokeWidth={1.5} />
                          Unset
                        </>
                      ) : (
                        "Set Active"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-white/6 bg-black px-3 py-2.5">
                  <p className="text-[11px] text-muted-foreground/40">
                    Select matching instance and namespace in the top bar to set
                    this as the active knowledge base.
                  </p>
                </div>
              )}

              <div className="h-px bg-white/6 my-5" />

              <div className="space-y-4">
                <div className="rounded-xl border border-white/6 bg-black p-4">
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50">
                    Details
                  </h3>
                  <dl className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">ID</dt>
                      <dd className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-white/70">
                        <span className="truncate">
                          {knowledgeBase.id.slice(0, 8)}...
                        </span>
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/30 transition-colors hover:bg-white/6 hover:text-muted-foreground"
                          onClick={copyId}
                        >
                          <Copy className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Instance ID</dt>
                      <dd className="font-mono text-[11px] text-white/70">
                        {knowledgeBase.instance_id.slice(0, 8)}...
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Namespace</dt>
                      <dd className="max-w-[65%] truncate rounded-md border border-white/6 bg-white/3 px-2 py-0.5 font-mono text-[10px] text-white/65">
                        {knowledgeBase.namespace_id}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Collection</dt>
                      <dd className="max-w-[65%] truncate font-mono text-[11px] text-white/60">
                        {knowledgeBase.collection_name}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-white/6 bg-black p-4">
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50">
                    Embedding
                  </h3>
                  <dl className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Model</dt>
                      <dd className="max-w-[65%] truncate font-mono text-[11px] text-white/70">
                        {knowledgeBase.embedding_model}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Dimensions</dt>
                      <dd className="tabular-nums text-white/70">
                        {knowledgeBase.embedding_dim}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Distance</dt>
                      <dd className="capitalize text-white/70">
                        {knowledgeBase.distance_metric}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Profile</dt>
                      <dd className="max-w-[65%] truncate text-white/65">
                        {knowledgeBase.embedding_profile || "Not set"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-white/6 bg-black p-4">
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50">
                    LLM
                  </h3>
                  <dl className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Profile</dt>
                      <dd className="max-w-[65%] truncate text-white/65">
                        {knowledgeBase.llm_profile || "Not set"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-white/6 bg-black p-4">
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50">
                    Timestamps
                  </h3>
                  <dl className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Created</dt>
                      <dd className="tabular-nums text-white/70">
                        {formatDateTime(knowledgeBase.created_at)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground/40">Updated</dt>
                      <dd className="tabular-nums text-white/70">
                        {formatDateTime(knowledgeBase.updated_at)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
