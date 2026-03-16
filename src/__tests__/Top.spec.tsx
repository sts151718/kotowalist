import { createDefaultMainLayoutRoot, createMainLayoutStubRoot } from './helpers/mainLayoutStub';
import { type IDeclinePostSource } from '@/domain/DeclinePost';
import { DeclincePost } from '@/domain/DeclinePost';
import { createRoutesStub, type LoaderFunctionArgs } from 'react-router';
import { act, render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import { POSTS_PATPER_PAGE } from '@/consts/pagination';
import { describe, expect, it } from 'vitest';
import { TemplateDetail } from '@/components/pages/TemplateDetail';
import userEvent from '@testing-library/user-event';
import { mockIsIntersecting } from 'react-intersection-observer/test-utils';
import { Provider } from '@/components/ui/provider';

const createMockPostList = (postsNum: number = 21): Array<IDeclinePostSource> => {
  return [...Array(postsNum).keys()].map((index) => ({
    id: index + 1,
    publicId: `post-${index + 1}`,
    declineSituation: `テスト用の断り状況${index + 1}`,
    actualSituation: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '実際の' },
            { type: 'text', marks: [{ type: 'bold' }], text: '状況' },
            { type: 'text', text: `テスト${index + 1}` },
          ],
        },
      ],
    },
    updatedAt: '2026-02-21T00:00:00+00:00',
    user: {
      id: index + 1,
      userName: `test_user${index + 1}`,
    },
    templates: [
      {
        id: index + 1,
        doneFlag: true,
      },
    ],
  }));
};

const renderTopPage = (postsNum: number = 21, postList: Array<IDeclinePostSource> = createMockPostList(postsNum)) => {
  const totalPostsNum = postList.length;

  const defaultChildrenRoot = createDefaultMainLayoutRoot();
  const topRoute = defaultChildrenRoot.find((route) => route.path === '/')!;
  const postsRoute = defaultChildrenRoot.find((route) => route.path === '/resources/posts')!;

  topRoute.loader = async () => ({ maxPage: Math.ceil(totalPostsNum / POSTS_PATPER_PAGE) });
  postsRoute.loader = async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const offset = (page - 1) * POSTS_PATPER_PAGE;

    return Promise.resolve(postList.slice(offset, offset + POSTS_PATPER_PAGE).map((post) => DeclincePost.create(post)));
  };

  const Stub = createRoutesStub([
    createMainLayoutStubRoot([
      ...defaultChildrenRoot,
      {
        path: `/templates/:publicId`,
        Component: TemplateDetail,
        hydrateFallbackElement: <></>,
        loader: ({ params }: LoaderFunctionArgs) => {
          const post = postList.find((post) => post.publicId === (params.publicId ?? ''));

          return {
            currentPostPromise: Promise.resolve(DeclincePost.create(post!)),
          };
        },
      },
    ]),
  ]);

  render(
    <Provider>
      <Stub initialEntries={['/']} />
    </Provider>
  );
};

