'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface MathPreviewBoxProps {
  content: string;
}

/**
 * مربع معاينة مباشرة لعرض المحتوى مع الرموز الرياضية المُعرّضة
 */
export default function MathPreviewBox({ content }: MathPreviewBoxProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current || !content) return;

    // تحديث المحتوى
    previewRef.current.innerHTML = content;

    // معالجة LaTeX inline: \( ... \)
    const processInlineMath = () => {
      if (!previewRef.current) return;
      
      const walker = document.createTreeWalker(
        previewRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      const nodesToReplace: { node: Node; matches: RegExpMatchArray[] }[] = [];
      let currentNode: Node | null;

      while ((currentNode = walker.nextNode())) {
        const text = currentNode.textContent || '';
        const inlineMatches = Array.from(text.matchAll(/\\\((.*?)\\\)/g));
        
        if (inlineMatches.length > 0) {
          nodesToReplace.push({ node: currentNode, matches: inlineMatches });
        }
      }

      nodesToReplace.forEach(({ node, matches }) => {
        if (!node.parentNode) return;

        const text = node.textContent || '';
        const parts: (string | HTMLElement)[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const mathContent = match[1];
          const index = match.index || 0;

          if (index > lastIndex) {
            parts.push(text.substring(lastIndex, index));
          }

          const span = document.createElement('span');
          span.className = 'math-inline';
          try {
            katex.render(mathContent, span, {
              throwOnError: false,
              displayMode: false,
            });
            parts.push(span);
          } catch (error) {
            console.error('KaTeX inline error:', error);
            parts.push(fullMatch);
          }

          lastIndex = index + fullMatch.length;
        });

        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }

        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (typeof part === 'string') {
            fragment.appendChild(document.createTextNode(part));
          } else {
            fragment.appendChild(part);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      });
    };

    // معالجة LaTeX block: $$ ... $$
    const processBlockMath = () => {
      if (!previewRef.current) return;
      
      const walker = document.createTreeWalker(
        previewRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      const nodesToReplace: { node: Node; matches: RegExpMatchArray[] }[] = [];
      let currentNode: Node | null;

      while ((currentNode = walker.nextNode())) {
        const text = currentNode.textContent || '';
        const blockMatches = Array.from(text.matchAll(/\$\$(.*?)\$\$/g));
        
        if (blockMatches.length > 0) {
          nodesToReplace.push({ node: currentNode, matches: blockMatches });
        }
      }

      nodesToReplace.forEach(({ node, matches }) => {
        if (!node.parentNode) return;

        const text = node.textContent || '';
        const parts: (string | HTMLElement)[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const mathContent = match[1];
          const index = match.index || 0;

          if (index > lastIndex) {
            parts.push(text.substring(lastIndex, index));
          }

          const div = document.createElement('div');
          div.className = 'math-block text-center my-4';
          try {
            katex.render(mathContent, div, {
              throwOnError: false,
              displayMode: true,
            });
            parts.push(div);
          } catch (error) {
            console.error('KaTeX block error:', error);
            parts.push(fullMatch);
          }

          lastIndex = index + fullMatch.length;
        });

        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }

        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (typeof part === 'string') {
            fragment.appendChild(document.createTextNode(part));
          } else {
            fragment.appendChild(part);
          }
        });

        node.parentNode.replaceChild(fragment, node);
      });
    };

    processBlockMath();
    processInlineMath();
  }, [content]);

  if (!content || content.trim() === '' || content === '<p></p>') {
    return null;
  }

  return (
    <Card className="mt-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Eye className="h-4 w-4" />
          المعاينة (كما سيراها الطالب)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={previewRef}
          className="prose prose-sm max-w-none math-content-rtl"
        />
      </CardContent>
    </Card>
  );
}
