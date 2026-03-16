import { createRoutesStub } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from '@/components/ui/provider';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot, type MockAuthState } from './helpers/mainLayoutStub';
import { updateDeclinePost } from '@/lib/supabase/declinePosts';
import type { IDeclinePost } from '@/domain/DeclinePost';
import { TemplateEdit } from '@/components/pages/TemplateEdit';
import { templateUpdateAction } from '@/routes/actions/templateUpdateAction';

const mockPostRecord: IDeclinePost = {
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

const renderTemplateEditPage = (authState: MockAuthState = 'authenticated') => {
  const defaultChildrenRoot = createDefaultMainLayoutRoot();

  const Stub = createRoutesStub([
    createMainLayoutStubRoot(
      [
        ...defaultChildrenRoot,
        {
          path: '/templates/:publicId',
          Component: () => <div data-testid="template-detail-page" />,
          hydrateFallbackElement: <></>,
        },
        {
          path: '/templates/:publicId/edit',
          Component: TemplateEdit,
          action: templateUpdateAction,
          loader: () => {
            return {
              currentPostPromise: Promise.resolve(mockPostRecord),
            };
          },
          hydrateFallbackElement: <></>,
        },
      ],
      authState
    ),
  ]);

  render(
    <Provider>
      <Stub initialEntries={[`/templates/${mockPostRecord.publicId}/edit`]} />
    </Provider>
  );
};

const inputValidForm = async () => {
  const templateEditPage = await screen.findByTestId('template-edit-page');
  await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
  const user = userEvent.setup();

  const declineSituation = within(templateEditPage).getByRole('textbox', { name: '断りたい状況' });
  await user.clear(declineSituation);
  await user.type(declineSituation, '上司からの飲み会の誘い');

  const openingText = within(templateEditPage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' })[0];
  await user.type(openingText, 'お誘いありがとうございます。');

  const closingText = within(templateEditPage).getAllByRole('textbox', { name: '締めの言葉（代替案）' })[0];
  await user.type(closingText, 'また別の機会にお願いします。');
};

const fillTextareaByName = async (name: string, value: string, index = 0) => {
  const templateEditPage = await screen.findByTestId('template-edit-page');
  await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });

  const user = userEvent.setup();
  const textarea = within(templateEditPage).getAllByRole('textbox', { name })[index];

  await user.clear(textarea);
  await user.type(textarea, value);
};

const fillRichTextEditor = async (testId: string, value: string) => {
  const user = userEvent.setup({ delay: null });

  const templateEditPage = await screen.findByTestId('template-edit-page');
  await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
  const editor = within(templateEditPage).getByTestId(testId);
  const input = within(editor).getByRole('textbox');

  await user.click(input);
  await user.paste(value);
};

const mockUpdateDeclinePost = vi.mocked(updateDeclinePost);

