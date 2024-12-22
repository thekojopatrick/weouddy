import { createClient } from "../server";
import { v4 as uuidv4 } from "uuid";

export async function uploadEventCoverImage(
  imageDataUrl: string,
  eventId: string,
): Promise<string> {
  const supabase = await createClient();

  // Remove data URL prefix
  const base64Data = imageDataUrl.split(",")[1];

  // Convert base64 to blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  // Generate a unique filename
  const fileExt = "jpg";
  const fileName = `${eventId}_cover_${uuidv4()}.${fileExt}`;
  const filePath = `event-covers/${fileName}`;

  // Upload to Supabase
  const { error } = await supabase.storage
    .from("covers")
    .upload(filePath, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: blob.type,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload cover image");
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("covers")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
