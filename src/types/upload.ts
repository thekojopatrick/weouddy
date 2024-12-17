export type FileWithPreview = {
  file: File
  preview: string
  progress: number
  uploading: boolean
  error?: string
}

export type UploadState = {
  files: FileWithPreview[]
  isUploading: boolean
  totalProgress: number
}

