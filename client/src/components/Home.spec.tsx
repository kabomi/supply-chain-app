import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { Home } from './Home';
import { Mock, vi } from 'vitest';
import { usePostLatestEvent } from '../services/event.service';

vi.mock('../services/event.service', () => ({
  usePostLatestEvent: vi.fn()
}));

beforeEach(() => {
  vi.resetAllMocks();
  (usePostLatestEvent as Mock).mockReturnValue({
    isLoading: false,
    error: null,
    fetchLatestEvent: vi.fn(),
    data: { description: 'Last Event' }
  });
});

test('renders Home component without crashing', () => {
  const { container } = render(
    <StrictMode>
      <Home />
    </StrictMode>
  );
  expect(container).toBeDefined();
});

test('renders a search input element', async () => {
  render(
    <StrictMode>
      <Home />
    </StrictMode>
  );
  const inputElement = await screen.findByTestId('home-search-input');
  expect(inputElement).toBeInTheDocument();
});

test('renders a search action element', async () => {
  render(
    <StrictMode>
      <Home />
    </StrictMode>
  );
  const inputElement = await screen.findByTestId('home-search-action');
  expect(inputElement).toBeInTheDocument();
});

describe('Searching', () => {
  test('changes button text to loading', async () => {
    (usePostLatestEvent as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      fetchLatestEvent: vi.fn(),
      data: { description: 'Last Event' }
    });
    render(
      <StrictMode>
        <Home />
      </StrictMode>
    );
    const inputElement = await screen.findByTestId('home-search-action');
    await userEvent.click(inputElement);
    expect(inputElement).toHaveTextContent('loading ...');
  });
  test('shows last event when retrieved data successfully', async () => {
    (usePostLatestEvent as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      fetchLatestEvent: vi.fn(),
      data: { description: 'Last Event' }
    });
    render(
      <StrictMode>
        <Home />
      </StrictMode>
    );
    const element = await screen.findByTestId('home-search-response');
    expect(element).toHaveTextContent('Last Event');
  });
  test('shows an error message when comes an error response', async () => {
    (usePostLatestEvent as Mock).mockReturnValue({
      isLoading: false,
      error: true,
      fetchLatestEvent: vi.fn(),
      data: { description: 'Last Event' }
    });
    render(
      <StrictMode>
        <Home />
      </StrictMode>
    );
    const element = await screen.findByTestId('home-search-error');
    expect(element).toHaveTextContent('An error occurred');
  });
});