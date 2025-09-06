import { s3 } from "../config";

export const deleteFromS3 = async (key: string) => {
  try {
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
      .promise();
  } catch (err) {
    console.error("Failed to delete from S3:", err);
  }
};
