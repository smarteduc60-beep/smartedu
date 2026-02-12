'use client';

import { useEffect, useRef, useState } from 'react';
import JXG from 'jsxgraph';
import { renderFromCommands, GeometryCommand } from '@/lib/geometry-interpreter';
import { Button } from '@/components/ui/button';
import { ImageDown, RefreshCw, FileText, BookOpen, X, Grid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InteractiveGeometryCanvasProps {
  commands: GeometryCommand[] | null;
  onInsertImage: (imageDataUrl: string) => void;
  onInsertToModelAnswer?: (imageDataUrl: string) => void;
  onReset: () => void;
  className?: string;
}

export default function InteractiveGeometryCanvas({
  commands,
  onInsertImage,
  onInsertToModelAnswer,
  onReset,
  className = '',
}: InteractiveGeometryCanvasProps) {
  const boardRef = useRef<JXG.Board | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showAxes, setShowAxes] = useState(true);

  useEffect(() => {
    // Cleanup previous board instance if it exists
    if (boardRef.current) {
      try {
        JXG.JSXGraph.freeBoard(boardRef.current);
      } catch (e) {
        console.warn("Error freeing board:", e);
      }
      boardRef.current = null; 
    }

    if (containerRef.current) {
      // Always initialize the board to show axes and grid
      boardRef.current = JXG.JSXGraph.initBoard(containerRef.current.id, {
        boundingbox: [-5, 5, 5, -5],
        axis: true,
        axis: showAxes,
        showCopyright: false,
        showNavigation: true,
        grid: true,
        grid: showAxes,
        keepAspectRatio: true,
      });
      
      // If there are commands, render them
      if (boardRef.current && commands && commands.length > 0) {
        renderFromCommands(boardRef.current, commands);
      }
    } else {
      console.error("Canvas container ref is not available.");
    }

    // Cleanup on unmount
    return () => {
      if (boardRef.current) {
        try {
          JXG.JSXGraph.freeBoard(boardRef.current);
        } catch (e) {
          console.warn("Error freeing board:", e);
        }
        boardRef.current = null; 
      }
    };
  }, [commands, showAxes]);

  const handleCaptureAndInsert = async (targetCallback: (url: string) => void, targetName: string) => {
    if (boardRef.current && containerRef.current) {
      const svgElement = containerRef.current.querySelector('svg');
      
      if (svgElement) {
        // Clone the SVG to avoid modifying the original displayed element
        const svgClone = svgElement.cloneNode(true) as SVGElement;

        // 1. Remove foreignObjects to prevent tainting (often used for HTML text/widgets in SVG)
        const foreignObjects = svgClone.querySelectorAll('foreignObject');
        foreignObjects.forEach(fo => fo.remove());

        // Find all images and convert their hrefs to data URLs to prevent tainting the canvas
        const images = Array.from(svgClone.querySelectorAll('image'));
        for (const image of images) {
          let href = image.getAttribute('href');
          if (!href) href = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href');

          if (href && !href.startsWith('data:')) {
            try {
              const response = await fetch(href);
              const blob = await response.blob();
              const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              image.setAttribute('href', dataUrl);
              image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
            } catch (e) {
              console.error(`Could not inline image from ${href}:`, e);
              // Remove the image if it fails to load to prevent tainting
              image.remove();
            }
          }
        }

        // Now that images are inlined, proceed with canvas conversion
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const width = (boardRef.current as any).canvasWidth || containerRef.current!.offsetWidth;
          const height = (boardRef.current as any).canvasHeight || containerRef.current!.offsetHeight;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL('image/png');
          targetCallback(pngDataUrl);
          URL.revokeObjectURL(url);
          toast({ title: 'تم الإدراج', description: 'تم إدراج الرسم الهندسي في محرر السؤال.' });
        };
        img.src = url;
      }
    } else {
      toast({
        title: 'خطأ',
        description: 'لا يوجد رسم لإدراجه.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        id="jxgbox" // JSXGraph needs a unique ID
        ref={containerRef}
        className="jxgbox w-full h-[400px] border rounded-lg bg-muted"
        style={{ direction: 'ltr' }} // Ensure LTR for the canvas
      />
      <div className="flex gap-2">
        {/* التحقق من وجود الدالة قبل عرض الزر لضمان الاستقرار */}
        {typeof onInsertImage === 'function' && (
          <Button type="button" onClick={() => handleCaptureAndInsert(onInsertImage, 'السؤال')} variant="outline" disabled={!commands || commands.length === 0}>
            <FileText className="ml-2 h-4 w-4" />
            إدراج في السؤال
          </Button>
        )}
        {typeof onInsertToModelAnswer === 'function' && (
          <Button type="button" onClick={() => handleCaptureAndInsert(onInsertToModelAnswer, 'الإجابة النموذجية')} variant="outline" disabled={!commands || commands.length === 0}>
            <BookOpen className="ml-2 h-4 w-4" />
            إدراج في الحل
          </Button>
        )}
        <Button type="button" onClick={() => setShowAxes(!showAxes)} variant="outline" title={showAxes ? "إخفاء المعلم" : "إظهار المعلم"}>
          <Grid className="h-4 w-4" />
          <span className="sr-only">{showAxes ? "إخفاء المعلم" : "إظهار المعلم"}</span>
        </Button>
        <Button type="button" onClick={onReset} variant="destructive" disabled={!commands || commands.length === 0}>
          <X className="ml-2 h-4 w-4" />
          حذف الرسم
        </Button>
      </div>
    </div>
  );
}