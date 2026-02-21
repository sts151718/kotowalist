import { render, screen } from '@testing-library/react';
import { Provider } from '../components/ui/provider';
import App from '../App';

describe('vitest動作確認', () => {
  it('タイトルが表示されること', async () => {
    render(
      <Provider>
        <App />
      </Provider>
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
});
