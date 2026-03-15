import { createRoutesStub, redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from '@/components/ui/provider';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot, type MockAuthState } from './helpers/mainLayoutStub';
import { existsEmail, existsUserName } from '@/lib/supabase/users';

const renderSignupPage = (authState: MockAuthState = 'guest', action: ActionFunction = async () => ({})) => {
  const defaultChildrenRoot = createDefaultMainLayoutRoot();

  const signupRoute = defaultChildrenRoot.find((route) => route.path === 'signup')!;

  signupRoute.action = action;
  const Stub = createRoutesStub([createMainLayoutStubRoot(defaultChildrenRoot, authState)]);

  render(
    <Provider>
      <Stub initialEntries={['/signup']} />
    </Provider>
  );
};

const inputValidForm = async () => {
  const signupPage = await screen.findByTestId('sign-up-page');

  const user = userEvent.setup();

  await user.type(within(signupPage).getByRole('textbox', { name: 'ユーザー名' }), 'valid_user');
  await user.tab();
  await user.type(within(signupPage).getByRole('textbox', { name: 'メールアドレス' }), 'valid@example.com');
  await user.tab();
  await user.type(within(signupPage).getByLabelText('パスワード'), 'password123');
  await user.tab();
  await user.type(within(signupPage).getByLabelText('パスワード（確認）'), 'password123');
  await user.tab();
};

const mockExistsEmail = vi.mocked(existsEmail);
const mockExistsUserName = vi.mocked(existsUserName);

describe('新規登録ページのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsEmail.mockResolvedValue(false);
    mockExistsUserName.mockResolvedValue(false);
  });

  it('ヘッダーが表示されていること', async () => {
    renderSignupPage();
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

  it('ページタイトルが表示されていること', async () => {
    renderSignupPage();

    const pageTitle = await screen.findByRole('heading', { level: 2, name: '新規登録' });

    expect(pageTitle).toBeVisible();
  });

  it('各入力欄が表示されていること', async () => {
    renderSignupPage();

    const userName = await screen.findByRole('textbox', { name: 'ユーザー名' });
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

    const signupPage = await screen.findByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('ログインリンクが表示されていること', async () => {
    renderSignupPage();

    const signupPage = await screen.findByTestId('sign-up-page');
    const loginLink = within(signupPage).getByRole('link', { name: 'ログイン' });

    expect(loginLink).toBeVisible();
  });

  it('ユーザー名が不正な値のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const userName = await screen.findByRole('textbox', { name: 'ユーザー名' });

    await user.type(userName, 'ab');
    await user.tab();

    const errorMsg = await screen.findByText('ユーザー名は3文字以上で入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('メールアドレスが不正な形式のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const email = await screen.findByRole('textbox', { name: 'メールアドレス' });

    await user.type(email, 'invalid-email');
    await user.tab();

    const errorMsg = await screen.findByText('有効なメールアドレスを入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('パスワードが10文字以下のときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const password = await screen.findByLabelText('パスワード');
    await user.type(password, 'a12345678');
    await user.tab();

    const errorMsg = await screen.findByText('パスワードは10文字以上で入力してください');

    expect(errorMsg).toBeVisible();
  });

  it('パスワードが許可外文字を含むときにエラーメッセージが表示されること', async () => {
    renderSignupPage();
    const user = userEvent.setup();

    const password = await screen.findByLabelText('パスワード');

    await user.type(password, 'password12(');
    await user.tab();

    const errorMsg = await screen.findByText('パスワードは英数字と特定の記号（!@#$%^&*-_）のみ使用可能です');

    expect(errorMsg).toBeVisible();
  });

  it('確認パスワードが一致しないときにエラーメッセージが表示されること', async () => {
    renderSignupPage();

    const password = await screen.findByLabelText('パスワード');
    const passwordConfirm = screen.getByLabelText('パスワード（確認）');

    const user = userEvent.setup();
    await user.type(password, 'password123');
    await user.tab();
    await user.type(passwordConfirm, 'password999');
    await user.tab();

    const errorMsg = await screen.findByText('入力したパスワードと一致していません。');

    expect(errorMsg).toBeVisible();
  });

  it('ユーザー名とメールアドレスが重複しているときにエラーメッセージが表示されること', async () => {
    mockExistsUserName.mockResolvedValue(true);
    mockExistsEmail.mockResolvedValue(true);

    renderSignupPage();

    await inputValidForm();

    const userNameErrorMsg = await screen.findByText('入力したユーザー名が重複しています。');
    const emailErrorMsg = await screen.findByText('入力したパスワードが重複しています。');

    expect(userNameErrorMsg).toBeVisible();
    expect(emailErrorMsg).toBeVisible();
  });

  it('有効な入力値を入れると新規登録ボタンが活性になること', async () => {
    renderSignupPage();

    const signupPage = await screen.findByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });

    await inputValidForm();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('登録ボタンクリック後、エラーがあった場合、エラーメッセージが表示されること', async () => {
    const action = vi.fn(async () => ({ isError: true }));
    renderSignupPage('guest', action);

    await inputValidForm();

    const signupPage = await screen.findByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });

    expect(submitButton).toBeEnabled();
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

    renderSignupPage('guest', action);

    await inputValidForm();

    const signupPage = await screen.findByTestId('sign-up-page');
    const submitButton = within(signupPage).getByRole('button', { name: '新規登録' });
    await userEvent.click(submitButton);

    const topPage = await screen.findByTestId('top-page');

    expect(topPage).toBeVisible();
  });

  it('認証済み状態の時、トップページに遷移されること', async () => {
    renderSignupPage('authenticated');

    const topPage = await screen.findByTestId('top-page');
    expect(topPage).toBeVisible();
  });

  it('認証エラーの時、サインアップページに遷移されること', async () => {
    renderSignupPage('error');

    const signUpPage = await screen.findByTestId('sign-up-page');
    expect(signUpPage).toBeVisible();
  });
});
