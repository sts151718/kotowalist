import { POSTS_PAGE_PER_PAGE } from '@/consts/pagination';
import type { DeclincePost } from '@/domain/DeclinePost';
import { selectPostList } from '@/lib/supabase/declinePosts';
import type { LoaderFunctionArgs } from 'react-router';

export const postListLoader = async ({ request }: LoaderFunctionArgs): Promise<Array<DeclincePost>> => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;

  const offset = (page - 1) * POSTS_PAGE_PER_PAGE;
  const postList = await selectPostList(POSTS_PAGE_PER_PAGE, offset);

  return postList;
};
