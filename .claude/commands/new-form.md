# /new-form

Scaffold a form using react-hook-form + Zod + the shadcn `Form` primitive, wired to a server action. Use when a page needs to capture user input.

## Steps

1. **Define the input schema** at `app/<route>/_lib/<form-name>-schema.ts`:

   ```ts
   import { z } from "zod";

   export const contactFormSchema = z.object({
     name: z.string().min(1, "Name is required"),
     email: z.string().email(),
     message: z.string().min(10),
   });

   export type ContactFormInput = z.infer<typeof contactFormSchema>;
   ```

2. **Write the server action** at `app/<route>/_actions/<form-name>.ts`. Returns a discriminated `Result` per BASEPLATE.md § 4 — never throws:

   ```ts
   "use server";

   import { contactFormSchema } from "../_lib/<form-name>-schema";

   type Result<T> =
     | { ok: true; data: T }
     | { ok: false; error: string; code: string };

   export async function submitContactForm(
     input: unknown,
   ): Promise<Result<{ id: string }>> {
     const parsed = contactFormSchema.safeParse(input);
     if (!parsed.success) {
       return { ok: false, error: "Invalid input", code: "VALIDATION" };
     }
     // ... persist via Drizzle, send email via Resend, etc.
     return { ok: true, data: { id: "..." } };
   }
   ```

3. **Build the form component** (`'use client'` boundary at the form leaf only — rule 1):

   ```tsx
   "use client";

   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";

   import {
     Form,
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage,
   } from "@/components/ui/form";
   import { Input } from "@/components/ui/input";
   import { Button } from "@/components/ui/button";
   import {
     contactFormSchema,
     type ContactFormInput,
   } from "../_lib/<form-name>-schema";
   import { submitContactForm } from "../_actions/<form-name>";

   export function ContactForm() {
     const form = useForm<ContactFormInput>({
       resolver: zodResolver(contactFormSchema),
       defaultValues: { name: "", email: "", message: "" },
     });

     async function onSubmit(values: ContactFormInput) {
       const result = await submitContactForm(values);
       if (!result.ok) {
         form.setError("root", { message: result.error });
         return;
       }
       form.reset();
     }

     return (
       <Form {...form}>
         <form
           onSubmit={form.handleSubmit(onSubmit)}
           className="flex flex-col gap-4"
         >
           {/* FormField blocks for name, email, message */}
           <Button type="submit" disabled={form.formState.isSubmitting}>
             Submit
           </Button>
         </form>
       </Form>
     );
   }
   ```

4. **Import the form** into the server-component page that needs it.

## Verification

- `pnpm lint` passes.
- Submit in `pnpm dev` with valid and invalid data; confirm both paths return without thrown errors.

See [`error-handling-patterns`](../skills/error-handling-patterns/SKILL.md) for the full `Result` contract.
