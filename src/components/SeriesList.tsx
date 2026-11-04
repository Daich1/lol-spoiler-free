"use client";

import { useEffect, useState } from "react";
import { Series } from "@/types";
import SeriesCard from "./SeriesCard";

export default function SeriesList() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((res) => {
        if (!res.ok) throw new Error("取得に失敗しました");
        return res.json();
      })
      .then((data) => {
        setSeriesList(data.series);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-gray-400">動画を読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg">エラー: {error}</p>
        <p className="text-gray-500 mt-2">
          YouTube APIキーが正しく設定されているか確認してください。
        </p>
      </div>
    );
  }

  if (seriesList.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">シリーズが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {seriesList.map((series) => (
        <SeriesCard key={series.id} series={series} />
      ))}
    </div>
  );
}
