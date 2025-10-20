"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vendorSchema,
  type VendorFormData,
} from "@/features/vendors/onboarding/types";
import { createVendor } from "@/app/deactivated/(main)/(frontpage)/vendors/onboarding/actions";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import BasicInfoStep from "./components/basic-info-step";
import ContactStep from "./components/contact-step";
import LocationStep from "./components/location-step";
import ServicesStep from "./components/services-step";

const FormSteps = {
  BASIC_INFO: 0,
  CONTACT: 1,
  LOCATION: 2,
  SERVICES: 3,
} as const;

export default function VendorOnboarding() {
  const [step, setStep] = useState<number>(FormSteps.BASIC_INFO);
  const { toast } = useToast();

  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      services: [],
      servingCities: [],
      travelScope: "LOCAL_ONLY",
    },
  });

  const onSubmit = async (data: VendorFormData) => {
    try {
      await createVendor(data);
      toast({
        title: "Success",
        description: "Vendor profile created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create vendor profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-8">
            {Object.keys(FormSteps).map((stepKey, index) => (
              <div
                key={stepKey}
                className={`flex items-center ${
                  step >= index ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step >= index ? "bg-primary text-white" : "bg-muted"}`}
                >
                  {index + 1}
                </div>
                {index < Object.keys(FormSteps).length - 1 && (
                  <div
                    className={`w-full h-1 ${
                      step > index ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {step === FormSteps.BASIC_INFO && "Basic Business Information"}
            {step === FormSteps.CONTACT && "Contact Details"}
            {step === FormSteps.LOCATION && "Location & Travel"}
            {step === FormSteps.SERVICES && "Services & Pricing"}
          </h2>

          {/* Form Steps */}
          {step === FormSteps.BASIC_INFO && <BasicInfoStep form={form} />}
          {step === FormSteps.CONTACT && <ContactStep form={form} />}
          {step === FormSteps.LOCATION && <LocationStep form={form} />}
          {step === FormSteps.SERVICES && <ServicesStep form={form} />}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Previous
            </Button>

            {step < Object.keys(FormSteps).length - 1 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit">Create Profile</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
