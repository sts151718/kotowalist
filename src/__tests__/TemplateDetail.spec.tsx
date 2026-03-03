import { TemplateDetail } from '@/components/pages/TemplateDetail';
import { DeclincePost, type IDeclinePost } from '@/domain/DeclinePost';
import { createRoutesStub } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from '@/components/ui/provider';
import { MainLayout } from '@/components/layouts/MainLayout';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Top } from '@/components/pages/Top';
import 'react-intersection-observer/test-utils';
import { Signup } from '@/components/pages/SignUp';

const mockDefaultPostRecord: IDeclinePost = {
  id: 1,
  publicId: 'aaaaaaa-aaaa-aaaa-aaaa-aaaaaaa',
  declineSituation: 'テスト用の断り状況',
  actualSituation: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '実際の' },
          { type: 'text', marks: [{ type: 'underline' }], text: '状況' },
          { type: 'text', text: 'テスト' },
        ],
      },
    ],
  },
  actualFeeling: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '当時の' },
          { type: 'text', marks: [{ type: 'bold' }], text: '状況' },
          { type: 'text', text: 'テスト' },
        ],
      },
    ],
  },
  updatedAt: '2026-02-21T00:00:00+00:00',
  demerit: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: '断らなかったときの' },
          {
            type: 'text',
            marks: [{ type: 'bold' }],
            text: 'デメリット',
          },
          { type: 'text', text: 'テスト' },
        ],
      },
    ],
  },
  user: {
    id: 1,
    userName: 'test_user',
  },
  templates: [
    {
      id: 1,
      doneFlag: true,
      doneResult: '実行結果テスト',
      closingText: '1つ目の締め文テスト',
      openingText: '1つ目の書き出しテスト',
    },
    {
      id: 2,
      doneFlag: false,
      doneResult: '',
      closingText: '2つ目の締め文テスト',
      openingText: '2つ目の書き出しテスト',
    },
  ],
};

const renderDetailPage = (post: IDeclinePost) => {
  const Stub = createRoutesStub([
    {
      Component: MainLayout,
      children: [
        {
          path: `/templates/${post.publicId}`,
          Component: TemplateDetail,
          loader: () => {
            return {
              currentPostPromise: Promise.resolve(DeclincePost.create(post)),
            };
          },
        },
        {
          path: '/',
          Component: Top,
          hydrateFallbackElement: <></>,
          loader: async () => ({ maxPage: 1 }),
        },
        {
          path: '/resources/posts',
          loader: async () => {
            return Promise.resolve([]);
          },
        },
        {
          path: 'signup',
          Component: Signup,
          action: () => ({}),
        },
      ],
    },
  ]);

  render(
    <Provider>
      <Stub initialEntries={[`/templates/${post.publicId}`]} />
    </Provider>
  );
};

