import { useState } from "react";
import { fetchAuth } from "../functions/api";
import { uploadFile } from "../functions/upload";

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
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const [newBlocks, setNewBlocks] = useState<BlogBlock[]>([]);

  const token = localStorage.getItem("token") || "";

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetchAuth(`/blog/${id}`, token, { method: "DELETE" });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert("Failed to delete blog: " + err.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingBlog) return;

    const allBlocks = editingBlog.blocks ? [...editingBlog.blocks] : [];
    if (newBlocks.length) allBlocks.push(...newBlocks);

    const body: any = {
      title: editingBlog.title,
      blocks: allBlocks.length ? allBlocks : undefined,
      content: allBlocks.length ? undefined : editingBlog.content,
      newImageUrls: editingBlog.newImageUrls,
      deleteImageIds,
    };

    try {
      await fetchAuth(`/blog/${editingBlog.id}`, token, {
        method: "PATCH",
        body,
      });

      // Fetch latest blogs correctly
      const data = await fetchAuth<{ blogs: Blog[] }>("/blog", token);
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);

      setEditingBlog(null);
      setDeleteImageIds([]);
      setNewBlocks([]);
    } catch (err: any) {
      alert("Failed to update blog: " + err.message);
    }
  };

  const handleDeleteBlock = (block?: BlogBlock, index?: number) => {
    if (!editingBlog) return;

    if (block) {
      // Existing block
      if (block.type === "image" && block.id !== undefined) {
        setDeleteImageIds((prev: any) => [...prev, block.id]);
      }

      setEditingBlog({
        ...editingBlog,
        blocks: editingBlog.blocks?.filter((b) => b !== block),
      });
    } else if (index !== undefined) {
      // New block
      setNewBlocks((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const text =
      b.blocks
        ?.filter((blk) => blk.type === "paragraph" && blk.text)
        .map((blk) => blk.text)
        .join(" ") ||
      b.content ||
      "";
    return (
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      text.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 w-full rounded bg-gray-800 border border-gray-700"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {editingBlog?.id === blog.id ? (
              <div className="space-y-4">
                {/* Title */}
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, title: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-700"
                />

                {/* Existing blocks */}
                {editingBlog.blocks?.map((block, i) =>
                  block.type === "paragraph" ? (
                    <div key={block.id ?? i} className="flex gap-2 items-start">
                      <textarea
                        value={block.text}
                        onChange={(e) => {
                          const newBlocks = [...(editingBlog.blocks || [])];
                          newBlocks[i] = { ...block, text: e.target.value };
                          setEditingBlog({ ...editingBlog, blocks: newBlocks });
                        }}
                        className="flex-1 p-2 rounded bg-gray-700"
                      />
                      <button
                        onClick={() => handleDeleteBlock(block)}
                        className="bg-red-600 px-2 py-1 rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    block.url && (
                      <div key={block.id ?? i} className="relative">
                        <img
                          src={block.url}
                          className="w-32 h-32 object-cover rounded"
                        />
                        <button
                          onClick={() => handleDeleteBlock(block)}
                          className="absolute top-1 right-1 bg-red-600 px-1 rounded text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )
                )}

                {/* New blocks */}
                {newBlocks.map((block, i) =>
                  block.type === "image" ? (
                    <div key={i} className="flex flex-col gap-2 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (!e.target.files || !e.target.files[0]) return;
                          const file = e.target.files[0];

                          // Upload file somewhere (e.g., S3) and get URL
                          const uploadedUrl = await uploadFile(file);

                          const updated = [...newBlocks];
                          updated[i] = { ...block, url: uploadedUrl };
                          setNewBlocks(updated);
                        }}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                      />
                      <button
                        onClick={() => handleDeleteBlock(undefined, i)}
                        className="bg-red-600 px-2 py-1 rounded text-sm w-fit"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2 items-start">
                      <textarea
                        value={block.text}
                        onChange={(e) => {
                          const updated = [...newBlocks];
                          updated[i] = { ...block, text: e.target.value };
                          setNewBlocks(updated);
                        }}
                        className="flex-1 p-2 rounded bg-gray-700"
                      />
                      <button
                        onClick={() => handleDeleteBlock(undefined, i)}
                        className="bg-red-600 px-2 py-1 rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}

                {/* Add new blocks */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      setNewBlocks([
                        ...newBlocks,
                        { type: "paragraph", text: "" },
                      ])
                    }
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Add Paragraph
                  </button>
                  <button
                    onClick={() =>
                      setNewBlocks([...newBlocks, { type: "image", url: "" }])
                    }
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Add Image
                  </button>
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-2 mt-4">
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
                <p className="text-gray-300">
                  {blog.blocks
                    ?.filter((b) => b.type === "paragraph")
                    .map((b) => b.text)
                    .join(" ") || blog.content}
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {(
                    blog.blocks
                      ?.filter((b) => b.type === "image" && b.url)
                      .map((b, idx) => ({ id: b.id ?? idx, url: b.url! })) ||
                    blog.images ||
                    []
                  ).map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>

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
