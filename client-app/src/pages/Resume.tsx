import { useEffect, useState } from "react";
import { fetchAPI } from "../functions/api";

interface ResumeImage {
  id: number;
  url: string;
  description: string | null;
}

export default function Resume() {
  const [images, setImages] = useState<ResumeImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await fetchAPI<ResumeImage[]>("/resume");
        setImages(data);
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, []);

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "resume.png";
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading resume...
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Resume coming soon!</h1>
        <p className="text-gray-300">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">My Resume</h1>

      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => handleDownload(img.url)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
          >
            Download Resume
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.description || `Resume page ${img.id}`}
            className="w-full md:w-80 lg:w-96 xl:w-[500px] object-contain rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
