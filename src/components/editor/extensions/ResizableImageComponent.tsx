'use client';

import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function ResizableImageComponent({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const [width, setWidth] = useState<number | string>(node.attrs.width || 'auto');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const [resizing, setResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  useEffect(() => {
    setWidth(node.attrs.width || 'auto');
  }, [node.attrs.width]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current || !editor.isEditable) return;
    e.preventDefault();
    setResizing(true);
    setStartX(e.clientX);
    setStartWidth(imgRef.current.offsetWidth);
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    const newWidth = Math.max(50, startWidth + diff); // Minimum 50px
    setWidth(newWidth);
  }, [resizing, startX, startWidth]);

  const onMouseUp = useCallback(() => {
    if (resizing) {
      setResizing(false);
      updateAttributes({ width: width });
    }
  }, [resizing, width, updateAttributes]);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing, onMouseMove, onMouseUp]);

  return (
    <NodeViewWrapper as="span" className={cn("inline-block relative leading-none transition-all", selected && "outline outline-2 outline-primary rounded-sm")}>
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: 'auto', maxWidth: '100%' }}
        className="block"
      />
      {editor.isEditable && selected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-primary border border-white rounded-full cursor-nwse-resize z-10 translate-x-1/2 translate-y-1/2 shadow-sm hover:scale-125 transition-transform"
          onMouseDown={onMouseDown}
        />
      )}
    </NodeViewWrapper>
  );
}