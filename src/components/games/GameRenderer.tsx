'use client';

import React from 'react';
import { IslandGame } from './IslandGame';
import FutureEngineerGame from './FutureEngineerGame';
import MatchingGame from './MatchingGame'; // Import the new MatchingGame component

const SortingGamePlaceholder = () => (
  <div className="text-center p-8">
    <p className="font-medium">لعبة الترتيب</p>
    <p className="text-sm text-muted-foreground">مكون اللعبة قيد التطوير</p>
  </div>
);

// Make GameConfig more flexible to accommodate different game types
export type GameConfig = {
  type: string;
  [key: string]: any;
};

interface GameRendererProps {
  config: any; // نستخدم any هنا لأن نوع Json من Prisma عام
}

export function GameRenderer({ config }: GameRendererProps) {
  if (!config || typeof config !== 'object') {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg my-4">
        <p className="text-gray-500">لا توجد إعدادات للعبة</p>
      </div>
    );
  }

  const gameConfig = config as GameConfig;

  // Use toUpperCase() for case-insensitive matching
  switch (gameConfig.type?.toUpperCase()) {
    case 'SORTING':
      return <SortingGamePlaceholder />;
    case 'ISLAND':
      return <IslandGame />;
    case 'FUTURE_ENGINEER':
      return <FutureEngineerGame gameConfig={gameConfig as any} />;
    case 'MATCHING_GAME':
      return <MatchingGame title={gameConfig.title} description={gameConfig.description} pairs={gameConfig.pairs} />;
    default:
      return (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg my-4">
          نوع اللعبة غير مدعوم: {gameConfig.type}
        </div>
      );
  }
}