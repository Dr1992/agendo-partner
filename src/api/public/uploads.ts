import { apiAuthPostMultipart } from "../http";

export type UploadMediaResponse = {
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  url: string;
};

export async function uploadPartnerMedia(
  localUri: string,
  mimeType: string,
): Promise<UploadMediaResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    name: "photo.jpg",
    type: mimeType,
  } as unknown as Blob);
  return apiAuthPostMultipart<UploadMediaResponse>("/uploads/media", formData);
}
