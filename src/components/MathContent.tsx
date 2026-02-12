'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

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

    // دالة عامة لمعالجة النصوص واستبدال الأنماط
    const processTextNodes = (regex: RegExp, displayMode: boolean) => {
      if (!contentRef.current) return;
      
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      );

      const nodesToReplace: { node: Node; matches: RegExpMatchArray[] }[] = [];
      let currentNode: Node | null;

      while ((currentNode = walker.nextNode())) {
        // تجاهل العقد التي هي بالفعل داخل math-inline أو math-block
        if (currentNode.parentElement?.closest('.math-inline, .math-block')) continue;

        const text = currentNode.textContent || '';
        const matches = Array.from(text.matchAll(regex));
        
        if (matches.length > 0) {
          nodesToReplace.push({ node: currentNode, matches });
        }
      }

      nodesToReplace.forEach(({ node, matches }) => {
        if (!node.parentNode) return;

        const text = node.textContent || '';
        const parts: (string | HTMLElement)[] = [];
        let lastIndex = 0;

        matches.forEach((match) => {
          const fullMatch = match[0];
          const mathContent = match[1]; // المحتوى دائمًا في المجموعة الأولى
          const index = match.index || 0;

          if (index > lastIndex) {
            parts.push(text.substring(lastIndex, index));
          }

          const wrapper = document.createElement(displayMode ? 'div' : 'span');
          wrapper.className = displayMode ? 'math-block text-center my-4' : 'math-inline';
          
          try {
            katex.render(mathContent, wrapper, {
              throwOnError: false,
              displayMode: displayMode,
            });
            parts.push(wrapper);
          } catch (error) {
            console.error('KaTeX error:', error);
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
    
    // LaTeX Display: $$...$$ and \[...\]
    processTextNodes(/\$\$([\s\S]*?)\$\$/g, true);
    processTextNodes(/\\\[([\s\S]*?)\\\]/g, true);
    
    // LaTeX Inline: \(...\)
    processTextNodes(/\\\(([\s\S]*?)\\\)/g, false);

    // LaTeX Inline: $...$
    processTextNodes(/\$([\s\S]*?)\$/g, false);

    // LaTeX Environment: \begin{equation}...\end{equation}
    processTextNodes(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, true);
    
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={cn("prose prose-sm max-w-none dark:prose-invert math-content-rtl", className)}
      dir="auto"
    />
  );
}
