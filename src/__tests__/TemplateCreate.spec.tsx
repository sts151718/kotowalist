import { createRoutesStub } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from '@/components/ui/provider';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot, type MockAuthState } from './helpers/mainLayoutStub';
import { insertDeclinePost } from '@/lib/supabase/declinePosts';

vi.mock('@/components/molecules/tiptap/TiptapEditor', () => ({
  TiptapEditor: ({
    content,
    onChange,
    testId,
  }: {
    content?: {
      type: string;
      content?: Array<{ type: string; content?: Array<{ type: string; text: string }> }>;
    } | null;
    onChange?: (
      content: {
        type: 'doc';
        content: Array<{ type: 'paragraph'; content: Array<{ type: 'text'; text: string }> }>;
      } | null
    ) => void;
    testId?: string;
  }) => (
    <textarea
      data-testid={testId}
      value={content?.content?.[0]?.content?.[0]?.text ?? ''}
      onChange={(event) =>
        onChange?.({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: event.target.value }],
            },
          ],
        })
      }
    />
  ),
}));

const renderTemplateCreatePage = (authState: MockAuthState = 'authenticated') => {
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
      ],
      authState
    ),
  ]);

  render(
    <Provider>
      <Stub initialEntries={['/templates/create']} />
    </Provider>
  );
};

const inputValidForm = async () => {
  const templateCreatePage = await screen.findByTestId('template-create-page');
  const user = userEvent.setup();

  await user.type(within(templateCreatePage).getByRole('textbox', { name: '断りたい状況' }), '上司からの飲み会の誘い');
  await user.type(
    within(templateCreatePage).getByRole('textbox', { name: '初めの言葉（感謝の言葉）' }),
    'お誘いありがとうございます。'
  );
  await user.type(
    within(templateCreatePage).getByRole('textbox', { name: '締めの言葉（代替案）' }),
    'また別の機会にお願いします。'
  );
};

const getRichTextInput = async (testId: string) => {
  const templateCreatePage = await screen.findByTestId('template-create-page');
  return within(templateCreatePage).getByTestId(testId);
};

const fillTextareaByName = async (name: string, value: string) => {
  const templateCreatePage = await screen.findByTestId('template-create-page');
  const user = userEvent.setup();
  const textarea = within(templateCreatePage).getByRole('textbox', { name });

  await user.clear(textarea);
  await user.type(textarea, value);
};

const fillRichTextEditor = async (testId: string, value: string) => {
  const user = userEvent.setup();
  const input = await getRichTextInput(testId);

  await user.clear(input);
  await user.type(input, value);
};

const mockInsertDeclinePost = vi.mocked(insertDeclinePost);

