import { useState } from "react";
import { fetchAuth } from "../functions/api";

interface Props {
  onResumeUploaded: () => void;
}

export default function CreateResume({ onResumeUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");
    if (!file) return alert("Select a file first!");

    setUploading(true);
    try {
      // 1. Get pre-signed URL
      const token = localStorage.getItem("token");
      const presignRes = await fetchAuth<{
        uploadURL: string;
        fileUrl: string;
      }>("/s3/get-presigned-url", token!, {
        method: "POST",
        body: { fileName: file.name, fileType: file.type },
      });

      // 2. Upload file to S3
      await fetch(presignRes.uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Save record in DB
      const resumeRes = await fetchAuth("/resume", token!, {
        method: "POST",
        body: {
          fileURL: presignRes.fileUrl,
          adminId: 1,
        },
      });

      console.log(resumeRes);
      alert("Resume uploaded successfully!");
      setFile(null);
      onResumeUploaded();
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
