export interface FileWithPreview {
  file: File;
  preview: string;
  progress: number;
  uploading: boolean;
  mediaType: 'IMAGE' | 'VIDEO';
  error?: string; // Optional error field
}

export type UploadState = {
  files: FileWithPreview[];
  isUploading: boolean;
  totalProgress: number;
};
