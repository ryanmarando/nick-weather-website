import { useEffect, useState } from "react";
import { fetchAPI } from "../functions/api";

interface YouTubeVideo {
  id: number;
  url: string;
  title: string;
  onFrontpage: boolean;
}

export default function Broadcasting() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI<YouTubeVideo[]>("/youtube");

        // Filter to only include videos NOT on the front page
        const filteredVideos = data.filter((v) => v.onFrontpage === false);

        setVideos(filteredVideos);
      } catch (err: any) {
        setError(err.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  // helper to extract YouTube embed ID from url
  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Image */}
      <div className="relative w-full h-[400px]">
        <img
          src="/images/broadcasting-hero.png"
          alt="Broadcasting"
          className="w-full h-full object-cover object-top"
        />

        {/* Overlay text + seal */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 bg-white text-black px-4 py-2 rounded-lg shadow-lg">
          <span className="font-semibold text-lg">Nick Dunn</span>
          <img
            src="/images/nwa-seal.jpg"
            alt="NWA Broadcast Seal"
            className="w-10 h-10 object-contain"
          />
          <img
            src="/images/nwa-digital-seal.png"
            alt="NWA Digital Seal"
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold">Broadcasting</h1>
        <p className="text-gray-400 mt-2">
          A showcase of live broadcasts and media appearances.
        </p>
      </div>

      {/* Videos Section */}
      <div className="max-w-6xl mx-auto px-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {loading && <p>Loading videos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
          >
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(video.url)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Images */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold">Graphics empowered for TV</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 place-items-center">
        <img
          src="/images/graphic1.jpeg"
          alt="Graphic 1"
          className="h-48 object-contain"
        />
        <img
          src="/images/graphic2.jpeg"
          alt="Graphic 2"
          className="h-48 object-contain"
        />
        <img
          src="/images/graphic3.jpeg"
          alt="Graphic 3"
          className="h-48 object-contain"
        />
        <img
          src="/images/graphic4.jpeg"
          alt="Graphic 4"
          className="h-48 object-contain"
        />
      </div>
    </div>
  );
}
