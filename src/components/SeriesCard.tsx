"use client";

import { useState } from "react";
import { Series } from "@/types";
import GameSlot from "./GameSlot";

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(series.latestPublishedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="text-white">{series.team1}</span>
            <span className="text-gray-500">vs</span>
            <span className="text-white">{series.team2}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
            Bo{series.bestOf}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-gray-400">{series.tournament}</div>
            <div className="text-xs text-gray-500">{date}</div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {series.games.map((game, i) => (
            <GameSlot key={i} game={game} gameNumber={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