describe('テンプレート詳細ページのテスト', () => {
  it('ヘッダーロゴが表示されていること', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(headerLogo).toBeVisible();
  });

  it('ヘッダーロゴをクリックするとトップページに遷移すること', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const header = await screen.findByRole('banner');
    const headerLogoLink = within(header).getByRole('link', { name: '断リスト' });

    const user = userEvent.setup();
    await user.click(headerLogoLink);

    await waitFor(() => {
      const topPage = screen.getByTestId('top-page');
      expect(topPage).toBeVisible();
    });
  });

  it('ヘッダーボタンから新規登録ページに遷移できること', async () => {
    renderDetailPage(mockDefaultPostRecord);

    const header = await screen.findByRole('banner');
    const signupButton = within(header).getByRole('button', { name: '新規登録' });

    const user = userEvent.setup();
    await user.click(signupButton);

    await waitFor(() => {
      const singupPage = screen.getByTestId('sign-up-page');
      expect(singupPage).toBeVisible();
    });
  });

  it.skip('ヘッダーのリンクからログインページに遷移できること', async () => {});

  it('ローディング中にスケルトンが表示されること', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const skelton = await screen.findByTestId('template-detail-skelton');

    expect(skelton).toBeVisible();
  });

  it('断りたい状況が表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const title = await screen.findByText(mockDefaultPostRecord.declineSituation);

    expect(title).toBeVisible();
  });

  it('ユーザー名が表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const userName = await screen.findByText(mockDefaultPostRecord.user.userName);

    expect(userName).toBeVisible();
  });

  it('最終更新日が表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const updatedAt = await screen.findByText(dayjs(mockDefaultPostRecord.updatedAt).format('YYYY/M/D'));

    expect(updatedAt).toBeVisible();
  });

  it('実行済みのテンプレートが1つ以上ある場合、実行済みタグが1つのみ表示されること。', async () => {
    renderDetailPage({
      ...mockDefaultPostRecord,
      templates: mockDefaultPostRecord.templates.map((template) => ({
        ...template,
        doneFlag: true,
      })),
    });
    const doneTags = await screen.findAllByText('実行済み');

    expect(doneTags).toHaveLength(1);
    expect(doneTags[0]).toBeVisible();
  });

  it('実行済みのテンプレートが1つもない場合、実行済みタグが表示されないこと。', async () => {
    renderDetailPage({
      ...mockDefaultPostRecord,
      templates: mockDefaultPostRecord.templates.map((template) => ({
        ...template,
        doneFlag: false,
      })),
    });
    const doneTag = screen.queryByText('実行済み');

    expect(doneTag).not.toBeInTheDocument();
  });

  it('実際の状況がHTMLで表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const paragraph = await screen.findByText(/実際の.*テスト/);
    const underlinedText = within(paragraph).getByText('状況', { selector: 'u' });

    expect(paragraph).toBeVisible();
    expect(paragraph).toHaveTextContent('実際の状況テスト');
    expect(underlinedText).toBeVisible();
  });

  it('実際の状況が登録されていないとき、画面に表示されないこと。', async () => {
    renderDetailPage({
      ...mockDefaultPostRecord,
      actualSituation: null,
    });

    expect(screen.queryByText('実際の状況')).not.toBeInTheDocument();
  });

  it('当時の心境がHTMLで表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const paragraph = await screen.findByText(/当時の.*テスト/);
    const boldText = within(paragraph).getByText('状況', { selector: 'strong' });

    expect(paragraph).toBeVisible();
    expect(paragraph).toHaveTextContent('当時の状況テスト');
    expect(boldText).toBeVisible();
  });

  it('当時の心境が登録されていないとき、画面に表示されないこと。', async () => {
    renderDetailPage({
      ...mockDefaultPostRecord,
      actualFeeling: null,
    });

    expect(screen.queryByText('当時の心境')).not.toBeInTheDocument();
  });

  it('断らなかったときのデメリットがHTMLで表示されていること。', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const paragraph = await screen.findByText(/断らなかったときの.*テスト/);
    const boldText = within(paragraph).getByText('デメリット', { selector: 'strong' });

    expect(paragraph).toBeVisible();
    expect(paragraph).toHaveTextContent('断らなかったときのデメリットテスト');
    expect(boldText).toBeVisible();
  });

  it('断らなかったときのデメリットが登録されていないとき、画面に表示されないこと。', async () => {
    renderDetailPage({
      ...mockDefaultPostRecord,
      demerit: null,
    });

    expect(screen.queryByText('断らなかったときのデメリット')).not.toBeInTheDocument();
  });

  it('テンプレートが複数表示されること', async () => {
    renderDetailPage(mockDefaultPostRecord);

    const template1 = await screen.findByTestId('template-detail-template1');
    const template2 = await screen.findByTestId('template-detail-template2');

    expect(template1).toBeVisible();
    expect(template2).toBeVisible();
  });

  it('テンプレートの初めの言葉と締めの言葉が表示されること。', async () => {
    renderDetailPage(mockDefaultPostRecord);

    const template1 = await screen.findByTestId('template-detail-template1');
    const openingText = within(template1).getByText('1つ目の書き出しテスト');
    const closingText = within(template1).getByText('1つ目の締め文テスト');

    expect(openingText).toBeVisible();
    expect(closingText).toBeVisible();
  });

  it('実行済みの場合、実行結果が表示されること。', async () => {
    renderDetailPage(mockDefaultPostRecord);

    const template1 = await screen.findByTestId('template-detail-template1');
    const doneResult = within(template1).getByText('実行結果テスト');

    expect(doneResult).toBeVisible();
  });

  it('実行済みでない場合、実行結果が表示されないこと。', async () => {
    renderDetailPage(mockDefaultPostRecord);

    const template2 = await screen.findByTestId('template-detail-template2');
    const doneResultTitle = within(template2).queryByText('実行結果');
    const doneResult = within(template2).queryByText('実行結果テスト');

    expect(doneResultTitle).not.toBeInTheDocument();
    expect(doneResult).not.toBeInTheDocument();
  });

  it('一覧ページへ戻るリンクをクリックすると、トップページに遷移すること', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const backLink = await screen.findByRole('link', { name: '一覧へ戻る' });

    const user = userEvent.setup();
    await user.click(backLink);

    await waitFor(() => {
      const topPage = screen.getByTestId('top-page');
      expect(topPage).toBeVisible();
    });
  });
});