describe('投稿ページのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsertDeclinePost.mockResolvedValue('created-public-id');
  });

  it('ヘッダーが表示されていること', async () => {
    renderTemplateCreatePage();

    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

  it('ページタイトルが表示されていること', async () => {
    renderTemplateCreatePage();

    const pageTitle = await screen.findByRole('heading', { level: 2, name: '新規テンプレート作成' });

    expect(pageTitle).toBeVisible();
  });

  it('ページ説明文が表示されていること', async () => {
    renderTemplateCreatePage();

    const description = await screen.findByText('断り方のテンプレートを作成して、共有しよう');

    expect(description).toBeVisible();
  });

  it('全ての入力欄が表示されていること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');

    expect(within(templateCreatePage).getByText('断りたい状況')).toBeVisible();
    expect(within(templateCreatePage).getByTestId('actual-situation-editor')).toBeVisible();
    expect(within(templateCreatePage).getByTestId('actual-feeling-editor')).toBeVisible();
    expect(within(templateCreatePage).getByTestId('demerit-editor')).toBeVisible();
    expect(within(templateCreatePage).getByText('実際にあった状況')).toBeVisible();
    expect(within(templateCreatePage).getByText('当時の心境')).toBeVisible();
    expect(within(templateCreatePage).getByText('断らなかったときのデメリット')).toBeVisible();
    expect(within(templateCreatePage).getByText('初めの言葉（感謝の言葉）')).toBeVisible();
    expect(within(templateCreatePage).getByText('締めの言葉（代替案）')).toBeVisible();
    expect(within(templateCreatePage).getByRole('textbox', { name: '断りたい状況' })).toBeVisible();
    expect(within(templateCreatePage).getByRole('textbox', { name: '初めの言葉（感謝の言葉）' })).toBeVisible();
    expect(within(templateCreatePage).getByRole('textbox', { name: '締めの言葉（代替案）' })).toBeVisible();
  });

  it('作成するボタンが非活性状態で表示されていること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const submitButton = within(templateCreatePage).getByRole('button', { name: '作成する' });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('実行済みをチェックすると、実行結果が表示されること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const user = userEvent.setup();

    expect(within(templateCreatePage).queryByRole('textbox', { name: '実行結果' })).not.toBeInTheDocument();

    await user.click(within(templateCreatePage).getByRole('checkbox', { name: '実行済み' }));

    const doneResult = await within(templateCreatePage).findByRole('textbox', { name: '実行結果' });

    expect(doneResult).toBeVisible();
  });

  it('テンプレートを追加できること。', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const addButton = within(templateCreatePage).getByRole('button', { name: 'テンプレートを追加' });

    expect(within(templateCreatePage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' })).toHaveLength(1);
    expect(within(templateCreatePage).getAllByRole('textbox', { name: '締めの言葉（代替案）' })).toHaveLength(1);

    await userEvent.setup().click(addButton);

    await waitFor(() => {
      expect(within(templateCreatePage).getAllByRole('textbox', { name: '初めの言葉（感謝の言葉）' })).toHaveLength(2);
      expect(within(templateCreatePage).getAllByRole('textbox', { name: '締めの言葉（代替案）' })).toHaveLength(2);
    });
  });

  describe('バリデーションテスト', () => {
    it('断りたい状況が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('断りたい状況', ' ');

      const errorMessage = await screen.findByText('断りたい状況は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('断りたい状況が100文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('断りたい状況', 'a'.repeat(101));

      const errorMessage = await screen.findByText('断りたい状況は100文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('実際の状況が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillRichTextEditor('actual-situation-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('実際の状況は500文字以内で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('当時の心境が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillRichTextEditor('actual-feeling-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('当時の心境は500文字以内で入力してください。');

      expect(errorMessage).toBeVisible();
    });

    it('断らなかったときのデメリットが500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillRichTextEditor('demerit-editor', 'a'.repeat(501));

      const errorMessage = await screen.findByText('断らなかったときのデメリットは500文字以内で入力してください。');

      expect(errorMessage).toBeVisible();
    });

    it('初めの言葉が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('初めの言葉（感謝の言葉）', ' ');

      const errorMessage = await screen.findByText('初めの言葉は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('初めの言葉が300文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('初めの言葉（感謝の言葉）', 'a'.repeat(301));

      const errorMessage = await screen.findByText('初めの言葉は300文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('締めの言葉が未入力の場合、必須エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('締めの言葉（代替案）', ' ');

      const errorMessage = await screen.findByText('締めの言葉は必須です');

      expect(errorMessage).toBeVisible();
    });

    it('締めの言葉が300文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      await fillTextareaByName('締めの言葉（代替案）', 'a'.repeat(301));

      const errorMessage = await screen.findByText('締めの言葉は300文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });

    it('実行結果が500文字を超える場合、文字数エラーが表示されること', async () => {
      renderTemplateCreatePage();

      const templateCreatePage = await screen.findByTestId('template-create-page');
      const user = userEvent.setup();

      await user.click(within(templateCreatePage).getByRole('checkbox', { name: '実行済み' }));
      await user.type(await within(templateCreatePage).findByRole('textbox', { name: '実行結果' }), 'a'.repeat(501));

      const errorMessage = await screen.findByText('実行結果は500文字以下で入力してください');

      expect(errorMessage).toBeVisible();
    });
  });

  it('実行済みをチェックして実行結果が未入力の場合、必須条件によりボタンが非活性になること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const submitButton = within(templateCreatePage).getByRole('button', { name: '作成する' });
    const user = userEvent.setup();

    await inputValidForm();
    expect(submitButton).toBeEnabled();

    await user.click(within(templateCreatePage).getByRole('checkbox', { name: '実行済み' }));

    const doneResult = await within(templateCreatePage).findByRole('textbox', { name: '実行結果' });

    await user.click(doneResult);
    await user.tab();

    expect(doneResult).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('必須項目を全て入力と作成するボタンが活性になること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const submitButton = within(templateCreatePage).getByRole('button', { name: '作成する' });

    await inputValidForm();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('入力値が正常の場合、詳細ページへ遷移すること', async () => {
    renderTemplateCreatePage();

    const templateCreatePage = await screen.findByTestId('template-create-page');
    const submitButton = within(templateCreatePage).getByRole('button', { name: '作成する' });

    await inputValidForm();
    await userEvent.setup().click(submitButton);

    const detailPage = await screen.findByTestId('template-detail-page');
    expect(detailPage).toBeVisible();
  });
});
