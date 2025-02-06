import { QRCodeResult } from "./types";
import { createClient } from "@/utils/supabase/server";

export async function storeQRCode(
  eventId: string,
  qrCode: QRCodeResult,
): Promise<string> {
  if (!eventId || !qrCode || !qrCode.dataUrl) {
    throw new Error("Invalid QR code data or event ID");
  }

  const filePath = `events/${eventId}/qr.png`;

  const supabase = await createClient();

  // Extract and validate the base64 data
  const base64Data = qrCode.dataUrl.split(",")[1];
  if (!base64Data) {
    throw new Error("Invalid QR code data format");
  }

  try {
    const { error: uploadError, data } = await supabase.storage
      .from("qr-codes")
      .upload(filePath, Buffer.from(base64Data, "base64"), {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Failed to store QR code: ${uploadError.message}`);
    }

    if (!data) {
      throw new Error("No data returned from upload");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("qr-codes").getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    return publicUrl;
  } catch (error) {
    console.error("QR code storage error:", error);
    throw new Error(
      `Failed to store QR code: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
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