describe('投稿ページのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateDeclinePost.mockResolvedValue(mockPostRecord.publicId);
  });

  it('ヘッダーが表示されていること', async () => {
    renderTemplateEditPage();

    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

  it('ページタイトルが表示されていること', async () => {
    renderTemplateEditPage();

    const pageTitle = await screen.findByRole('heading', { level: 2, name: 'テンプレート編集' });

    expect(pageTitle).toBeVisible();
  });

  it('スピナーが表示されること。', async () => {
    renderTemplateEditPage();

    const spinner = await screen.findByTestId('main-spinner');

    expect(spinner).toBeVisible();
  });

  it('全ての入力欄が表示されていること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });

    expect(await within(templateEditPage).findByText('断りたい状況')).toBeVisible();
    expect(within(templateEditPage).getByTestId('actual-situation-editor')).toBeVisible();
    expect(within(templateEditPage).getByTestId('actual-feeling-editor')).toBeVisible();
    expect(within(templateEditPage).getByTestId('demerit-editor')).toBeVisible();
    expect(within(templateEditPage).getByText('実際にあった状況')).toBeVisible();
    expect(within(templateEditPage).getByText('当時の心境')).toBeVisible();
    expect(within(templateEditPage).getByText('断らなかったときのデメリット')).toBeVisible();
    expect(within(templateEditPage).getAllByText('初めの言葉（感謝の言葉）')).toHaveLength(2);
    expect(within(templateEditPage).getAllByText('締めの言葉（代替案）')).toHaveLength(2);
    expect(within(templateEditPage).getByRole('textbox', { name: '断りたい状況' })).toBeVisible();
    expect(within(templateEditPage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' })).toHaveLength(2);
    expect(within(templateEditPage).getAllByRole('textbox', { name: '締めの言葉（代替案）' })).toHaveLength(2);
    expect(within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' })).toHaveLength(2);
  });

  it('既存の入力値が初期表示されること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const declineSituation = within(templateEditPage).getByRole('textbox', { name: '断りたい状況' });
    const openingTexts = within(templateEditPage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' });
    const closingTexts = within(templateEditPage).getAllByRole('textbox', { name: '締めの言葉（代替案）' });
    const doneResults = within(templateEditPage).getAllByRole('textbox', { name: '実行結果' });
    const checkboxes = within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' });

    expect(declineSituation).toHaveValue(mockPostRecord.declineSituation);
    expect(openingTexts[0]).toHaveValue(mockPostRecord.templates[0].openingText);
    expect(openingTexts[1]).toHaveValue(mockPostRecord.templates[1].openingText);
    expect(closingTexts[0]).toHaveValue(mockPostRecord.templates[0].closingText);
    expect(closingTexts[1]).toHaveValue(mockPostRecord.templates[1].closingText);
    expect(doneResults).toHaveLength(1);
    expect(doneResults[0]).toHaveValue(mockPostRecord.templates[0].doneResult);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('更新するボタンが活性状態で表示されていること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const submitButton = await within(templateEditPage).findByRole('button', { name: '更新する' });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeEnabled();
  });

  it('未実行テンプレートで実行済みをチェックすると、実行結果が表示されること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const user = userEvent.setup();

    expect(within(templateEditPage).getAllByRole('textbox', { name: '実行結果' })).toHaveLength(1);

    await user.click(within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' })[1]);

    const doneResults = await within(templateEditPage).findAllByRole('textbox', { name: '実行結果' });

    expect(doneResults).toHaveLength(2);
    expect(doneResults[1]).toBeVisible();
  });

  it('テンプレートを追加できること。', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const addButton = within(templateEditPage).getByRole('button', { name: 'テンプレートを追加' });

    expect(within(templateEditPage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' })).toHaveLength(2);
    expect(within(templateEditPage).getAllByRole('textbox', { name: '締めの言葉（代替案）' })).toHaveLength(2);

    await userEvent.setup().click(addButton);

    await waitFor(() => {
      const openingTexts = within(templateEditPage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' });
      const closingTexts = within(templateEditPage).getAllByRole('textbox', { name: '締めの言葉（代替案）' });
      const checkboxes = within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' });

      expect(openingTexts).toHaveLength(3);
      expect(closingTexts).toHaveLength(3);
      expect(checkboxes).toHaveLength(3);
      expect(openingTexts[2]).toHaveValue('');
      expect(closingTexts[2]).toHaveValue('');
      expect(checkboxes[2]).not.toBeChecked();
    });
  });
  it.skip('更新成功後、更新処理が実行されて詳細ページへ遷移すること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const submitButton = within(templateEditPage).getByRole('button', { name: '更新する' });
    const user = userEvent.setup();

    await fillTextareaByName('断りたい状況', '更新後の断りたい状況');
    await user.click(submitButton);

    const detailPage = await screen.findByTestId('template-detail-page');

    expect(detailPage).toBeVisible();
  });

  describe('バリデーションテスト', () => {
    it('断りたい状況が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('断りたい状況', ' ');

      const errorMessage = await screen.findByText('断りたい状況は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('断りたい状況が100文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('断りたい状況', 'a'.repeat(101));

      const errorMessage = await screen.findByText('断りたい状況は100文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('実際の状況が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillRichTextEditor('actual-situation-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('実際の状況は500文字以内で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('当時の心境が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillRichTextEditor('actual-feeling-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('当時の心境は500文字以内で入力してください。');

      expect(errorMessage).toBeVisible();
    });

    it('断らなかったときのデメリットが500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillRichTextEditor('demerit-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('断らなかったときのデメリットは500文字以内で入力してください。');

      expect(errorMessage).toBeVisible();
    });

    it('初めの言葉が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('初めの言葉（感謝の言葉）', ' ', 0);

      const errorMessage = await screen.findByText('初めの言葉は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('初めの言葉が300文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('初めの言葉（感謝の言葉）', 'a'.repeat(301), 0);

      const errorMessage = await screen.findByText('初めの言葉は300文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('締めの言葉が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('締めの言葉（代替案）', ' ', 0);

      const errorMessage = await screen.findByText('締めの言葉は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('締めの言葉が300文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      await fillTextareaByName('締めの言葉（代替案）', 'a'.repeat(301), 0);

      const errorMessage = await screen.findByText('締めの言葉は300文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('実行結果が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateEditPage();

      const templateEditPage = await screen.findByTestId('template-edit-page');
      await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
      const user = userEvent.setup();

      await user.click(within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' })[1]);
      await user.type(
        (await within(templateEditPage).findAllByRole('textbox', { name: '実行結果' }))[1],
        'a'.repeat(501)
      );

      const errorMessage = await screen.findByText('実行結果は500文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });
  });

  it('実行済みをチェックして実行結果が未入力の場合、必須条件によりボタンが非活性になること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const submitButton = within(templateEditPage).getByRole('button', { name: '更新する' });
    const user = userEvent.setup();

    expect(submitButton).toBeEnabled();

    await user.click(within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' })[1]);

    const doneResult = (await within(templateEditPage).findAllByRole('textbox', { name: '実行結果' }))[1];

    await user.click(doneResult);
    await user.tab();

    expect(doneResult).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('必須項目を全て入力すると更新するボタンが活性になること', async () => {
    renderTemplateEditPage();

    const templateEditPage = await screen.findByTestId('template-edit-page');
    await within(templateEditPage).findByRole('textbox', { name: '断りたい状況' });
    const submitButton = within(templateEditPage).getByRole('button', { name: '更新する' });

    await userEvent.setup().click(within(templateEditPage).getAllByRole('checkbox', { name: '実行済み' })[1]);

    await inputValidForm();
    await fillTextareaByName('実行結果', '送別会は断れた', 1);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });
});
