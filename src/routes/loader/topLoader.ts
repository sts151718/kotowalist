import { POSTS_PATPER_PAGE } from '@/consts/pagination';
import { countAllPost } from '@/lib/supabase/declinePosts';

export const topLoader = async (): Promise<{ maxPage: number }> => {
  const postTotal = await countAllPost();
  const maxPage = Math.ceil(postTotal / POSTS_PATPER_PAGE);

  return { maxPage };
};
