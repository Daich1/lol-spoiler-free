"use client";

import { Video } from "@/types";

interface GameSlotProps {
  game: Video | null;
  gameNumber: number;
}

export default function GameSlot({ game, gameNumber }: GameSlotProps) {
  const baseClasses =
    "relative flex items-center gap-3 p-3 rounded-lg border transition-colors";

  if (game) {
    return (
      <a
        href={`https://www.youtube.com/watch?v=${game.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 cursor-pointer`}
      >
        <div className="relative w-32 h-18 flex-shrink-0 overflow-hidden rounded">
          <img
            src={game.thumbnailUrl}
            alt={`Game ${gameNumber}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg
              className="w-8 h-8 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-200">
            Game {gameNumber}
          </div>
          <div className="text-xs text-gray-400 mt-1">視聴可能</div>
        </div>
      </a>
    );
  }

  // 動画なし（見た目はほぼ同じ）
  return (
    <div
      className={`${baseClasses} border-gray-700 bg-gray-800/60 cursor-default`}
    >
      <div className="relative w-32 h-18 flex-shrink-0 overflow-hidden rounded bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-400">
          Game {gameNumber}
        </div>
        <div className="text-xs text-gray-500 mt-1">準備中...</div>
      </div>
    </div>
  );
}
