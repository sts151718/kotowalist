import { existsEmail, existsUserName } from '@/lib/supabase/users';
import { createRoutesStub, redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'react-intersection-observer/test-utils';
import { Provider } from '@/components/ui/provider';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot } from './helpers/mainLayoutStub';

vi.mock('@/lib/supabase/users');

const renderSignupPage = async (action: ActionFunction = async () => ({})) => {
  const defaultChildrenRoot = await createDefaultMainLayoutRoot();

  const signupRoute = defaultChildrenRoot.find((route) => route.path === 'signup')!;

  signupRoute.action = action;
  const Stub = createRoutesStub([createMainLayoutStubRoot(defaultChildrenRoot)]);

  render(
    <Provider>
      <Stub initialEntries={['/signup']} />
    </Provider>
  );
};

const inputValidForm = async () => {
  const user = userEvent.setup();

  await user.type(screen.getByRole('textbox', { name: 'ユーザー名' }), 'valid_user');
  await user.tab();
  await user.type(screen.getByRole('textbox', { name: 'メールアドレス' }), 'valid@example.com');
  await user.tab();
  await user.type(screen.getByLabelText('パスワード'), 'password123');
  await user.tab();
  await user.type(screen.getByLabelText('パスワード（確認）'), 'password123');
  await user.tab();
};

const mockExistsEmail = vi.mocked(existsEmail);
const mockExistsUserName = vi.mocked(existsUserName);

describe('新規登録ページのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsEmail.mockResolvedValue(true);
    mockExistsUserName.mockResolvedValue(true);
  });

  it('ヘッダーロゴが表示されていること', async () => {
    renderSignupPage();
    const header = screen.getByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(headerLogo).toBeVisible();
  });

  it('ヘッダーロゴをクリックするとトップページに遷移すること', async () => {
    renderSignupPage();
    const header = screen.getByRole('banner');
    const headerLogoLink = within(header).getByRole('link', { name: '断リスト' });

    const user = userEvent.setup();
    await user.click(headerLogoLink);

    await waitFor(() => {
      const topPage = screen.getByTestId('top-page');
      expect(topPage).toBeVisible();
    });
  });

  it('ヘッダーボタンから新規登録ページに遷移できること', async () => {
    renderSignupPage();
    const header = screen.getByRole('banner');
    const signupButton = within(header).getByRole('button', { name: '新規登録' });

    const user = userEvent.setup();
    await user.click(signupButton);

    await waitFor(() => {
      const singupPage = screen.getByTestId('sign-up-page');
      expect(singupPage).toBeVisible();
    });
  });

  it.skip('ヘッダーのリンクからログインページに遷移できること', async () => {});

  it('ページタイトルが表示されていること', async () => {
    renderSignupPage();

    const pageTitle = screen.getByRole('heading', { level: 2, name: '新規登録' });

    expect(pageTitle).toBeVisible();
  });

  it('各入力欄が表示されていること', async () => {
    renderSignupPage();

    const userName = screen.getByRole('textbox', { name: 'ユーザー名' });
    const email = screen.getByRole('textbox', { name: 'メールアドレス' });
    const password = screen.getByLabelText('パスワード');
    const passwordConfirm = screen.getByLabelText('パスワード（確認）');

    expect(userName).toBeVisible();
    expect(email).toBeVisible();
    expect(password).toBeVisible();
    expect(passwordConfirm).toBeVisible();
  });

  it('新規登録ボタンが非活性状態で表示されていること', async () => {
    renderSignupPage();

    const signupPage = screen.getByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('ログインリンクが表示されていること', async () => {
    renderSignupPage();

    const signupPage = screen.getByTestId('sign-up-page');
    const loginLink = within(signupPage).getByRole('link', { name: 'ログイン' });

    expect(loginLink).toBeVisible();
  });

  it('ユーザー名が不正な値のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const userName = screen.getByRole('textbox', { name: 'ユーザー名' });

    await user.type(userName, 'ab');
    await user.tab();

    const errorMsg = await screen.findByText('ユーザー名は3文字以上で入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('メールアドレスが不正な形式のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const email = screen.getByRole('textbox', { name: 'メールアドレス' });

    await user.type(email, 'invalid-email');
    await user.tab();

    const errorMsg = await screen.findByText('有効なメールアドレスを入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('パスワードが10文字以下のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const password = screen.getByLabelText('パスワード');
    await user.type(password, 'a12345678');
    await user.tab();

    const errorMsg = await screen.findByText('パスワードは10文字以上で入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('パスワードが許可外文字を含むときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const password = screen.getByLabelText('パスワード');

    await user.type(password, 'password12(');
    await user.tab();

    const errorMsg = await screen.findByText('パスワードは英数字と特定の記号（!@#$%^&*-_）のみ使用可能です');

    expect(errorMsg).toBeVisible();
  });

  it('確認パスワードが一致しないときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const password = screen.getByLabelText('パスワード');
    const passwordConfirm = screen.getByLabelText('パスワード（確認）');

    await user.type(password, 'password123');
    await user.tab();
    await user.type(passwordConfirm, 'password999');
    await user.tab();

    const errorMsg = await screen.findByText('入力したパスワードと一致していません。');

    expect(errorMsg).toBeVisible();
  });

  it('ユーザー名とメールアドレスが重複しているときにエラーメッセージが表示されること', async () => {
    mockExistsUserName.mockResolvedValue(false);
    mockExistsEmail.mockResolvedValue(false);

    renderSignupPage();

    await inputValidForm();

    const userNameErrorMsg = await screen.findByText('入力したユーザー名が重複しています。');
    const emailErrorMsg = await screen.findByText('入力したパスワードが重複しています。');

    expect(userNameErrorMsg).toBeVisible();
    expect(emailErrorMsg).toBeVisible();
  });

  it('有効な入力値を入れると新規登録ボタンが活性になること', async () => {
    renderSignupPage();

    const signupPage = screen.getByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });

    await inputValidForm();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('登録ボタンクリック後、エラーがあった場合、エラーメッセージが表示されること', async () => {
    const action = vi.fn(async () => ({ signupError: true as const }));
    renderSignupPage(action);

    await inputValidForm();

    const signupPage = screen.getByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });
    await userEvent.click(submitButton);

    const errorMsg = await screen.findByText('ユーザーの登録に失敗しました。');

    expect(errorMsg).toBeVisible();
  });

  it('入力値が正常の場合、トップへ遷移すること', async () => {
    const action = vi.fn(async ({ request }: ActionFunctionArgs) => {
      const formData = await request.formData();
      expect(formData.get('email')).toBe('valid@example.com');

      return redirect('/');
    });

    renderSignupPage(action);

    await inputValidForm();

    const signupPage = screen.getByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });
    await userEvent.click(submitButton);

    const topPage = await screen.findByTestId('top-page');

    expect(topPage).toBeVisible();
  });
});
