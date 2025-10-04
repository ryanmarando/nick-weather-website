import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAPI } from "../functions/api";

interface BlogImage {
  id: number;
  url: string;
}

interface BlogBlock {
  type: "paragraph" | "image";
  text?: string;
  url?: string;
  isMain?: boolean;
}

interface Blog {
  id: number;
  title: string;
  content?: string;
  images?: BlogImage[];
  blocks?: BlogBlock[] | null;
  author?: string;
  createdAt?: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI<{ blogs: Blog[] }>("/blog");
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (err: any) {
        setError(err.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Nick Dunn&apos;s Blogs
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        {blogs.map((blog) => {
          const blocks = blog.blocks ?? [];

          // Determine main image
          const mainImage =
            blocks.find((b) => b.type === "image" && b.isMain)?.url ||
            blocks.find((b) => b.type === "image")?.url ||
            blog.images?.[0]?.url;

          // Determine preview text
          const previewText =
            blocks
              .filter((b) => b.type === "paragraph" && b.text)
              .map((b) => b.text)
              .join(" ") ||
            blog.content ||
            "";

          return (
            <Link
              to={`/blog/${blog.id}`}
              key={blog.id}
              className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
            >
              {mainImage && (
                <img
                  src={mainImage}
                  alt={blog.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-400 line-clamp-2">{previewText}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
