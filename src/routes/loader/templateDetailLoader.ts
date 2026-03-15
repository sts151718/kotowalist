import type { DeclincePost } from '@/domain/DeclinePost';
import { selectPost } from '@/lib/supabase/declinePosts';
import type { LoaderFunctionArgs } from 'react-router';

export const templateDetailLoader = ({ params }: LoaderFunctionArgs): { currentPostPromise: Promise<DeclincePost> } => {
  const currentPostPromise = selectPost(params.publicId ?? '');

  return { currentPostPromise };
};
