import {
  createDefaultMainLayoutRoot,
  createMainLayoutStubRoot,
  type MockAuthState,
  stubAuthenticatedUser,
} from './helpers/mainLayoutStub';
import { TemplateDetail } from '@/components/pages/TemplateDetail';
import { DeclincePost, type IDeclinePost } from '@/domain/DeclinePost';
import { createRoutesStub } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Provider } from '@/components/ui/provider';

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
    id: stubAuthenticatedUser.id,
    userName: stubAuthenticatedUser.userName,
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

const renderDetailPage = (post: IDeclinePost, authState: MockAuthState = 'guest') => {
  const defaultChildrenRoot = createDefaultMainLayoutRoot();

  const Stub = createRoutesStub([
    createMainLayoutStubRoot(
      [
        ...defaultChildrenRoot,
        {
          path: `/templates/${post.publicId}`,
          Component: TemplateDetail,
          loader: () => {
            return {
              currentPostPromise: Promise.resolve(DeclincePost.create(post)),
            };
          },
        },
      ],
      authState
    ),
  ]);

  render(
    <Provider>
      <Stub initialEntries={[`/templates/${post.publicId}`]} />
    </Provider>
  );
};

describe('テンプレート詳細ページのテスト', () => {
  it('ヘッダーが表示されていること', async () => {
    renderDetailPage(mockDefaultPostRecord);
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

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

  it('投稿したユーザーで認証している場合、編集ボタンが表示されること', async () => {
    renderDetailPage(mockDefaultPostRecord, 'authenticated');

    await screen.findByText(mockDefaultPostRecord.declineSituation);
    const editButton = screen.getByRole('button', { name: '編集' });

    expect(editButton).toBeInTheDocument();
  });

  it('他のユーザーで認証している場合、編集ボタンが表示されないこと', async () => {
    renderDetailPage(
      {
        ...mockDefaultPostRecord,
        user: {
          id: 999,
          userName: 'other_user',
        },
      },
      'authenticated'
    );

    await screen.findByText(mockDefaultPostRecord.declineSituation);
    const editButton = screen.queryByRole('button', { name: '編集' });

    expect(editButton).not.toBeInTheDocument();
  });

});
