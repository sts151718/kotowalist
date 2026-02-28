import dayjs from 'dayjs';
import { User, type IUser } from './User';
import type { JSONContent } from '@tiptap/core';
import type { Json } from '@/lib/supabase/schema';

export interface IDeclinePost {
  id: number;
  publicId: string;
  declineSituation: string;
  demerit: JSONContent | null;
  actualSituation: JSONContent | null;
  actualFeeling: JSONContent | null;
  templates: Array<IDeclineTemplates>;
  user: IUser;
  updatedAt: string;
}

export interface IDeclineTemplates {
  id: number;
  openingText: string;
  closingText: string;
  doneFlag: boolean;
  doneResult: string;
}

export interface IDeclinePostSource {
  id: number;
  publicId: string;
  declineSituation: string;
  demerit?: Json | null;
  actualSituation?: Json | null;
  actualFeeling?: Json | null;
  templates?: Array<IDeclineTemplatesSource>;
  user: IUser;
  updatedAt: string;
}

export interface IDeclineTemplatesSource {
  id: number;
  openingText?: string | null;
  closingText?: string | null;
  doneFlag: boolean;
  doneResult?: string | null;
}

export class DeclincePost implements IDeclinePost {
  readonly id: number;
  readonly publicId: string;
  readonly declineSituation: string;
  readonly demerit: JSONContent | null;
  readonly actualSituation: JSONContent | null;
  readonly actualFeeling: JSONContent | null;
  readonly templates: IDeclineTemplates[];
  readonly user: IUser;
  readonly updatedAt: string;

  constructor(
    id: number,
    publicId: string,
    declineSituation: string,
    demerit: JSONContent | null,
    actualSituation: JSONContent | null,
    actualFeeling: JSONContent | null,
    templates: IDeclineTemplates[],
    user: IUser,
    updatedAt: string
  ) {
    this.id = id;
    this.publicId = publicId;
    this.declineSituation = declineSituation;
    this.demerit = demerit;
    this.actualSituation = actualSituation;
    this.actualFeeling = actualFeeling;
    this.templates = templates;
    this.user = user;
    this.updatedAt = updatedAt;
  }

  public static create(post: IDeclinePostSource): DeclincePost {
    const templates = post.templates ?? [];
    return new DeclincePost(
      post.id,
      post.publicId,
      post.declineSituation,
      (post.demerit as JSONContent) ?? null,
      (post.actualSituation as JSONContent) ?? null,
      (post.actualFeeling as JSONContent) ?? null,
      templates.map((template) => ({
        id: template.id,
        openingText: template.openingText ?? '',
        closingText: template.closingText ?? '',
        doneFlag: template.doneFlag,
        doneResult: template.doneResult ?? '',
      })),
      new User(post.user.id, post.user.userName),
      dayjs(post.updatedAt).format('YYYY/M/D')
    );
  }

  public hasDoneTemplate() {
    return this.templates.some((template) => template.doneFlag);
  }
}
