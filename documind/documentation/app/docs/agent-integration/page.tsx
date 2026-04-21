import { readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { DocsLayout } from '@/components/docs/docs-layout';
import { CommandBlock, MultiCommandBlock } from '@/components/docs/command-block';
import { FileText, Info } from 'lucide-react';

const quickStartPrompt = `Use dcli-documind skill.

Follow this policy:
1) Use DCLI as the primary DocuMind toolchain.
2) Add --bot=true for all dcli calls.
3) Use a project-scoped --context-id (for example: repo folder slug).
4) For knowledge questions: run search-docs first, then ask-docs if synthesis is needed.
5) If a dcli command returns status=error, stop and repair context using:
   context-show -> instances -> namespaces -> context-set -> retry once.
6) Do not silently fallback to MCP documind.* tools unless user asks MCP-only.

Now run:
dcli context-show --context-id "<project_context_id>" --bot=true`;

const installCommands = [
  'mkdir -p ~/.codex/skills/dcli-documind',
  'cp ./docs/codex-skills/dcli/SKILL.md ~/.codex/skills/dcli-documind/SKILL.md',
];

const fallbackSkillContent = `# dcli-documind SKILL.md

Unable to load source file at runtime.

Expected source path:
docs/codex-skills/dcli/SKILL.md`;

async function loadSkillMarkdown(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), '../../docs/codex-skills/dcli/SKILL.md'),
    path.resolve(process.cwd(), '../docs/codex-skills/dcli/SKILL.md'),
    path.resolve(process.cwd(), 'docs/codex-skills/dcli/SKILL.md'),
  ];

  for (const filePath of candidates) {
    try {
      return await readFile(filePath, 'utf8');
    } catch {
      // Try next candidate.
    }
  }

  return fallbackSkillContent;
}

export default async function AgentIntegrationPage() {
  const skillMarkdown = await loadSkillMarkdown();

  return (
    <DocsLayout
      pageId="agent-integration"
      title="Agent Integration"
      description="Copy-paste prompts and full SKILL.md template to integrate DocuMind DCLI into Codex-style agent workflows."
      breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Agent Integration' }]}
    >
      <section id="quick-start-prompt" className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Start Prompt</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Paste this directly into your agent conversation. It is optimized for immediate DCLI-first behavior.
        </p>

        <CommandBlock title="Copy-paste prompt" command={quickStartPrompt} />
      </section>

      <section id="skill-install" className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Skill Install</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          From repo root, copy the DCLI skill into your local Codex skills directory:
        </p>

        <MultiCommandBlock title="Install dcli-documind skill" commands={installCommands} />

        <div className="mt-6 p-4 rounded-lg bg-poof-mint/5 border border-poof-mint/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-poof-mint flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-poof-mint mb-1">Where this fits in the docs</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use this page for agent instructions and prompt templates. For command details, keep using the{' '}
                <Link href="/docs/dcli" className="text-primary underline underline-offset-4">
                  DCLI
                </Link>{' '}
                and{' '}
                <Link href="/docs/mcp-server" className="text-primary underline underline-offset-4">
                  MCP Server
                </Link>{' '}
                references.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="full-skill-md" className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-4">Full SKILL.md</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Expand the section below to view and copy the complete skill file.
        </p>

        <details className="rounded-xl border border-border bg-card overflow-hidden [&_summary::-webkit-details-marker]:hidden">
          <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2 text-foreground font-medium">
              <FileText className="w-4 h-4 text-primary" />
              Expand full dcli-documind SKILL.md
            </span>
            <span className="text-xs text-muted-foreground">Click to expand/collapse</span>
          </summary>
          <div className="p-5 border-t border-border bg-background/40">
            <CommandBlock command={skillMarkdown} />
            <p className="text-xs text-muted-foreground mt-3">
              Source path: <code className="font-mono">docs/codex-skills/dcli/SKILL.md</code>
            </p>
          </div>
        </details>
      </section>
    </DocsLayout>
  );
}
