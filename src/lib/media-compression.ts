import Compressor from "compressorjs";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Configure constants
const VIDEO_SIZE_LIMITS = {
  MIN: 1024 * 1024, // 1MB
  MAX: 1024 * 1024 * 1024, // 1GB
};

const IMAGE_COMPRESSION_CONFIG = {
  quality: 0.6,
  maxWidth: 1920,
  maxHeight: 1080,
};

const VIDEO_COMPRESSION_CONFIG = {
  crf: "28",
  preset: "fast",
  audioBitrate: "128k",
};

// FFmpeg singleton instance
let ffmpegInstance: FFmpeg | null = null;

/**
 * Compresses an image file while maintaining aspect ratio
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    console.warn("Invalid file type for image compression:", file.type);
    return file;
  }

  return new Promise((resolve) => {
    new Compressor(file, {
      ...IMAGE_COMPRESSION_CONFIG,
      success(result) {
        resolve(new File([result], file.name, { type: file.type }));
      },
      error(err) {
        console.warn("Image compression failed, using original file:", err);
        resolve(file);
      },
    });
  });
}

/**
 * Initializes FFmpeg instance with proper configuration
 */
async function initFFmpeg(): Promise<FFmpeg | null> {
  if (ffmpegInstance) return ffmpegInstance;

  try {
    ffmpegInstance = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });

    return ffmpegInstance;
  } catch (error) {
    console.error("FFmpeg initialization failed:", error);
    ffmpegInstance = null;
    return null;
  }
}

/**
 * Creates a unique filename to avoid conflicts during processing
 */
function createUniqueFileName(prefix: string, extension: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}.${extension}`;
}

/**
 * Compresses a video file using FFmpeg
 */
export async function compressVideo(file: File): Promise<File> {
  console.log("Video compression started", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  if (!file.type.startsWith("video/")) {
    console.warn("Invalid file type for video compression:", file.type);
    return file;
  }

  // Skip compression for files outside size bounds
  if (file.size > VIDEO_SIZE_LIMITS.MAX || file.size < VIDEO_SIZE_LIMITS.MIN) {
    console.log(
      "File size outside compression bounds, using original:",
      file.size,
    );
    return file;
  }

  // Detailed FFmpeg availability check
  const ff = await initFFmpeg();
  if (!ff) {
    console.error("FFmpeg initialization failed. Cannot compress video.");
    return file;
  }

  const inputName = createUniqueFileName("input", "mp4");
  const outputName = createUniqueFileName("output", "mp4");

  console.log("Compression file names:", { inputName, outputName });

  try {
    // Write input file
    const inputBuffer = await fetchFile(file);
    console.log("Input file buffer created", {
      bufferLength: inputBuffer.length,
    });

    await ff.writeFile(inputName, inputBuffer);
    console.log("Input file written to FFmpeg");

    // Apply compression with more detailed logging
    try {
      const ffmpegCommand = [
        "-i",
        inputName,
        "-c:v",
        "h264",
        "-crf",
        VIDEO_COMPRESSION_CONFIG.crf,
        "-preset",
        VIDEO_COMPRESSION_CONFIG.preset,
        "-c:a",
        "aac",
        "-b:a",
        VIDEO_COMPRESSION_CONFIG.audioBitrate,
        "-movflags",
        "+faststart",
        outputName,
      ];
      console.log("FFmpeg command:", ffmpegCommand.join(" "));

      const ffmpegResult = await ff.exec(ffmpegCommand);
      console.log("FFmpeg execution result:", ffmpegResult);
    } catch (execError) {
      console.error("FFmpeg execution failed:", execError);
      return file;
    }

    // Read output file
    const outputData = await ff.readFile(outputName);
    console.log("Output file read", {
      outputDataLength: outputData.length,
    });

    const compressedBlob = new Blob([outputData], {
      type: "video/mp4",
    });
    const compressedFile = new File([compressedBlob], file.name, {
      type: "video/mp4",
    });

    console.log("Compression comparison", {
      originalSize: file.size,
      compressedSize: compressedBlob.size,
    });

    if (compressedBlob.size < file.size) {
      console.log(
        `Compression successful: ${file.size} -> ${compressedBlob.size} bytes`,
      );
      return compressedFile;
    } else {
      console.log("Compressed file larger than original, using original");
      return file;
    }
  } catch (error) {
    console.error("Comprehensive video compression error:", error);
    return file;
  } finally {
    // Cleanup temporary files
    try {
      await ff.deleteFile(inputName);
      await ff.deleteFile(outputName);
      console.log("Temporary files cleaned up");
    } catch (cleanupError) {
      console.warn("Cleanup failed:", cleanupError);
    }
  }
}
