import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type StoredObject = { url: string; key: string };

export type StorageService = {
  putObject(file: File | Blob | Buffer, key: string): Promise<StoredObject>;
  deleteObject(key: string): Promise<void>;
  getPublicUrl(key: string): string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env ${name}`);
  return value;
}

function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

async function toBody(file: File | Blob | Buffer) {
  if (Buffer.isBuffer(file)) return file;
  return Buffer.from(await file.arrayBuffer());
}

export function createR2Storage(): StorageService {
  const bucket = requireEnv("R2_BUCKET");
  const publicBaseUrl = requireEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  const client = createR2Client();

  return {
    async putObject(file, key) {
      const body = await toBody(file);
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: "type" in file && typeof file.type === "string" ? file.type : undefined,
        })
      );
      return { key, url: `${publicBaseUrl}/${key}` };
    },
    async deleteObject(key) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
    getPublicUrl(key) {
      return `${publicBaseUrl}/${key}`;
    },
  };
}

export function getStorage() {
  return createR2Storage();
}
