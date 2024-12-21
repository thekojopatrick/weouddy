import { supabase } from "../client";

export async function uploadToSupabase(
  file: File,
  eventId: string,
): Promise<string> {
  // Generate a unique filename to avoid collisions
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${eventId}/${timestamp}-${
    Math.random().toString(36).substring(7)
  }.${fileExtension}`;

  // Upload file to Supabase storage
  const { error } = await supabase
    .storage
    .from("posts") // Replace with your bucket name
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase
    .storage
    .from("posts") // Replace with your bucket name
    .getPublicUrl(fileName);

  return publicUrl;
}
