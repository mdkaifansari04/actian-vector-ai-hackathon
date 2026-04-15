"use client";

import { useState } from "react";
import {
  Plus,
  Command,
  ChevronDown,
  Server,
  Database,
  FileText,
  Settings2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppContext } from "@/lib/context";
import { ContextSwitcher } from "@/components/context-switcher";
import { CreateInstanceDialog } from "@/components/dialogs/create-instance-dialog";
import { CreateKnowledgeBaseDialog } from "@/components/dialogs/create-kb-dialog";
import { CommandPalette } from "@/components/command-palette";

export function TopBar() {
  const { activeInstanceName, activeNamespaceId, activeKbId, hasContext } =
    useAppContext();
  const [contextOpen, setContextOpen] = useState(false);
  const [createInstanceOpen, setCreateInstanceOpen] = useState(false);
  const [createKbOpen, setCreateKbOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-white/6 bg-[#0d0d0d]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-[#0d0d0d]/60">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 h-7 w-7 text-muted-foreground/50 hover:text-white" />

          {/* Context Chip */}
          <Popover open={contextOpen} onOpenChange={setContextOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-7 items-center gap-2 rounded-md border border-dashed border-white/10 bg-white/2 px-2.5 text-xs transition-colors hover:border-white/15 hover:bg-white/4">
                {hasContext ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                        {activeInstanceName}
                      </span>
                      <span className="text-muted-foreground/30">/</span>
                      <span className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {activeNamespaceId}
                      </span>
                      {activeKbId && (
                        <>
                          <span className="text-muted-foreground/30">/</span>
                          <span className="rounded border border-white/8 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                            KB
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown
                      className="h-3 w-3 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                  </>
                ) : (
                  <>
                    <Settings2
                      className="h-3 w-3 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                    <span className="text-muted-foreground/60">
                      Set Context
                    </span>
                    <ChevronDown
                      className="h-3 w-3 text-muted-foreground/30"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 rounded-lg border-white/8 bg-[#1a1a1a] p-0"
              align="start"
            >
              <ContextSwitcher onClose={() => setContextOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Command Palette Trigger */}
          <button
            className="flex h-7 items-center gap-1.5 rounded-md border border-white/6 bg-white/3 px-2.5 text-xs text-muted-foreground/50 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Command className="h-3 w-3" strokeWidth={1.5} />
            <span className="hidden sm:inline">Command</span>
            <kbd className="pointer-events-none ml-1 hidden h-4 select-none items-center rounded border border-white/8 bg-white/5 px-1 font-mono text-[9px] text-muted-foreground/40 sm:flex">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </button>

          {/* Quick Create Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Create</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-lg border-white/8 bg-[#1a1a1a] p-1"
            >
              <DropdownMenuItem
                onClick={() => setCreateInstanceOpen(true)}
                className="gap-2 rounded-md px-2.5 py-1.5 text-xs"
              >
                <Server
                  className="h-3 w-3 text-muted-foreground/50"
                  strokeWidth={1.5}
                />
                Create Instance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCreateKbOpen(true)}
                className="gap-2 rounded-md px-2.5 py-1.5 text-xs"
              >
                <Database
                  className="h-3 w-3 text-muted-foreground/50"
                  strokeWidth={1.5}
                />
                Create Knowledge Base
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-white/6" />
              <DropdownMenuItem
                asChild
                className="gap-2 rounded-md px-2.5 py-1.5 text-xs"
              >
                <a href="/resources">
                  <FileText
                    className="h-3 w-3 text-muted-foreground/50"
                    strokeWidth={1.5}
                  />
                  Add Resource
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dialogs */}
      <CreateInstanceDialog
        open={createInstanceOpen}
        onOpenChange={setCreateInstanceOpen}
      />
      <CreateKnowledgeBaseDialog
        open={createKbOpen}
        onOpenChange={setCreateKbOpen}
      />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
