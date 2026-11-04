import SeriesList from "@/components/SeriesList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">LoL Spoiler-Free Viewer</h1>
          <p className="text-gray-400 mt-1 text-sm">
            試合数のネタバレなしで動画を視聴できます
          </p>
        </header>
        <SeriesList />
      </div>
    </main>
  );
}
