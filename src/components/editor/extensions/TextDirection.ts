import { Extension } from '@tiptap/core';

export interface TextDirectionOptions {
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (direction: 'ltr' | 'rtl' | 'auto') => ReturnType;
      unsetTextDirection: () => ReturnType;
    };
  }
}

export const TextDirection = Extension.create<TextDirectionOptions>({
  name: 'textDirection',

  addOptions() {
    return {
      types: ['heading', 'paragraph', 'bulletList', 'orderedList'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => element.getAttribute('dir'),
            renderHTML: (attributes) => {
              if (!attributes.dir) {
                return {};
              }
              return {
                dir: attributes.dir,
                style: `text-align: ${attributes.dir === 'rtl' ? 'right' : 'left'}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextDirection:
        (direction) =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { dir: direction })
          );
        },
      unsetTextDirection:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, 'dir')
          );
        },
    };
  },
});