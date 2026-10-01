'use client';

import React from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
}

export default function ChatMessageContent({ content }: ChatMessageContentProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to sanitize LaTeX math syntax (e.g. \[ n! = ... \] or \text{...}) into clean text
  const cleanLatex = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
        return math
          .replace(/\\begin\{cases\}[\s\S]*?\\end\{cases\}/g, (c: string) =>
            c
              .replace(/\\begin\{cases\}|\\end\{cases\}/g, '')
              .replace(/\\text\{([^}]+)\}/g, '$1')
              .replace(/\\\\/g, ' | ')
              .replace(/&/g, ' ')
          )
          .replace(/\\text\{([^}]+)\}/g, '$1')
          .replace(/\\times/g, '×')
          .replace(/\\le/g, '≤')
          .replace(/\\ge/g, '≥');
      })
      .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\times/g, '×')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥');
  };

  // Helper to render inline markdown: bold (**text**), inline code (`code`), and <br> breaks
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return null;
    const sanitized = cleanLatex(text);

    // Split by <br>, <br/>, <br />
    const brParts = sanitized.split(/(<br\s*\/?>)/gi);

    return brParts.map((part, bIdx) => {
      if (/^<br\s*\/?>$/i.test(part)) {
        return <br key={`br-${bIdx}`} />;
      }

      // Split by bold (**text**) and code (`code`)
      const parts = part.split(/(\*\*.*?\*\*|`.*?`)/g);

      return (
        <React.Fragment key={bIdx}>
          {parts.map((p, idx) => {
            if (p.startsWith('**') && p.endsWith('**') && p.length >= 4) {
              return (
                <strong key={idx} className="font-bold text-white">
                  {p.slice(2, -2)}
                </strong>
              );
            }
            if (p.startsWith('`') && p.endsWith('`') && p.length >= 2) {
              return (
                <code
                  key={idx}
                  className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-white/10"
                >
                  {p.slice(1, -1)}
                </code>
              );
            }
            return p;
          })}
        </React.Fragment>
      );
    });
  };

  // Process raw text block into paragraphs, headers, tables, code blocks, lists
  const renderFormattedText = (rawText: string) => {
    // 1. Split text by fenced code blocks ```...```
    const codeSplit = rawText.split(/(```[\s\S]*?```)/g);

    return codeSplit.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Fenced Code Block
        const firstLineEnd = part.indexOf('\n');
        let language = 'python';
        let codeContent = '';

        if (firstLineEnd !== -1) {
          language = part.substring(3, firstLineEnd).trim() || 'code';
          codeContent = part.substring(firstLineEnd + 1, part.length - 3).trim();
        } else {
          codeContent = part.substring(3, part.length - 3).trim();
        }

        return (
          <div key={pIdx} className="my-3 rounded-2xl border border-white/10 bg-[#060a12] overflow-hidden text-xs shadow-xl">
            <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-white/10 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase tracking-wider">
                <Code2 className="h-3.5 w-3.5" /> {language}
              </span>
              <button
                onClick={() => handleCopyCode(codeContent, pIdx)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg"
              >
                {copiedIndex === pIdx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 font-mono text-slate-200 overflow-x-auto leading-relaxed text-[11.5px] bg-[#070d19]">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // 2. Parse non-code section line-by-line and group table lines
      const lines = part.split('\n');
      const elements: React.ReactNode[] = [];

      let i = 0;
      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for Markdown Table (lines starting with |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
          const tableLines: string[] = [];
          while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
            tableLines.push(lines[i].trim());
            i++;
          }

          if (tableLines.length >= 2) {
            // Parse table lines into headers and rows
            const parseRow = (rStr: string) =>
              rStr
                .split('|')
                .slice(1, -1)
                .map((c) => c.trim());

            const headers = parseRow(tableLines[0]);
            // Skip index 1 if it's the divider row (e.g. |---|---|)
            const isDivider = (rStr: string) => /^[|\s-:]+$/.test(rStr);
            const startIndex = isDivider(tableLines[1]) ? 2 : 1;
            const rows = tableLines.slice(startIndex).map(parseRow);

            elements.push(
              <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/90 p-1 shadow-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-cyan-400 font-bold border-b border-white/10 text-[11px] uppercase tracking-wider">
                    <tr>
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 font-semibold">
                          {renderInlineMarkdown(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/5 transition-colors odd:bg-white/[0.02]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 align-top leading-relaxed text-slate-200">
                            {renderInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            continue;
          }
        }

        if (!trimmed) {
          elements.push(<div key={`blank-${i}`} className="h-1" />);
          i++;
          continue;
        }

        // Horizontal rules (---)
        if (trimmed === '---' || trimmed === '***') {
          elements.push(<hr key={`hr-${i}`} className="my-3 border-white/10" />);
          i++;
          continue;
        }

        // Markdown Headings (# ## ###)
        if (trimmed.startsWith('# ')) {
          elements.push(
            <h2 key={`h2-${i}`} className="text-base font-bold text-cyan-300 mt-3 mb-1">
              {renderInlineMarkdown(trimmed.replace('# ', ''))}
            </h2>
          );
          i++;
          continue;
        }
        if (trimmed.startsWith('## ')) {
          elements.push(
            <h3 key={`h3-${i}`} className="text-sm font-bold text-white mt-2 mb-1">
              {renderInlineMarkdown(trimmed.replace('## ', ''))}
            </h3>
          );
          i++;
          continue;
        }
        if (trimmed.startsWith('### ')) {
          elements.push(
            <h4 key={`h4-${i}`} className="text-xs font-bold text-cyan-400 mt-2 mb-1">
              {renderInlineMarkdown(trimmed.replace('### ', ''))}
            </h4>
          );
          i++;
          continue;
        }

        // Bullet Lists (- or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          elements.push(
            <div key={`list-${i}`} className="flex items-start gap-2 text-xs text-slate-200 pl-2 my-0.5">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>{renderInlineMarkdown(itemText)}</span>
            </div>
          );
          i++;
          continue;
        }

        // Numbered Lists (1. 2. 3.)
        if (/^\d+\.\s/.test(trimmed)) {
          elements.push(
            <div key={`nlist-${i}`} className="flex items-start gap-2 text-xs text-slate-200 pl-2 my-0.5">
              <span className="text-cyan-400 font-bold">{trimmed.split('.')[0]}.</span>
              <span>{renderInlineMarkdown(trimmed.replace(/^\d+\.\s/, ''))}</span>
            </div>
          );
          i++;
          continue;
        }

        // Blockquotes (>)
        if (trimmed.startsWith('> ')) {
          elements.push(
            <div key={`bq-${i}`} className="my-2 rounded-xl border-l-2 border-cyan-400 bg-cyan-950/20 px-3.5 py-2 text-xs text-cyan-200 italic">
              {renderInlineMarkdown(trimmed.replace('> ', ''))}
            </div>
          );
          i++;
          continue;
        }

        // Standard Paragraph
        elements.push(
          <p key={`p-${i}`} className="text-xs text-slate-200 leading-relaxed my-0.5">
            {renderInlineMarkdown(line)}
          </p>
        );
        i++;
      }

      return (
        <div key={pIdx} className="space-y-1">
          {elements}
        </div>
      );
    });
  };

  return <div className="space-y-1">{renderFormattedText(content)}</div>;
}
