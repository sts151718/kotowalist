import { POSTS_PAGE_PER_PAGE } from '@/consts/pagination';
import { countAllPost } from '@/lib/supabase/declinePosts';

export const topLoader = async (): Promise<{ maxPage: number }> => {
  const postTotal = await countAllPost();
  const maxPage = Math.ceil(postTotal / POSTS_PAGE_PER_PAGE);

  return { maxPage };
};
