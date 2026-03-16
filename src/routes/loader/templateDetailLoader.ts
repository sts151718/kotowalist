import type { DeclincePost } from '@/domain/DeclinePost';
import { selectPost } from '@/lib/supabase/declinePosts';
import { data, type LoaderFunctionArgs } from 'react-router';

export const templateDetailLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<{ currentPostPromise: Promise<DeclincePost> }> => {
  const currentPostPromise = selectPost(params.publicId ?? '').catch(() => {
    throw data(null, { status: 404 });
  });

  return { currentPostPromise };
};
