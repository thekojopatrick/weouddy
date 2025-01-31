'use client';
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';

interface FileUploadProps {
  files: Array<{
    progress: number;
    preview: string;
    uploading: boolean;
    mediaType: 'IMAGE' | 'VIDEO';
  }>;
  removeFile: (index: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  removeFile,
}) => {
  const fileItems = useMemo(() => {
    return files.map((file, index) => (
      <div
        key={index}
        className="relative shrink-0 rounded-xl overflow-hidden"
      >
        {file.mediaType === 'VIDEO' ? (
          <video
            src={file.preview}
            className="h-[280px] w-[280px] object-cover"
            controls
          />
        ) : (
          <img
            src={file.preview || '/placeholder.svg'}
            alt="Preview"
            className="h-[280px] w-[280px] object-cover"
          />
        )}
        <button
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
          onClick={() => removeFile(index)}
          disabled={file.uploading}
        >
          <X className="h-4 w-4" />
        </button>
        {file.uploading && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
            <Progress value={file.progress} className="h-1" />
            <p className="text-xs mt-1">
              Uploading ({Math.round(file.progress)}%)
            </p>
          </div>
        )}
      </div>
    ));
  }, [files, removeFile]);

  return <div className="flex w-max space-x-4">{fileItems}</div>;
};

export default React.memo(FileUpload);