describe('トップページのテスト', () => {
  it('ヘッダーが表示されていること', async () => {
    renderTopPage(0);
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

  it('ページタイトルが表示されていること。', async () => {
    renderTopPage(0);
    const pageTitle = await screen.findByRole('heading', { level: 2, name: 'テンプレート一覧' });

    expect(pageTitle).toBeVisible();
  });

  it('ページ説明文が表示されていること。', async () => {
    renderTopPage(0);
    const pageTitle = await screen.findByText('断り方のテンプレートを共有して、みんなで克服しよう');

    expect(pageTitle).toBeVisible();
  });

  it('画面読み込み時にスピナーが表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE;
    renderTopPage(postNum);

    const spinner = await screen.findByTestId('main-spinner');

    expect(spinner).toBeVisible();
  });

  it('データが最大取得件数以下の時に、一覧にデータ数分表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE;
    renderTopPage(postNum);

    const topPage = await screen.findByTestId('top-page');
    const list = await within(topPage).findByRole('list');
    const items = await within(list).findAllByRole('listitem');

    expect(items).toHaveLength(postNum);
  });

  it('データが最大取得件数より多い時に、初期ロード時に一覧に最大取得件数分のみ表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE + 1;
    renderTopPage(postNum);

    const topPage = await screen.findByTestId('top-page');
    const list = await within(topPage).findByRole('list');
    const items = await within(list).findAllByRole('listitem');

    expect(items).toHaveLength(POSTS_PATPER_PAGE);
  });

  it('投稿内に断りたい状況が表示されること', async () => {
    renderTopPage(1);

    const declineSituation = await screen.findByRole('heading', { level: 3, name: 'テスト用の断り状況1' });
    expect(declineSituation).toBeVisible();
  });

  it('投稿内にユーザー名が表示されること', async () => {
    renderTopPage(1);

    const userName = await screen.findByText('test_user1');
    expect(userName).toBeVisible();
  });

  it('投稿に実際にあった状況が表示されること', async () => {
    renderTopPage(1);

    const actualSituation = await screen.findByText('実際の状況テスト1');
    expect(actualSituation).toBeVisible();
  });

  it('投稿に更新時刻が表示されること', async () => {
    renderTopPage(1);

    const updatedAt = await screen.findByText('2026/2/21');
    expect(updatedAt).toBeVisible();
  });

  it('実行済みの投稿の場合、実行済みタグが表示されること。', async () => {
    renderTopPage(1);

    const doneTag = await screen.findByText('実行済み');
    expect(doneTag).toBeVisible();
  });

  it('実行済みでない投稿の場合、実行済みタグが表示されないこと。', async () => {
    const undonePost = {
      ...createMockPostList(1)[0],
      templates: [{ id: 1, doneFlag: false }],
    };

    renderTopPage(1, [undonePost]);

    act(() => {
      const doneTag = screen.queryByText('実行済み');
      expect(doneTag).not.toBeInTheDocument();
    });
  });

  it('投稿をクリックすると、対象の詳細ページが表示されること。', async () => {
    renderTopPage(1);

    const topPage = await screen.findByTestId('top-page');
    const list = await within(topPage).findByRole('list');
    const item = await within(list).findByRole('listitem');

    const user = userEvent.setup();
    await user.click(item);

    await waitFor(() => {
      const topPage = screen.getByTestId('template-detail-page');
      expect(topPage).toBeVisible();
    });

    const declineSituation = await screen.findByText('テスト用の断り状況1');
    expect(declineSituation).toBeVisible();
  });

  it('データが最大取得件数以下の時に、一覧にデータ数分表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE;
    renderTopPage(postNum);

    const topPage = await screen.findByTestId('top-page');
    const list = await within(topPage).findByRole('list');
    const items = await within(list).findAllByRole('listitem');

    expect(items).toHaveLength(postNum);
  });

  it('データが最大取得件数より多い時に、初期ロード時に一覧に最大取得件数分のみ表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE + 1;
    renderTopPage(postNum);

    const topPage = await screen.findByTestId('top-page');
    const list = await within(topPage).findByRole('list');
    const items = await within(list).findAllByRole('listitem');

    expect(items).toHaveLength(POSTS_PATPER_PAGE);
  });

  it('最下部までスクロールするとスピナーが表示されること。', async () => {
    const postNum = POSTS_PATPER_PAGE + 1;
    renderTopPage(postNum);

    // 初回ロード完了を待つ
    await screen.findByTestId('main-spinner');
    await waitForElementToBeRemoved(() => screen.getByTestId('main-spinner'));

    const bottomBoundary = screen.getByTestId('bottom-boundary');
    mockIsIntersecting(bottomBoundary, true);

    const spinner = await screen.findByTestId('main-spinner');
    expect(spinner).toBeVisible();
  });

  it('最下部までスクロールすると投稿が追加で表示されること', async () => {
    const postNum = POSTS_PATPER_PAGE + 1;
    renderTopPage(postNum);

    // 初回ロード完了を待つ
    await screen.findByTestId('main-spinner');
    await waitForElementToBeRemoved(() => screen.getByTestId('main-spinner'));

    const bottomBoundary = screen.getByTestId('bottom-boundary');
    mockIsIntersecting(bottomBoundary, true);

    const addingPostTitle = await screen.findByRole('heading', { level: 3, name: `テスト用の断り状況${postNum}` });
    expect(addingPostTitle).toBeVisible();
  });
});
