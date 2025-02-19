import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ItemList } from './ItemList';
import { useGetAllItems } from '../services/inventory.service';
import data from '../../test/data.fixture';
import { act } from 'react';

vi.mock('../services/inventory.service', () => ({
  useGetAllItems: vi.fn()
}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock(import("react-router-dom"), async (importOriginal: any) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // your mocked methods
    useNavigate: vi.fn().mockReturnValue(vi.fn())
  }
})



beforeEach(() => {
  // vi.resetAllMocks();
  (useGetAllItems as Mock).mockReturnValue({
    isLoading: false,
    error: null,
    fetchAllItems: vi.fn(),
    data: data.items
  });
});

test('renders ItemList component without crashing', async () => {
  const { container } = render(
  <BrowserRouter>
    <ItemList />
  </BrowserRouter>
  );
  expect(container).toBeDefined();
});

test('renders a list of items', async () => {
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
  test('navigates to item detail on click', async () => {
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
    expect(useNavigate()).toHaveBeenCalledWith(`/item/${data.items[0].id}`);
  });
  test('shows an error message when comes an error response', async () => {
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
});