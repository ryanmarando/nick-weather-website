// utils/upload.ts
import { fetchAuth } from "../functions/api";

export async function uploadFile(file: File): Promise<string> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");

  // 1️⃣ Get presigned URL from backend
  const presignRes = await fetchAuth<{ uploadURL: string; fileUrl: string }>(
    "/s3/get-presigned-url",
    token,
    {
      method: "POST",
      body: { fileName: file.name, fileType: file.type },
    }
  );

  // 2️⃣ Upload file to S3
  await fetch(presignRes.uploadURL, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  // 3️⃣ Return the public URL for storing in the blog block
  return presignRes.fileUrl;
}
