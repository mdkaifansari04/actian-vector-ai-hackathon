import { DocsLayout } from '@/components/docs/docs-layout';
import { components } from '@/lib/docs-data';
import { FileCode, Layers, Database, Activity, Terminal, Server } from 'lucide-react';

const componentIcons: Record<string, React.ReactNode> = {
  'DocuMind API': <FileCode className="w-5 h-5" />,
  'Runtime Container': <Layers className="w-5 h-5" />,
  'Retrieval Layer': <Database className="w-5 h-5" />,
  'Observability Layer': <Activity className="w-5 h-5" />,
  'DCLI Interface': <Terminal className="w-5 h-5" />,
  'MCP Server': <Server className="w-5 h-5" />,
};

const componentIds: Record<string, string> = {
  'DocuMind API': 'api',
  'Runtime Container': 'runtime',
  'Retrieval Layer': 'retrieval',
  'Observability Layer': 'observability',
  'DCLI Interface': 'dcli-component',
  'MCP Server': 'mcp-component',
};

export default function ComponentsPage() {
  return (
    <DocsLayout
      pageId="components"
      title="Components"
      description="The moving parts behind DocuMind, explained like you are reading the architecture with coffee in one hand and logs in the other."
      breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Components' }]}
    >
      <div className="space-y-8">
        {components.map((component) => (
          <section key={component.name} id={componentIds[component.name]} className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {componentIcons[component.name]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-foreground">{component.name}</h2>
                  <code className="text-xs font-mono text-muted-foreground bg-code-bg px-2 py-1 rounded">
                    {component.fileRef}
                  </code>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4">{component.description}</p>

                {component.name === 'DocuMind API' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Primary endpoint groups</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-poof-mint/10 text-poof-mint font-mono text-xs">System</span>
                        <code className="text-muted-foreground font-mono">/health, /collections</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">Control Plane</span>
                        <code className="text-muted-foreground font-mono">/instances, /knowledge-bases, /resources</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-poof-violet/10 text-poof-violet font-mono text-xs">Retrieval</span>
                        <code className="text-muted-foreground font-mono">/search, /query, /search/advanced, /query/advanced</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-poof-peach/10 text-poof-peach font-mono text-xs">Quality</span>
                        <code className="text-muted-foreground font-mono">/observability/scores, /observability/alerts</code>
                      </div>
                    </div>
                  </div>
                )}

                {component.name === 'Runtime Container' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Wired services</h4>
                    <div className="flex flex-wrap gap-2">
                      {['vectordb', 'store', 'routing', 'ingestion', 'retrieval', 'agent', 'observability'].map((svc) => (
                        <span key={svc} className="px-2 py-1 text-xs rounded bg-secondary text-muted-foreground font-mono">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {component.name === 'Retrieval Layer' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Retrieval modes</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">Semantic</span>
                      <span className="px-2 py-1 text-xs rounded bg-poof-violet/10 text-poof-violet">Hybrid + RRF</span>
                      <span className="px-2 py-1 text-xs rounded bg-poof-mint/10 text-poof-mint">Hybrid + DBSF</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      It also supports filters (`eq`, `any_of`, `between`, `gt/gte/lt/lte`, `text`) so you can scope retrieval without writing weird post-filter logic.
                    </p>
                  </div>
                )}

                {component.name === 'Observability Layer' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Scores we track</h4>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <p>Retrieval quality score (did we fetch the right chunks?)</p>
                      <p>Chunk relevance score (did those chunks actually answer the question?)</p>
                      <p>Hallucination rate (did answer claims stay grounded?)</p>
                    </div>
                  </div>
                )}

                {component.name === 'DCLI Interface' && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    DCLI is intentionally context-aware. You can set active context once and stop copy-pasting IDs into every command like it is 2016.
                  </p>
                )}

                {component.name === 'MCP Server' && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    MCP exposes the same power to AI clients, with guardrails for risky actions. The assistant gets tools, not unchecked admin access — on purpose.
                  </p>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  );
}
