import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';
import { ItemList } from './ItemList';
import { useGetAllItems } from '../services/inventory.service';
import data from '../../test/data.fixture';
import { act } from 'react';
import { renderWithProviders } from '../../test/customRenders';

vi.mock('../services/inventory.service', () => ({
  useGetAllItems: vi.fn()
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock(import("react-router-dom"), async (importOriginal: any) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // your mocked methods
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    useParams: vi.fn()
  }
})



beforeEach(() => {
  vi.resetAllMocks();
  (useGetAllItems as Mock).mockReturnValue({
    isLoading: false,
    error: null,
    fetchAllItems: vi.fn(),
    data: data.items
  });
  (useNavigate as Mock).mockReturnValue(vi.fn());
  (useParams as Mock).mockReturnValue({});
});

it('renders ItemList component without crashing', async () => {
  const { container } = render(
  <BrowserRouter>
    <ItemList />
  </BrowserRouter>
  );
  expect(container).toBeDefined();
});

it('renders a list of items', async () => {
  render(
  <BrowserRouter>
    <ItemList />
  </BrowserRouter>
  );
  const firstElement = await screen.findByTestId('itemlist-1-card');
  const secondElement = await screen.findByTestId('itemlist-2-card');
  expect(firstElement).toBeInTheDocument();
  expect(secondElement).toBeInTheDocument();
});

describe('Details', () => {
  it('navigates to item detail on click', async () => {
    (useGetAllItems as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      fetchAllItems: vi.fn(),
      data: data.items
    });
    render(
      <BrowserRouter>
        <ItemList />
      </BrowserRouter>
    );
    const firstElement = await screen.findByTestId('itemlist-1-card');
    await act(async () => {
      await userEvent.click(firstElement);
    });
    expect(useNavigate()).toHaveBeenCalledWith(`/items/${data.items[0].id}`);
  });
  it('shows an error message when comes an error response', async () => {
    (useGetAllItems as Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'Fetch failed' },
      fetchAllItems: vi.fn(),
      data: data.items
    });
    render(
      <BrowserRouter>
        <ItemList />
      </BrowserRouter>
    );
    const element = await screen.findByTestId('itemlist-error');
    expect(element).toHaveTextContent('Error: Fetch failed');
  });
  it('renders only the selected item', async () => {
    (useParams as Mock).mockReturnValue({id: data.items[0].id});
    renderWithProviders(
      <ItemList />
      , {
        initialRouterEntries: [`/items/${data.items[0].id}`]
      });
    
    const firstElement = await screen.findByTestId('itemlist-selected-card');
    const secondElement = screen.queryByTestId('itemlist-2-card');
    expect(firstElement).toBeInTheDocument();
    expect(secondElement).not.toBeInTheDocument();
  });
});