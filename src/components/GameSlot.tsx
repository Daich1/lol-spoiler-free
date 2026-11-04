"use client";

import { useState } from "react";
import { Video } from "@/types";

interface GameSlotProps {
  game: Video | null;
  gameNumber: number;
}

export default function GameSlot({ game, gameNumber }: GameSlotProps) {
  const [revealed, setRevealed] = useState(false);

  // 動画なしでクリック済み → 試合なし表示
  if (!game && revealed) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800/40">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 font-bold text-sm">{gameNumber}</span>
        </div>
        <div className="text-sm text-gray-500">
          この試合は行われませんでした
        </div>
      </div>
    );
  }

  // 動画あり・なし共通の見た目
  const handleClick = () => {
    if (game) {
      window.open(
        `https://www.youtube.com/watch?v=${game.videoId}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      setRevealed(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 transition-colors cursor-pointer text-left"
    >
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-300 font-bold text-sm">{gameNumber}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-200">
          Game {gameNumber}
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
