import { DeclincePost, type IDeclinePostSource } from '@/domain/DeclinePost';
import type { Tables } from './schema';
import { supabase } from './setup';

export type PostRecord = Tables<'decline_posts'> & {
  decline_templates?: Array<Tables<'decline_templates'>>;
  users: Pick<Tables<'users'>, 'id' | 'user_name'>;
};

export type PostListRecord = Pick<
  Tables<'decline_posts'>,
  'id' | 'public_id' | 'decline_situation' | 'actual_situation' | 'updated_at'
> & {
  decline_templates?: Array<Pick<Tables<'decline_templates'>, 'id' | 'done_flag'>>;
  users: Pick<Tables<'users'>, 'id' | 'user_name'>;
};

export const selectPost = async (publicId: string): Promise<DeclincePost> => {
  const { data, error } = await supabase
    .from('decline_posts')
    .select('*, users(id, user_name), decline_templates(*)')
    .eq('public_id', publicId)
    .limit(1)
    .overrideTypes<Array<PostRecord>>();

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }
  if (data.length !== 1) {
    throw new Error(`存在しないデータです。`);
  }

  const post = data[0];

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
    user: {
      id: post.user_id,
      userName: post.users.user_name,
    },
    updatedAt: post.updated_at,
  };

  return DeclincePost.create(decline);
};

export const selectPostList = async (offset: number, limit: number): Promise<Array<DeclincePost>> => {
  const { data, error } = await supabase
    .from('decline_posts')
    .select(
      'id, public_id, decline_situation, updated_at, actual_situation, users(id, user_name), decline_templates(id,done_flag)'
    )
    .eq('decline_templates.done_flag', true)
    .range(offset, offset + limit - 1)
    .limit(limit)
    .overrideTypes<Array<PostListRecord>>();

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  return data.map((post) => {
    const templates = (post.decline_templates ?? []).map((template) => ({
      id: template.id,
      doneFlag: template.done_flag,
    }));

    const decline: IDeclinePostSource = {
      id: post.id,
      publicId: post.public_id,
      declineSituation: post.decline_situation,
      actualSituation: post.actual_situation,
      templates,
      user: {
        id: post.users.id,
        userName: post.users.user_name,
      },
      updatedAt: post.updated_at,
    };
    return DeclincePost.create(decline);
  });
};

export const countAllPost = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('decline_posts')
    .select('count(id)')
    .eq('decline_templates.done_flag', true)
    .overrideTypes<Array<PostListRecord>>();

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }
};
