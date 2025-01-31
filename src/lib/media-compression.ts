import Compressor from 'compressorjs';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        resolve(result as File);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

// Initialize FFmpeg
const ffmpeg = new FFmpeg();
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';

export async function compressVideo(file: File): Promise<File> {
  try {
    // Load FFmpeg if not already loaded
    if (!ffmpeg.loaded) {
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        ), // URL to FFmpeg core
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        ),
      });
    }

    // Write the input file to FFmpeg's file system
    const inputFileName = 'input.mp4';
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Define output file name
    const outputFileName = 'output.mp4';

    // Run FFmpeg command to compress the video
    await ffmpeg.exec([
      '-i', // Input file
      inputFileName,
      '-vf', // Video filter (scale to 720p)
      'scale=1280:720',
      '-b:v', // Video bitrate (1Mbps)
      '1M',
      '-b:a', // Audio bitrate (128kbps)
      '128k',
      outputFileName,
    ]);

    // Read the compressed video from FFmpeg's file system
    const compressedData = await ffmpeg.readFile(outputFileName);

    // Create a Blob from the compressed data
    const compressedBlob = new Blob([compressedData], {
      type: 'video/mp4',
    });

    // Convert Blob to File
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'video/mp4',
    });

    // Clean up FFmpeg's file system
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    return compressedFile;
  } catch (error) {
    console.error('Video compression failed:', error);
    throw new Error('Failed to compress video');
  }
}
