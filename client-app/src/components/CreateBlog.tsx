import { useState } from "react";
import { fetchAuth } from "../functions/api";

export default function CreateBlog({
  onBlogCreated,
}: {
  onBlogCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");

      let imageUrl = "";

      // 1️⃣ Request a presigned URL if an image was selected
      if (imageFile) {
        const presignRes = await fetchAuth<{
          uploadURL: string;
          fileUrl: string;
        }>("/s3/get-presigned-url", token, {
          method: "POST",
          body: {
            fileName: imageFile.name,
            fileType: imageFile.type,
          },
        });

        // 2️⃣ Upload directly to S3 using the presigned URL
        await fetch(presignRes.uploadURL, {
          method: "PUT",
          body: imageFile,
          headers: {
            "Content-Type": imageFile.type,
          },
        });

        imageUrl = presignRes.fileUrl;
      }

      // 3️⃣ Create the blog post, saving the image URL
      const blogRes = await fetchAuth("/blog", token, {
        method: "POST",
        body: {
          title,
          content,
          imageUrls: imageUrl ? [imageUrl] : [],
        },
      });

      console.log(blogRes);
      onBlogCreated();

      setSuccessMsg("Blog created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong");
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

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white h-40"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />

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
