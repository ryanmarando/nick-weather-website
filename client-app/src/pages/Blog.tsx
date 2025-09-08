import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAPI } from "../functions/api";

interface BlogImage {
  id: number;
  url: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  images: BlogImage[];
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
        setBlogs(data.blogs);
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
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog.id}`}
            key={blog.id}
            className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
          >
            {/* Thumbnail */}
            {blog.images?.[0] && (
              <img
                src={blog.images[0].url}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}

            {/* Blog preview */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-400 line-clamp-2">{blog.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
