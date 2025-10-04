import { useEffect, useState } from "react";
import CreateBlog from "../components/CreateBlog";
import BlogManager from "../components/BlogManager";
import { fetchAPI } from "../functions/api";

interface BlogBlock {
  id?: number;
  type: "paragraph" | "image";
  text?: string;
  url?: string;
  isMain?: boolean;
}

interface BlogImage {
  id: number;
  url: string;
}

interface Blog {
  id: number;
  title: string;
  content?: string;
  images?: BlogImage[];
  blocks?: BlogBlock[];
  newImageUrls?: string[];
}

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI<{ blogs?: Blog[] }>("/blog");
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <CreateBlog onBlogCreated={loadBlogs} />
      <BlogManager
        blogs={blogs}
        setBlogs={setBlogs}
        loading={loading}
        error={error}
      />
    </div>
  );
}
