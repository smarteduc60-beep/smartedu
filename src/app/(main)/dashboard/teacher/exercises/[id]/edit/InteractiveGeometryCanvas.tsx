'use client';

import { useEffect, useRef } from 'react';
import { GeometryCommand, renderFromCommands } from '@/lib/geometry-interpreter';

interface InteractiveGeometryCanvasProps {
  commands: GeometryCommand[] | null;
  width?: number | string;
  height?: number | string;
}

export default function InteractiveGeometryCanvas({
  commands,
  width = '100%',
  height = 500
}: InteractiveGeometryCanvasProps) {
  // معرف فريد للوحة لتجنب التضارب في الصفحة
  const boxId = useRef(`jxgbox-${Math.random().toString(36).substr(2, 9)}`);
  const boardRef = useRef<any>(null);

  useEffect(() => {
    // التأكد من أن الكود يعمل فقط في المتصفح
    if (typeof window === 'undefined' || !document.getElementById(boxId.current)) return;

    // Dynamically import JSXGraph to avoid build/SSR issues
    import('jsxgraph').then((mod) => {
      const JXG = mod.default || mod;

      // تهيئة اللوحة (Board) إذا لم تكن مهيأة
      if (!boardRef.current) {
        boardRef.current = JXG.JSXGraph.initBoard(boxId.current, {
          boundingbox: [-2, 8, 12, -2], // إحداثيات افتراضية [left, top, right, bottom]
          axis: false, // إخفاء المحاور افتراضياً (يمكن تفعيلها حسب الحاجة)
          showCopyright: false,
          showNavigation: true, // أزرار التكبير والتصغير
          pan: { enabled: true },
          zoom: { enabled: true },
          resize: { enabled: true } 
        });
      }

      const board = boardRef.current;

      // تنظيف اللوحة وإعادة الرسم عند تغير الأوامر
      if (commands && Array.isArray(commands)) {
          JXG.JSXGraph.freeBoard(board);
          boardRef.current = JXG.JSXGraph.initBoard(boxId.current, {
              boundingbox: [-2, 8, 12, -2],
              axis: false,
              showCopyright: false,
              showNavigation: true
          });
          renderFromCommands(boardRef.current, commands);
      }
    });

  }, [commands]);

  return (
    <div 
      id={boxId.current} 
      className="jxgbox w-full border rounded-lg shadow-sm bg-white overflow-hidden"
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }} 
    />
  );
}