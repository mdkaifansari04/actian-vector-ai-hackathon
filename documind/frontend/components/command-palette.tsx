'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Server,
  Database,
  FileText,
  Search,
  MessageCircleQuestion,
  MessagesSquare,
  HardDrive,
  Plus,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [createInstanceOpen, setCreateInstanceOpen] = useState(false)
  const [createKbOpen, setCreateKbOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/'))}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/instances'))}
            >
              <Server className="mr-2 h-4 w-4" />
              Instances
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/knowledge-bases'))}
            >
              <Database className="mr-2 h-4 w-4" />
              Knowledge Bases
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/resources'))}
            >
              <FileText className="mr-2 h-4 w-4" />
              Resources
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/search'))}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/ask'))}
            >
              <MessageCircleQuestion className="mr-2 h-4 w-4" />
              Ask
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/chat'))}
            >
              <MessagesSquare className="mr-2 h-4 w-4" />
              Chat Workspace
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/system'))}
            >
              <HardDrive className="mr-2 h-4 w-4" />
              Collections & System
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => runCommand(() => setCreateInstanceOpen(true))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Instance
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setCreateKbOpen(true))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Knowledge Base
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/resources'))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
