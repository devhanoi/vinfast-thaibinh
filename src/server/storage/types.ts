export type StorageProvider = "r2" | "s3" | "local";

export type PresignPutInput = {
  key: string;
  contentType: string;
  ttlSec?: number;
};

export type PresignedPut = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
};

export type PutObjectInput = {
  key: string;
  body: Buffer | Uint8Array;
  contentType?: string;
};

export type PutObjectResult = {
  key: string;
  publicUrl: string;
};

export interface StorageAdapter {
  readonly provider: StorageProvider;
  presignPut(input: PresignPutInput): Promise<PresignedPut>;
  presignGet(key: string, ttlSec?: number): Promise<string>;
  putObject(input: PutObjectInput): Promise<PutObjectResult>;
  deleteObject(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
