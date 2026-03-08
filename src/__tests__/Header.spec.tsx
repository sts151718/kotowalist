import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from '@/components/ui/provider';
import { createRoutesStub } from 'react-router';
import 'react-intersection-observer/test-utils';
import { createDefaultMainLayoutRoot, createMainLayoutStubRoot, type MockAuthState } from './helpers/mainLayoutStub';

vi.mock('@/lib/supabase/users', () => ({
  existsEmail: vi.fn().mockResolvedValue(true),
  existsUserName: vi.fn().mockResolvedValue(true),
}));

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
});
