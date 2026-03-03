'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

// Placeholder components for games - these will be moved to separate files later
const SortingGamePlaceholder = () => (
  <div className="text-center p-8">
    <p className="font-medium">لعبة الترتيب</p>
    <p className="text-sm text-muted-foreground">مكون اللعبة قيد التطوير</p>
  </div>
);

const MatchingGamePlaceholder = () => (
  <div className="text-center p-8">
    <p className="font-medium">لعبة المطابقة</p>
    <p className="text-sm text-muted-foreground">مكون اللعبة قيد التطوير</p>
  </div>
);

export interface GameConfig {
  type: 'sorting' | 'matching';
  data?: any;
  [key: string]: any;
}

interface GameRendererProps {
  config: GameConfig | null;
}

export function GameRenderer({ config }: GameRendererProps) {
  if (!config) {
    return null;
  }

  const renderGame = () => {
    switch (config.type) {
      case 'sorting':
        return <SortingGamePlaceholder />;
      case 'matching':
        return <MatchingGamePlaceholder />;
      default:
        return (
          <div className="text-center p-8 text-destructive">
            نوع اللعبة غير مدعوم: {config.type}
          </div>
        );
    }
  };

  return (
    <Card className="w-full my-8 border-2 border-primary/20 overflow-hidden">
      <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-2">
        <Gamepad2 className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-primary">نشاط تفاعلي</h3>
      </div>
      <CardContent className="p-0">
        <div className="min-h-[400px] bg-muted/10 flex flex-col items-center justify-center">
          {renderGame()}
        </div>
      </CardContent>
    </Card>
  );
}