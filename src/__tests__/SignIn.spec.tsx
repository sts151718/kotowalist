import { createRoutesStub, redirect, type ActionFunction, type ActionFunctionArgs } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from '@/components/ui/provider';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot, type MockAuthState } from './helpers/mainLayoutStub';

const renderSignInPage = (authState: MockAuthState = 'guest', action: ActionFunction = async () => ({})) => {
  const defaultChildrenRoot = createDefaultMainLayoutRoot();

  const signInRoute = defaultChildrenRoot.find((route) => route.path === 'signin')!;

  signInRoute.action = action;

  const Stub = createRoutesStub([createMainLayoutStubRoot(defaultChildrenRoot, authState)]);

  render(
    <Provider>
      <Stub initialEntries={['/signin']} />
    </Provider>
  );
};

const inputValidForm = async () => {
  const signupPage = await screen.findByTestId('sign-in-page');

  const user = userEvent.setup();

  await user.type(within(signupPage).getByRole('textbox', { name: 'メールアドレス' }), 'valid@example.com');
  await user.tab();
  await user.type(within(signupPage).getByLabelText('パスワード'), 'password123');
  await user.tab();
};

describe('新規登録ページのテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ヘッダーが表示されていること', async () => {
    renderSignInPage();
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(header).toBeVisible();
    expect(headerLogo).toBeVisible();
  });

  it('ページタイトルが表示されていること', async () => {
    renderSignInPage();

    const pageTitle = await screen.findByRole('heading', { level: 2, name: 'ログイン' });

    expect(pageTitle).toBeVisible();
  });

  it('各入力欄が表示されていること', async () => {
    renderSignInPage();

    const email = await screen.findByRole('textbox', { name: 'メールアドレス' });
    const password = screen.getByLabelText('パスワード');

    expect(email).toBeVisible();
    expect(password).toBeVisible();
  });

  it('新規登録ボタンが非活性状態で表示されていること', async () => {
    renderSignInPage();

    const signupPage = await screen.findByTestId('sign-in-page');
    const submitButton = within(signupPage).getByRole('button', { name: 'ログイン' });

    expect(submitButton).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('新規登録リンクが表示されていること', async () => {
    renderSignInPage();

    const signupPage = await screen.findByTestId('sign-in-page');
    const loginLink = within(signupPage).getByRole('link', { name: '新規登録' });

    expect(loginLink).toBeVisible();
  });

  it('有効な入力値を入れるとログインボタンが活性になること', async () => {
    renderSignInPage();

    const signupPage = await screen.findByTestId('sign-in-page');
    const submitButton = within(signupPage).getByRole('button', { name: 'ログイン' });

    await inputValidForm();

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('ログインボタンクリック後、エラーがあった場合、エラーメッセージが表示されること', async () => {
    const message = 'メールアドレスもしくはパスワードが間違っています';
    const action = vi.fn(async () => ({ isError: true, message }));
    renderSignInPage('guest', action);

    await inputValidForm();

    const signupPage = await screen.findByTestId('sign-in-page');
    const submitButton = within(signupPage).getByRole('button', { name: 'ログイン' });

    expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    const errorMsg = await screen.findByText(message);

    expect(errorMsg).toBeVisible();
  });

  it('入力値が正常の場合、トップへ遷移すること', async () => {
    const action = vi.fn(async ({ request }: ActionFunctionArgs) => {
      const formData = await request.formData();
      expect(formData.get('email')).toBe('valid@example.com');

      return redirect('/');
    });

    renderSignInPage('guest', action);

    await inputValidForm();

    const signupPage = await screen.findByTestId('sign-in-page');
    const submitButton = within(signupPage).getByRole('button', { name: 'ログイン' });
    await userEvent.click(submitButton);

    const topPage = await screen.findByTestId('top-page');

    expect(topPage).toBeVisible();
  });

  it('認証済み状態の時、トップページに遷移されること', async () => {
    renderSignInPage('authenticated');

    const topPage = await screen.findByTestId('top-page');
    expect(topPage).toBeVisible();
  });

  it('認証エラーの時、サインインページに遷移されること', async () => {
    renderSignInPage('error');

    const topPage = await screen.findByTestId('sign-in-page');
    expect(topPage).toBeVisible();
  });
});
