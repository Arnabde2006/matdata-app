import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceAttributionProps {
  source: string;
  sourceUrl: string;
  className?: string;
}

export function SourceAttribution({ source, sourceUrl, className = '' }: SourceAttributionProps) {
  if (!source) return null;

  return (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/40 w-fit ${className}`}>
      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
      <span>
        Data verified from:{' '}
        <span className="font-semibold text-foreground">{source}</span>
      </span>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary hover:underline font-medium transition-colors"
        >
          View Source
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
