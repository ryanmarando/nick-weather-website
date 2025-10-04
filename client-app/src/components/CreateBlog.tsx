import { useState } from "react";
import { fetchAuth } from "../functions/api";

type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; file?: File; url?: string; isMain?: boolean };

export default function CreateBlog({
  onBlogCreated,
}: {
  onBlogCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [blocks, setBlocks] = useState<BlogBlock[]>([
    { type: "paragraph", text: "" },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      // 1️⃣ Upload main image first (if exists)
      let mainImageBlock: BlogBlock | null = null;
      if (imageFile) {
        const presignRes = await fetchAuth<{
          uploadURL: string;
          fileUrl: string;
        }>("/s3/get-presigned-url", token, {
          method: "POST",
          body: { fileName: imageFile.name, fileType: imageFile.type },
        });

        await fetch(presignRes.uploadURL, {
          method: "PUT",
          body: imageFile,
          headers: { "Content-Type": imageFile.type },
        });

        mainImageBlock = {
          type: "image",
          url: presignRes.fileUrl,
          isMain: true,
        };
        setImageFile(null); // clear to avoid reuse
      }

      // 2️⃣ Upload block images
      const uploadedBlocks: BlogBlock[] = [];
      for (const block of blocks) {
        if (block.type === "image" && block.file) {
          const presignRes = await fetchAuth<{
            uploadURL: string;
            fileUrl: string;
          }>("/s3/get-presigned-url", token, {
            method: "POST",
            body: { fileName: block.file.name, fileType: block.file.type },
          });

          await fetch(presignRes.uploadURL, {
            method: "PUT",
            body: block.file,
            headers: { "Content-Type": block.file.type },
          });

          uploadedBlocks.push({
            ...block,
            url: presignRes.fileUrl,
            file: undefined,
          });
        } else {
          uploadedBlocks.push(block);
        }
      }

      // 3️⃣ Combine main image + other blocks
      const finalBlocks = mainImageBlock
        ? [mainImageBlock, ...uploadedBlocks]
        : uploadedBlocks;

      // 4️⃣ Send to backend
      const blogRes = await fetchAuth("/blog", token, {
        method: "POST",
        body: { title, blocks: finalBlocks },
      });

      console.log("Blog saved:", blogRes);
      onBlogCreated();

      setSuccessMsg("Blog created successfully!");
      setTitle("");
      setBlocks([{ type: "paragraph", text: "" }]);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>

      {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />

        <p>Enter main image:</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />

        {blocks.map((block, i) => (
          <div key={i} className="mb-4">
            {block.type === "paragraph" && (
              <textarea
                value={block.text}
                onChange={(e) =>
                  setBlocks((prev) =>
                    prev.map((b, j) =>
                      j === i ? { ...b, text: e.target.value } : b
                    )
                  )
                }
                className="w-full p-2 rounded bg-gray-700 text-white h-32"
                placeholder="Write paragraph..."
              />
            )}
            {block.type === "image" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBlocks((prev) =>
                      prev.map((b, j) =>
                        j === i
                          ? { ...b, file: e.target.files?.[0] || undefined }
                          : b
                      )
                    )
                  }
                />
                {block.isMain && <p className="text-yellow-400">Main Image</p>}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() =>
                  setBlocks((prev) => [
                    ...prev,
                    { type: "paragraph", text: "" },
                  ])
                }
                className="bg-green-600 px-2 py-1 rounded"
              >
                + Paragraph
              </button>
              <button
                type="button"
                onClick={() =>
                  setBlocks((prev) => [...prev, { type: "image" }])
                }
                className="bg-purple-600 px-2 py-1 rounded"
              >
                + Image
              </button>
              <button
                type="button"
                onClick={() =>
                  setBlocks((prev) => prev.filter((_, j) => j !== i))
                }
                className="bg-red-600 px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold"
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
