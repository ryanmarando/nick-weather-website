import { useState } from "react";
import { fetchAuth } from "../functions/api";

interface BlogImage {
  id: number;
  url: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  images: BlogImage[];
}

export default function BlogManager({
  blogs,
  setBlogs,
  loading,
  error,
}: {
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  loading: boolean;
  error: string;
}) {
  const [search, setSearch] = useState("");
  const [editingBlog, setEditingBlog] = useState<
    (Blog & { newImageUrls?: string[] }) | null
  >(null);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const token = localStorage.getItem("token") || "";

  // Delete blog
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetchAuth(`/blog/${id}`, token, { method: "DELETE" });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert("Failed to delete blog: " + err.message);
    }
  };

  // Save edited blog
  const handleSaveEdit = async () => {
    if (!editingBlog) return;
    try {
      const updated: Blog = await fetchAuth(`/blog/${editingBlog.id}`, token, {
        method: "PATCH",
        body: {
          title: editingBlog.title,
          content: editingBlog.content,
          newImageUrls: editingBlog.newImageUrls || [],
          deleteImageIds,
        },
      });

      setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setEditingBlog(null);
      setDeleteImageIds([]);
    } catch (err: any) {
      alert("Failed to update blog: " + err.message);
    }
  };

  const handleMarkImageForDeletion = (imgId: number) => {
    setDeleteImageIds((prev) => [...prev, imgId]);

    // Also remove it from editingBlog.images so the UI updates immediately
    if (editingBlog) {
      setEditingBlog({
        ...editingBlog,
        images: editingBlog.images.filter((img) => img.id !== imgId),
      });
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Search */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full rounded bg-gray-800 border border-gray-700"
      />

      {/* Blog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {editingBlog?.id === blog.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, title: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-700"
                />
                <textarea
                  value={editingBlog.content}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, content: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-700"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBlog(null)}
                    className="bg-gray-600 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-300">{blog.content}</p>

                {/* Images */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {blog.images?.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        onClick={() => handleMarkImageForDeletion(img.id)}
                        className="absolute top-1 right-1 bg-red-600 px-1 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditingBlog(blog)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
