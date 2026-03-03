'use client';

import React from 'react';
import { SortingGame, GameItem } from '../../../prisma/SortingGame';
import { IslandGame } from './IslandGame';

export type GameType = 'SORTING' | 'ISLAND';

export interface GameConfig {
  type: GameType;
  data: {
    items: GameItem[];
    direction?: 'asc' | 'desc';
  };
}

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

  switch (gameConfig.type) {
    case 'SORTING':
      return (
        <SortingGame 
          items={gameConfig.data.items} 
          direction={gameConfig.data.direction} 
        />
      );
    case 'ISLAND':
      return <IslandGame />;
    default:
      return (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg my-4">
          نوع اللعبة غير مدعوم: {gameConfig.type}
        </div>
      );
  }
}