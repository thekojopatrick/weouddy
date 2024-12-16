import { QRCodeResult } from "./types";
import { createClient } from "@/lib/supabase/server";

export async function storeQRCode(
  eventId: string,
  qrCode: QRCodeResult,
): Promise<string> {
  const filePath = `events/${eventId}/qr.png`;

  const supabase = await createClient();

  // Extract the base64 data from the dataUrl
  const base64Data = qrCode.dataUrl.split(",")[1];

  const { error: uploadError } = await supabase.storage
    .from("qr-codes")
    .upload(filePath, Buffer.from(base64Data, "base64"), {
      contentType: "image/png",
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw new Error("Failed to store QR code");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("qr-codes").getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteQRCode(eventId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("qr-codes")
    .remove([`events/${eventId}/qr.png`]);

  if (error) {
    throw new Error("Failed to delete QR code");
  }
}
