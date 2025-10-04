import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAPI } from "../functions/api";

interface BlogImage {
  id: number;
  url: string;
}

type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; isMain?: boolean };

interface Blog {
  id: number;
  title: string;
  blocks: BlogBlock[];
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

        {/* Render blocks */}
        <div className="mt-6 space-y-6">
          {blog.blocks.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-lg leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "image") {
              return (
                <img
                  key={i}
                  src={block.url}
                  alt={`Blog image ${i + 1}`}
                  className={`w-full rounded-lg ${
                    block.isMain ? "border-4 border-yellow-400" : ""
                  }`}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
