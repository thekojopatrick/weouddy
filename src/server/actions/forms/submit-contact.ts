// actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().optional(),
});

type FormState = {
  message: string;
  success: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const rawFormData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Validate form data
    const validatedFields = contactFormSchema.safeParse({
      name: rawFormData.name,
      email: rawFormData.email,
      phone: rawFormData.phone || undefined,
      subject: rawFormData.subject,
      message: rawFormData.message || undefined,
    });

    if (!validatedFields.success) {
      return {
        message: validatedFields.error.errors[0].message,
        success: false,
      };
    }

    // Create contact form entry
    await prisma.forms.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        phone: validatedFields.data.phone,
        subject: validatedFields.data.subject,
        message: validatedFields.data.message,
        type: "CONTACT",
        status: "APPROVED",
      },
    });

    return {
      message: "Form submitted successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error submitting form:", error);

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
