import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from '@/components/ui/provider';
import { createRoutesStub } from 'react-router';
import 'react-intersection-observer/test-utils';
import {
  createDefaultMainLayoutRoot,
  createMainLayoutStubRoot,
  stubAuthenticatedUser,
  type MockAuthState,
} from './helpers/mainLayoutStub';

const renderHeader = (authState: MockAuthState = 'guest') => {
  const defaultChildrenRoot = createDefaultMainLayoutRoot();

  const children = [
    ...defaultChildrenRoot,
    {
      path: 'dummy',
      Component: () => <div></div>,
    },
  ];

  const Stub = createRoutesStub([createMainLayoutStubRoot(children, authState)]);

  render(
    <Provider>
      <Stub initialEntries={['/dummy']} />
    </Provider>
  );
};

describe('ヘッダーコンポーネントのテスト', () => {
  it('ロゴが表示されていること', async () => {
    renderHeader();
    const header = await screen.findByRole('banner');
    const headerLogo = within(header).getByRole('heading', { level: 1, name: '断リスト' });

    expect(headerLogo).toBeVisible();
  });

  it('ロゴをクリックするとトップページへ遷移すること', async () => {
    renderHeader();

    const header = await screen.findByRole('banner');
    const headerLogoLink = within(header).getByRole('link', { name: '断リスト' });

    const user = userEvent.setup();
    await user.click(headerLogoLink);

    await waitFor(() => {
      const topPage = screen.getByTestId('top-page');
      expect(topPage).toBeVisible();
    });
  });

  it('未認証時、新規登録ページに遷移できること', async () => {
    renderHeader();

    const header = await screen.findByRole('banner');
    const signupButton = within(header).getByRole('button', { name: '新規登録' });

    const user = userEvent.setup();
    await user.click(signupButton);

    await waitFor(() => {
      const signupPage = screen.getByTestId('sign-up-page');
      expect(signupPage).toBeVisible();
    });
  });

  it('未認証時、サインインページに遷移できること', async () => {
    renderHeader();

    const header = await screen.findByRole('banner');
    const signinButton = within(header).getByRole('button', { name: 'ログイン' });

    const user = userEvent.setup();
    await user.click(signinButton);

    await waitFor(() => {
      const signinPage = screen.getByTestId('sign-in-page');
      expect(signinPage).toBeVisible();
    });
  });

  it.skip('認証時、新規投稿ページに遷移できること', async () => {
    renderHeader('authenticated');

    const header = await screen.findByRole('banner');
    const registerButton = within(header).getByRole('button', { name: '新規投稿' });

    const user = userEvent.setup();
    await user.click(registerButton);
  });

  it('認証時、ログインユーザー名が描画されていること', async () => {
    renderHeader('authenticated');

    const header = await screen.findByRole('banner');

    const userName = await within(header).findByText(stubAuthenticatedUser.userName);

    expect(userName).toBeInTheDocument();
  });

  it('認証時、ログアウトボタンが表示されていること', async () => {
    renderHeader('authenticated');

    const header = await screen.findByRole('banner');
    const signoutButton = within(header).getByRole('button', { name: 'ログアウト' });
    expect(signoutButton).toBeVisible();
  });
});
