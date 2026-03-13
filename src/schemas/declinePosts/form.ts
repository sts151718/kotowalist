import z from 'zod';
import { extractChars } from '@/lib/tiptap/tiptapFunctions';
import type { TiptapNode } from '@/lib/tiptap/tiptapTypes';

const tiptapSchemaObj = {
  type: z.literal('doc'),
  content: z.array(z.any()),
};

export const TemplateFormSchema = z
  .object({
    id: z.number().nullable(),
    openingText: z
      .string()
      .trim()
      .min(1, { message: '初めの言葉は必須です' })
      .max(300, { message: '初めの言葉は300文字以下で入力してください' }),
    closingText: z
      .string()
      .trim()
      .min(1, { message: '締めの言葉は必須です' })
      .max(300, { message: '締めの言葉は300文字以下で入力してください' }),
    doneFlag: z.boolean(),
    doneResult: z.string().trim().max(500, { message: '実行結果は500文字以下で入力してください' }),
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
  declineSituation: z
    .string()
    .trim()
    .min(1, { message: '断りたい状況は必須です' })
    .max(100, { message: '断りたい状況は100文字以下で入力してください' }),
  actualSituation: z
    .object(tiptapSchemaObj)
    .nullable()
    .refine((check) => extractChars(check as TiptapNode).length <= 500, {
      message: '実際の状況は500文字以内で入力してください',
    }),
  actualFeeling: z
    .object(tiptapSchemaObj)
    .nullable()
    .refine((check) => extractChars(check as TiptapNode).length <= 500, {
      message: '当時の心境は500文字以内で入力してください。',
    }),
  demerit: z
    .object(tiptapSchemaObj)
    .nullable()
    .refine((check) => extractChars(check as TiptapNode).length <= 500, {
      message: '断らなかったときのデメリットは500文字以内で入力してください。',
    }),
  templates: z.array(TemplateFormSchema).min(1, { message: 'テンプレートを1件以上入力してください' }),
});

export type DeclineForm = z.infer<typeof DeclineFormSchema>;

export type TemplateForm = z.infer<typeof TemplateFormSchema>;
export type TemplateFormData = TemplateForm & { clientId: string };
