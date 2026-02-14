import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const AutoDirection = Extension.create({
  name: 'autoDirection',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('autoDirection'),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some(tr => tr.docChanged);
          if (!docChanged) return;

          // التحقق مما إذا كان التغيير في المحتوى النصي (كتابة/لصق) وليس مجرد تغيير تنسيق
          // هذا يسمح للمستخدم باستخدام الأزرار اليدوية لتغيير الاتجاه دون أن يقوم النظام بإلغاء ذلك فوراً
          const hasContentChange = transactions.some(tr => 
            tr.steps.some(step => 
               step.constructor.name === 'ReplaceStep' || step.constructor.name === 'ReplaceAroundStep'
            )
          );

          if (!hasContentChange) return;

          const { tr } = newState;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.isTextblock && node.textContent.length > 0) {
              // نتأكد أن العقدة تدعم خاصية الاتجاه (التي يضيفها TextDirection)
              if (typeof node.attrs.dir === 'undefined') return;

              const text = node.textContent.trim();
              if (!text) return;

              const firstChar = text[0];
              
              // نطاق الحروف العربية والعبرية (RTL)
              const isRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(firstChar);
              // نطاق الحروف اللاتينية (LTR)
              const isLTR = /^[A-Za-z]/.test(firstChar);
              
              if (!isRTL && !isLTR) return;

              const newDir = isRTL ? 'rtl' : 'ltr';
              
              // تحديث الاتجاه فقط إذا كان مختلفاً
              if (node.attrs.dir !== newDir) {
                tr.setNodeAttribute(pos, 'dir', newDir);
                modified = true;
              }
            }
          });

          if (modified) return tr;
        },
      }),
    ];
  },
});