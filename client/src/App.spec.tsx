import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../test/customRenders';
import { Mock } from 'vitest';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    (global.fetch as Mock).mockResolvedValue({
      json: vi.fn().mockResolvedValue({ items: [] }),
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders Home link', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const linkElement = screen.getByRole('link', { name: /Home/i });
    expect(linkElement).toBeInTheDocument();
  });

  it('renders About link', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/About/i);

    expect(linkElement).toBeInTheDocument();
  });

  it('renders Items link', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/Items/i);
    await userEvent.click(linkElement);

    expect(linkElement).toBeInTheDocument();
  });
  it('renders Home component by default', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const homeElement = screen.getByTestId('home-page');
    expect(homeElement).toBeInTheDocument();
  });
  it('renders About page', async () => {
    const { history } = renderWithProviders(<App />, {
      initialRouterEntries: ['/about'],
    });
    const element = screen.getByText(/About Page/i);
    expect(element).toBeInTheDocument();
    await waitFor(() => expect(history.location.pathname).toBe('/about'));
  });

  it('renders Items page', async () => {
    const { history } = renderWithProviders(<App />, {
      initialRouterEntries: ['/items'],
    });
    const element = screen.getByText(/No items to show/i);
    expect(element).toBeInTheDocument();
    await waitFor(() => expect(history.location.pathname).toBe('/items'));
  });

  it('renders Item Detail page', async () => {
    const { history } = renderWithProviders(<App />, {
      initialRouterEntries: ['/items/harry'],
    });
    const element = screen.getByText(/No items to show/i);
    expect(element).toBeInTheDocument();
    await waitFor(() => expect(history.location.pathname).toBe('/items/harry'));
  });
});
