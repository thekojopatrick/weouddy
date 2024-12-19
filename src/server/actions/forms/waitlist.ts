"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormState = {
  message: string;
  success: boolean;
};

export async function submitWaitlistForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const email = formData.get("email");

    // Validate the email
    const validated = schema.parse({ email });

    // Check if email already exists
    const existingForm = await prisma.forms.findFirst({
      where: {
        email: validated.email,
        type: "NEWSLETTER",
      },
    });

    if (existingForm) {
      return {
        message: "This email is already on our waitlist!",
        success: false,
      };
    }

    // Create new form entry
    await prisma.forms.create({
      data: {
        email: validated.email,
        type: "NEWSLETTER",
        status: "APPROVED",
      },
    });

    return {
      message: "Successfully joined the waitlist!",
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: error.errors[0].message,
        success: false,
      };
    }

    return {
      message: "Something went wrong. Please try again.",
      success: false,
    };
  }
}
