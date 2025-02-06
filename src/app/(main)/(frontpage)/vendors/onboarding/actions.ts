"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  vendorSchema,
  type VendorFormData,
} from "@/features/vendors/onboarding/types";

export async function createVendor(data: VendorFormData) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Validate data
  const validatedData = vendorSchema.parse(data);

  // Create vendor
  const vendor = await prisma.vendor.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  });

  // Create default package
  await prisma.vendorPackage.create({
    data: {
      vendorId: vendor.id,
      name: "Basic Package",
      price: validatedData.basePrice,
      inclusions: validatedData.services,
    },
  });

  return vendor;
}
