import { s3 } from "../config";

export const getPresignedUrl = async (req: any, res: any) => {
  const { fileName, fileType } = req.body;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    // Include region in fileUrl
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.json({
      uploadURL,
      fileUrl,
    });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
};
