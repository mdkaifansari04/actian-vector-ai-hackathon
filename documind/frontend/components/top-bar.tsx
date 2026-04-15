'use client'

import { useState } from 'react'
import {
  Plus,
  Command,
  ChevronDown,
  Server,
  Database,
  FileText,
  Settings2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAppContext } from '@/lib/context'
import { ContextSwitcher } from '@/components/context-switcher'
import { CreateInstanceDialog } from '@/components/dialogs/create-instance-dialog'
import { CreateKnowledgeBaseDialog } from '@/components/dialogs/create-kb-dialog'
import { CommandPalette } from '@/components/command-palette'

export function TopBar() {
  const { activeInstanceName, activeNamespaceId, activeKbId, hasContext } =
    useAppContext()
  const [contextOpen, setContextOpen] = useState(false)
  const [createInstanceOpen, setCreateInstanceOpen] = useState(false)
  const [createKbOpen, setCreateKbOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          
          {/* Context Chip */}
          <Popover open={contextOpen} onOpenChange={setContextOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-dashed"
              >
                {hasContext ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="h-5 rounded px-1.5 text-xs font-normal">
                        {activeInstanceName}
                      </Badge>
                      <span className="text-muted-foreground">/</span>
                      <Badge variant="secondary" className="h-5 rounded px-1.5 text-xs font-normal">
                        {activeNamespaceId}
                      </Badge>
                      {activeKbId && (
                        <>
                          <span className="text-muted-foreground">/</span>
                          <Badge variant="outline" className="h-5 rounded px-1.5 text-xs font-normal">
                            KB
                          </Badge>
                        </>
                      )}
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </>
                ) : (
                  <>
                    <Settings2 className="h-3.5 w-3.5" />
                    <span>Set Context</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <ContextSwitcher onClose={() => setContextOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Command</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Quick Create Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setCreateInstanceOpen(true)}>
                <Server className="mr-2 h-4 w-4" />
                Create Instance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateKbOpen(true)}>
                <Database className="mr-2 h-4 w-4" />
                Create Knowledge Base
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/resources">
                  <FileText className="mr-2 h-4 w-4" />
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
  )
}
