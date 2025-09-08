import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchAPI<{ blog: Blog }>(`/blog/${id}`);
        setBlog(data.blog);
      } catch (err: any) {
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadBlog();
  }, [id]);

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-blue-400 hover:underline">
          ← Back to Blogs
        </Link>

        <h1 className="text-3xl font-bold mt-4">{blog.title}</h1>

        <p className="text-gray-400 text-sm mt-1">
          By {blog.author || "Nick Dunn"} •{" "}
          {blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString()
            : "Date unknown"}
        </p>

        {blog.images?.[0] && (
          <img
            src={blog.images[0].url}
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-lg mt-4"
          />
        )}

        <div className="mt-6 text-lg leading-relaxed">{blog.content}</div>
      </div>
    </div>
  );
}
