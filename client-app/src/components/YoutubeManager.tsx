import { useEffect, useState } from "react";
import { fetchAuth, fetchAPI } from "../functions/api";

interface YoutubeVideo {
  id?: number;
  url: string;
  title: string;
  onFrontpage: boolean;
}

export default function YoutubeManager() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const allVideos: YoutubeVideo[] = await fetchAPI("/youtube");

        const frontpage = allVideos.find((v) => v.onFrontpage) || {
          title: "",
          url: "",
          onFrontpage: true,
        };

        const others = allVideos.filter((v) => !v.onFrontpage);

        const arranged = [frontpage, ...others.slice(0, 3)];

        setVideos(arranged);
      } catch (err) {
        console.error("Failed to load videos", err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handleChange = (
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    setVideos((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async (index: number) => {
    const video = videos[index];
    try {
      if (video.id) {
        // Update existing
        const updated: any = await fetchAuth(`/youtube/${video.id}`, token, {
          method: "PATCH",
          body: {
            title: video.title,
            url: video.url,
            onFrontpage: video.onFrontpage,
          },
        });
        setVideos((prev) =>
          prev.map((v, i) => (i === index ? updated.video : v))
        );
      } else {
        // Create new
        const created: any = await fetchAuth("/youtube", token, {
          method: "POST",
          body: {
            title: video.title,
            url: video.url,
            onFrontpage: video.onFrontpage,
          },
        });
        setVideos((prev) =>
          prev.map((v, i) => (i === index ? created.video : v))
        );
      }
      alert("Video saved successfully!");
    } catch (err: any) {
      console.error("Failed to save video", err);
      alert("Failed to save video: " + err.message);
    }
  };

  if (loading) return <p className="text-white">Loading videos...</p>;

  return (
    <div className="bg-gray-900 p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">YouTube Manager</h1>

      <div className="space-y-6">
        {videos.map((video, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold mb-2">
              {index === 0 ? "Home Page Video" : `Video ${index + 1}`}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={video.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              className="w-full p-2 mb-2 rounded bg-gray-700"
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={video.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              className="w-full p-2 mb-2 rounded bg-gray-700"
            />
            <button
              onClick={() => handleSave(index)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
