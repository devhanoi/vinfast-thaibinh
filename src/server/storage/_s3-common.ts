import "server-only";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { StorageAdapter, StorageProvider } from "./types";

export type S3CompatConfig = {
  provider: StorageProvider;
  bucket: string;
  publicBaseUrl: string;
  endpoint?: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle?: boolean;
};

export function createS3CompatAdapter(cfg: S3CompatConfig): StorageAdapter {
  const client = new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,
    credentials: { accessKeyId: cfg.accessKeyId, secretAccessKey: cfg.secretAccessKey },
    forcePathStyle: cfg.forcePathStyle,
  });
  const baseUrl = cfg.publicBaseUrl.replace(/\/$/, "");

  return {
    provider: cfg.provider,

    async presignPut({ key, contentType, ttlSec = 300 }) {
      const command = new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(client, command, { expiresIn: ttlSec });
      return {
        uploadUrl,
        publicUrl: `${baseUrl}/${key}`,
        key,
        expiresIn: ttlSec,
      };
    },

    async presignGet(key, ttlSec = 300) {
      const command = new GetObjectCommand({ Bucket: cfg.bucket, Key: key });
      return getSignedUrl(client, command, { expiresIn: ttlSec });
    },

    async putObject({ key, body, contentType }) {
      await client.send(
        new PutObjectCommand({
          Bucket: cfg.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
      return { key, publicUrl: `${baseUrl}/${key}` };
    },

    async deleteObject(key) {
      await client.send(new DeleteObjectCommand({ Bucket: cfg.bucket, Key: key }));
    },

    getPublicUrl(key) {
      return `${baseUrl}/${key}`;
    },
  };
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") throw new Error(`Missing required env ${name}`);
  return v.trim();
}
