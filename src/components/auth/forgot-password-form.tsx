"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SVGLogo from "../svg-logo";
import { forgotPasswordAction } from "@/app/deactivated/auth/actions";

import Link from "next/link";
import { forgotPasswordSchema } from "@/types/validation";

export function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      callbackUrl: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    forgotPasswordAction({
      email: values.email,
      callbackUrl: "/account/reset-password",
    });
  };

  return (
    <div className="grid gap-6 px-4">
      <div className="header">
        <div className="flex justify-center flex-col items-center">
          <SVGLogo />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-center text-gray-900">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter your email to reset your account password
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    {...field}
                    className="rounded-xl px-4 h-12 bg-white text-sm shadow-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="text-sm shadow-xs rounded-xl h-12">
            Reset Password
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link className="text-primary underline font-medium" href="/sign-in">
          Sign in
        </Link>
      </div>
    </div>
  );
}
