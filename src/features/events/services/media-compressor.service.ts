import {
  compressImage,
  compressVideo,
} from '@/lib/media-compression';
import type { FileWithPreview } from '@/types/upload';
import { toast } from 'sonner';

interface CompressionProgress {
  progress: number;
  stage: 'compressing' | 'uploading';
}

interface CompressionResult {
  file: File;
  compressed: boolean;
}

interface MediaValidationConfig {
  maxVideoSize: number;
  maxImageSize: number;
  maxVideoDuration: number;
}

type ProgressCallback = (progress: CompressionProgress) => void;

const DEFAULT_VALIDATION_CONFIG: MediaValidationConfig = {
  maxVideoSize: 1024 * 1024 * 1024, // 1 GB
  maxImageSize: 512 * 1024 * 1024, // 512 MB
  maxVideoDuration: 200, // seconds
};

export class MediaCompressor {
  private compressionQueue: Map<
    string,
    Promise<CompressionResult | null>
  >;
  private validationConfig: MediaValidationConfig;

  constructor(config: Partial<MediaValidationConfig> = {}) {
    this.compressionQueue = new Map();
    this.validationConfig = {
      ...DEFAULT_VALIDATION_CONFIG,
      ...config,
    };
  }

  /**
   * Validates a media file against size and duration constraints
   */
  private async validateFile(
    file: File,
    mediaType: string
  ): Promise<boolean> {
    try {
      if (mediaType === 'VIDEO') {
        if (file.size > this.validationConfig.maxVideoSize) {
          toast.error('Video file size must be less than 1 GB');
          return false;
        }

        // Check video duration
        const duration = await this.getVideoDuration(file);
        if (duration > this.validationConfig.maxVideoDuration) {
          toast.error('Video length must be less than 200 seconds');
          return false;
        }
      } else {
        if (file.size > this.validationConfig.maxImageSize) {
          toast.error('File size must be less than 512 MB');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('File validation failed:', error);
      toast.error('Failed to validate file');
      return false;
    }
  }

  /**
   * Gets the duration of a video file
   */
  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const objectUrl = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(video.duration);
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load video metadata'));
      };

      video.src = objectUrl;
    });
  }

  /**
   * Process a file through validation and compression pipeline
   */
  async processFile(
    fileWithPreview: FileWithPreview,
    onProgress?: ProgressCallback
  ): Promise<CompressionResult | null> {
    const { file, mediaType } = fileWithPreview;
    const fileId = `${file.name}_${Date.now()}`;

    // Check if this file is already being processed
    if (this.compressionQueue.has(fileId)) {
      return this.compressionQueue.get(fileId)!;
    }

    const compressionPromise = (async () => {
      try {
        // Validate file before compression
        const isValid = await this.validateFile(file, mediaType);
        if (!isValid) {
          return null;
        }

        // Notify start of compression
        onProgress?.({ progress: 0, stage: 'compressing' });

        let compressedFile: File;
        if (file.type.startsWith('image/')) {
          compressedFile = await compressImage(file);
        } else if (file.type.startsWith('video/')) {
          compressedFile = await compressVideo(file);
        } else {
          return { file, compressed: false };
        }

        // Notify completion of compression
        onProgress?.({ progress: 100, stage: 'compressing' });

        const wasCompressed = compressedFile.size < file.size;
        return {
          file: wasCompressed ? compressedFile : file,
          compressed: wasCompressed,
        };
      } catch (error) {
        console.warn(
          'Compression failed, using original file:',
          error
        );
        return { file, compressed: false };
      } finally {
        // Clean up queue
        this.compressionQueue.delete(fileId);
      }
    })();

    // Add to queue
    this.compressionQueue.set(fileId, compressionPromise);
    return compressionPromise;
  }

  /**
   * Process multiple files concurrently
   */
  async processFiles(
    files: FileWithPreview[],
    onProgress?: (
      fileIndex: number,
      progress: CompressionProgress
    ) => void
  ): Promise<(CompressionResult | null)[]> {
    return Promise.all(
      files.map((file, index) =>
        this.processFile(file, (progress) =>
          onProgress?.(index, progress)
        )
      )
    );
  }
}
