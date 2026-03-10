import z from 'zod';

export const TemplateFormSchema = z.object({
  id: z.number().nullable(),
  openingText: z.string(),
  closingText: z.string(),
  doneFlag: z.boolean(),
  doneResult: z.string(),
});

export type TemplateForm = z.infer<typeof TemplateFormSchema>;
export type TemplateFormData = TemplateForm & { clientId: string };
