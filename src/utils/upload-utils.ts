import { createClient } from "@/utils/supabase/client";
import { Upload } from "tus-js-client";

function getFileExtension(filename: string): string {
  const match = /\.([a-zA-Z]+)$/.exec(filename);
  if (match !== null) {
    return match[1];
  }
  return "";
}

function getMimeType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    default:
      return `image/${extension}`;
  }
}

export async function uploadFiles(
  bucketName: string,
  files: File[],
  filePaths: string[],
  onProgress?: (fileIndex: number, progress: number) => void,
): Promise<{ url: string }[]> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const uploadedFiles = await Promise.all(
    files.map(async (file, fileIndex) => {
      return new Promise<{ url: string }>((resolve, reject) => {
        const extension = getFileExtension(file.name);
        const fileName = `${Math.random()}.${extension}`;

        const filePath = filePaths[fileIndex] || `${bucketName}/${fileName}`;

        const upload = new Upload(file, {
          endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/upload/resumable`,
          headers: {
            authorization: `Bearer ${session?.access_token}`,
            "x-upsert": "true",
          },
          metadata: {
            bucketName: bucketName,
            objectName: filePath,
            contentType: file.type || getMimeType(extension),
            cacheControl: "3600",
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const progress = (bytesUploaded / bytesTotal) * 100;
            if (onProgress) {
              onProgress(fileIndex, progress);
            }
          },
          onSuccess: () => {
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucketName}/${filePath}`;
            //https://tuffqbszruravurjwsei.supabase.co/storage/v1/object/public/covers//7148040-uhd_2160_3840_30fps.mp4
            resolve({ url });
          },
          onError: (error) => {
            reject(error);
          },
        });

        upload.start();
      });
    }),
  );

  return uploadedFiles;
}
