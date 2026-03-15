import { DeclincePost, type IDeclinePostSource } from '@/domain/DeclinePost';
import type { Tables } from './schema';
import { supabase } from './setup';
import type { DeclineForm } from '@/schemas/declinePosts/form';

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

export const selectPostList = async (limit: number, offset: number = 0): Promise<Array<DeclincePost>> => {
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
  const { count, error } = await supabase.from('decline_posts').select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  return count ?? 0;
};

export const insertDeclinePost = async (insertData: DeclineForm, userId: number): Promise<string> => {
  const templatesJson = insertData.templates.map((template) => ({
    opening_text: template.openingText,
    closing_text: template.closingText,
    done_flag: template.doneFlag,
    done_result: template.doneResult,
  }));

  const { data, error } = await supabase.rpc('insert_decline_post_templates', {
    _actual_feeling: insertData.actualFeeling,
    _actual_situation: insertData.actualSituation,
    _decline_sitiation: insertData.declineSituation,
    _demerit: insertData.demerit,
    _templates_json: templatesJson,
    _user_id: userId,
  });

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  if (!data) {
    throw new Error('failed insert decline post');
  }

  return data;
};

export const updateDeclinePost = async (postId: number, updateData: DeclineForm): Promise<string> => {
  const templatesJson = updateData.templates.map((template) => ({
    id: template.id,
    opening_text: template.openingText,
    closing_text: template.closingText,
    done_flag: template.doneFlag,
    done_result: template.doneResult,
  }));

  const { data, error } = await supabase.rpc('upsert_decline_post_templates', {
    _id: postId,
    _actual_feeling: updateData.actualFeeling,
    _actual_situation: updateData.actualSituation,
    _decline_sitiation: updateData.declineSituation,
    _demerit: updateData.demerit,
    _templates_json: templatesJson,
  });

  if (error) {
    throw new Error(`${error?.message}: ${error?.details}`);
  }

  if (!data) {
    throw new Error('failed update decline post');
  }

  return data;
};
