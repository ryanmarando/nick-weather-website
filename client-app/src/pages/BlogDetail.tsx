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
  blocks?: BlogBlock[] | null; // may be null for old blogs
  content?: string; // fallback for old blogs
  images?: BlogImage[];
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

  // Normalize blocks to always be an array
  const blocks: BlogBlock[] = blog.blocks ?? [];

  // For old blogs with no blocks, create a single paragraph block from content
  const displayBlocks =
    blocks.length > 0
      ? blocks
      : blog.content
      ? [{ type: "paragraph", text: blog.content }]
      : [];

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
          {displayBlocks.map((block, i) => {
            if (block.type === "paragraph") {
              return (
                <p key={i} className="text-lg leading-relaxed">
                  {block.text}
                </p>
              );
            }

            // Type guard for image blocks
            if (block.type === "image") {
              const imageBlock = block as {
                type: "image";
                url: string;
                isMain?: boolean;
              };
              return (
                <img
                  key={i}
                  src={imageBlock.url}
                  alt={`Blog image ${i + 1}`}
                  className={`w-full rounded-lg ${
                    imageBlock.isMain ? "border-4 border-yellow-400" : ""
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
