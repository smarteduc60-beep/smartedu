'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathContentProps {
  content: string;
  className?: string;
}

/**
 * مكون لعرض المحتوى HTML مع دعم LaTeX/KaTeX
 * يعالج الصيغ الرياضية تلقائياً ويعرضها بشكل جميل
 */
export default function MathContent({ content, className = '' }: MathContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !content) return;

    // تحديث المحتوى
    contentRef.current.innerHTML = content;

    // 1. معالجة عناصر MathLive التي تم إنشاؤها بواسطة المحرر (Tiptap Extension)
    const processMathLiveElements = () => {
      if (!contentRef.current) return;

      // البحث عن العناصر التي تحمل السمة data-type="math-live"
      const mathElements = contentRef.current.querySelectorAll('span[data-type="math-live"]');
      
      mathElements.forEach((element) => {
        // الحصول على كود LaTeX من السمة data-latex أو من النص الداخلي
        const latex = element.getAttribute('data-latex') || element.textContent || '';
        
        if (latex) {
          try {
            const span = document.createElement('span');
            span.className = 'math-inline'; // تنسيق مشابه لـ inline math
            // الحفاظ على التنسيقات الأصلية إذا وجدت
            if (element.className) span.className += ` ${element.className}`;
            
            katex.render(latex, span, {
              throwOnError: false,
              displayMode: false, // افتراضياً inline
            });
            
            // استبدال العنصر الأصلي بالعنصر الذي تم تصييره بواسطة KaTeX
            element.replaceWith(span);
          } catch (error) {
            console.error('KaTeX render error for math-live element:', error);
          }
        }
      });
    };

    // معالجة LaTeX inline: \( ... \)
    const processInlineMath = () => {
      if (!contentRef.current) return;
      
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      const nodesToReplace: { node: Node; matches: RegExpMatchArray[] }[] = [];
      let currentNode: Node | null;

      // البحث عن جميع النصوص التي تحتوي على LaTeX
      while ((currentNode = walker.nextNode())) {
        const text = currentNode.textContent || '';
        const inlineMatches = Array.from(text.matchAll(/\\\((.*?)\\\)/g));
        
        if (inlineMatches.length > 0) {
          nodesToReplace.push({ node: currentNode, matches: inlineMatches });
        }
      }

      // استبدال LaTeX بـ KaTeX
      nodesToReplace.forEach(({ node, matches }) => {
        if (!node.parentNode) return;

        const text = node.textContent || '';
        const parts: (string | HTMLElement)[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const mathContent = match[1];
          const index = match.index || 0;

          // إضافة النص قبل الصيغة الرياضية
          if (index > lastIndex) {
            parts.push(text.substring(lastIndex, index));
          }

          // إنشاء عنصر للصيغة الرياضية
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

        // إضافة النص المتبقي
        if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
        }

        // استبدال العقدة الأصلية بالعقد الجديدة
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
      if (!contentRef.current) return;
      
      const walker = document.createTreeWalker(
        contentRef.current,
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

    // تنفيذ المعالجة
    processMathLiveElements(); // الأولوية للعناصر الصريحة من المحرر
    processBlockMath();
    processInlineMath();
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`prose prose-sm max-w-none math-content-rtl ${className}`}
    />
  );
}
