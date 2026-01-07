'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MathComponent from './MathComponent';

// توسيع واجهة الأوامر لإضافة دعم TypeScript للأمر الجديد
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathLive: {
      /**
       * إدراج معادلة رياضية
       */
      setMathLive: (options?: { latex: string }) => ReturnType;
    };
  }
}

export const MathExtension = Node.create({
  name: 'mathLive',

  group: 'inline',

  inline: true,

  atom: true, // لا يمكن تقسيمها أو وضع المؤشر بداخلها (من وجهة نظر Tiptap)

  addAttributes() {
    return {
      latex: {
        default: '',
        // قراءة القيمة من الـ Attribute أو محتوى النص عند التحميل من HTML
        parseHTML: (element) => element.getAttribute('data-latex') || element.textContent,
        // تخزين القيمة في Attribute عند الحفظ
        renderHTML: (attributes) => {
          return {
            'data-latex': attributes.latex,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math-live"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    // الحفظ كعنصر span يحتوي على الكود لضمان إمكانية قراءته حتى بدون JS
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'math-live' }), node.attrs.latex];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent, {
      // منع Tiptap من اعتراض الأحداث (مثل الكتابة) داخل مكون MathLive
      stopEvent: ({ event }) => {
        return (event.target as HTMLElement).tagName?.toLowerCase() === 'math-field';
      },
    });
  },

  addCommands() {
    return {
      setMathLive:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'mathLive',
            attrs: options,
          });
        },
    };
  },
});