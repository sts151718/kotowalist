import { redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';
import { insertDeclinePost } from '@/lib/supabase/declinePosts';
import { DeclineFormSchema } from '@/schemas/declinePosts/form';
import z from 'zod';

export type TemplateCreateError = {
  isError: true;
  message: string;
};

type TemplateCreateReturn = TemplateCreateError | Response;

const TemplateCreateFormDataSchema = z.object({
  userId: z.coerce.number().int().positive(),
  payload: z.string().min(1),
});

export const templateCreateAction: ActionFunction<TemplateCreateReturn> = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { userId, payload } = TemplateCreateFormDataSchema.parse(Object.fromEntries(formData));
  const post = DeclineFormSchema.parse(JSON.parse(payload));

  try {
    const publicId = await insertDeclinePost(post, userId);

    return redirect(`/templates/${publicId}`);
  } catch {
    return { isError: true, message: 'テンプレートの作成に失敗しました。' };
  }
};
