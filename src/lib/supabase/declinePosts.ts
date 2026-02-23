import { DeclincePost, type IDeclinePostSource } from '@/domain/DeclinePost';
import { User } from '@/domain/User';
import type { Tables } from './schema';
import { supabase } from './setup';

type PostRecord = Tables<'decline_posts'> & {
  decline_templates: Tables<'decline_templates'>[];
  users: Pick<Tables<'users'>, 'id' | 'user_name'>;
};

export const selectPost = async (publicId: string): Promise<DeclincePost> => {
  const { data, error } = await supabase
    .from('decline_posts')
    .select('*, users(id, user_name), decline_templates(*)')
    .eq('public_id', publicId)
    .limit(1)
    .single();

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  const post = data as PostRecord;
  const user = new User(post.users.id, post.users.user_name);

  const templates = (post.decline_templates ?? []).map((template: Tables<'decline_templates'>) => ({
    id: template.id,
    openingText: template.opening_text,
    closingText: template.closing_text ?? null,
    doneFlag: template.done_flag,
    doneResult: template.done_result,
  }));

  const decline: IDeclinePostSource = {
    id: post.id,
    publicId: post.public_id,
    declineSituation: post.decline_situation,
    demerit: post.demerit,
    actualSituation: post.actual_situation,
    actualFeeling: post.actual_feeling,
    templates,
    user,
    updatedAt: post.updated_at,
  };

  return DeclincePost.create(decline);
};
