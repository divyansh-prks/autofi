import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function getJsonFromS3<T = any>(
  bucket: string,
  key: string
): Promise<T> {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
  );

  const body = await response.Body?.transformToString();
  if (!body) {
    throw new Error('Empty S3 object body');
  }

  return JSON.parse(body) as T;
}
