import { redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';
import { selectPost, updateDeclinePost } from '@/lib/supabase/declinePosts';
import { DeclineFormSchema } from '@/schemas/declinePosts/form';
import z from 'zod';

export type TemplateUpdateError = {
  isError: true;
  message: string;
};

type TemplateUpdateReturn = TemplateUpdateError | Response;

const TemplateUpdateFormDataSchema = z.object({
  userId: z.coerce.number().int().positive(),
  payload: z.string().min(1),
});

export const templateUpdateAction: ActionFunction<TemplateUpdateReturn> = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { payload } = TemplateUpdateFormDataSchema.parse(Object.fromEntries(formData));
  const post = DeclineFormSchema.parse(JSON.parse(payload));

  if (!params.publicId) {
    return { isError: true, message: 'テンプレートが見つかりませんでした。' };
  }

  try {
    const currentPost = await selectPost(params.publicId);
    const publicId = await updateDeclinePost(currentPost.id, post);

    return redirect(`/templates/${publicId}`);
  } catch {
    return { isError: true, message: 'テンプレートの更新に失敗しました。' };
  }
};
