"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sendContact, type ContactInput } from "@/lib/actions/send-contact";

const PROJECT_TYPES: readonly {
  value: ContactInput["projectType"];
  label: string;
}[] = [
  { value: "solar", label: "Solar farm / renewable EPC" },
  { value: "substation", label: "Substation EPC" },
  { value: "transmission", label: "Transmission / NGCP" },
  { value: "consulting", label: "Pre-development consulting" },
  { value: "industrial", label: "Industrial electrical" },
  { value: "other", label: "Other" },
];

export function ContactForm() {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ContactInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "substation",
      message: "",
    },
  });

  function onSubmit(values: ContactInput) {
    startTransition(async () => {
      const result = await sendContact(values);
      if (result.ok) {
        toast.success("Thanks — we'll be in touch within one business day.");
        form.reset();
      } else {
        toast.error(result.error);
        if (result.fieldErrors) {
          for (const [key, msgs] of Object.entries(result.fieldErrors)) {
            const m = msgs?.[0];
            if (m) {
              form.setError(key as keyof ContactInput, { message: m });
            }
          }
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6 md:p-8"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: "Please enter your name.",
              minLength: { value: 2, message: "Please enter your name." },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-eyebrow uppercase text-muted-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Please enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-eyebrow uppercase text-muted-foreground">
                  Work email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-eyebrow uppercase text-muted-foreground">
                  Phone (optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+63 ..."
                    autoComplete="tel"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-eyebrow uppercase text-muted-foreground">
                  Project type
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROJECT_TYPES.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          rules={{
            required: "Tell us a little about the project.",
            minLength: {
              value: 10,
              message: "Tell us a little more — at least ten characters.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-eyebrow uppercase text-muted-foreground">
                Project brief
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Site, capacity, voltage, timeline — anything we should know."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="h-11 self-start px-5 text-sm"
          disabled={isPending}
        >
          {isPending ? "Sending…" : "Send brief"}
          <ArrowRightIcon
            data-icon="inline-end"
            className="size-3.5"
            strokeWidth={1.5}
          />
        </Button>
      </form>
    </Form>
  );
}
