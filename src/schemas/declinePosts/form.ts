import z from 'zod';

export const TemplateFormSchema = z
  .object({
    id: z.number().nullable(),
    openingText: z.string().min(1, { message: '初めの言葉は必須です' }),
    closingText: z.string().min(1, { message: '締めの言葉は必須です' }),
    doneFlag: z.boolean(),
    doneResult: z.string(),
  })
  .refine(
    (data) => {
      if (data.doneFlag) {
        return data.doneResult.length > 0;
      }
      return true;
    },
    {
      message: '実行済みの場合、実行結果は必須です',
      path: ['doneResult'],
    }
  );
export const DeclineFormSchema = z.object({
  declineSituation: z.string().min(1, { message: '断りたい状況は必須です' }),
  actualSituation: z.any().nullable(),
  actualFeeling: z.any().nullable(),
  demerit: z.any().nullable(),
  templates: z.array(TemplateFormSchema),
});

export type DeclineForm = z.infer<typeof DeclineFormSchema>;

export type TemplateForm = z.infer<typeof TemplateFormSchema>;
export type TemplateFormData = TemplateForm & { clientId: string };
