import { renderHook, act } from '@testing-library/react';
import { useGetAllItems } from './inventory.service';
import { ItemResponse } from '../models';
import data from '../../test/data.fixture';
import { Mock } from 'vitest';


describe('useGetAllItems', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set isLoading to true while fetching data', async () => {
    const mockItemListResponse: ItemResponse[] = data.items;
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => new Promise(resolve => setTimeout(() => resolve(mockItemListResponse), 10)),
    });
    const { result } = renderHook(() => useGetAllItems());

    await act(async () => {
      result.current.fetchAllItems();
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('should set data when fetch is successful', async () => {
    const mockItemListResponse: ItemResponse[] = data.items;
    (global.fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockItemListResponse),
    });

    const { result, rerender } = renderHook(() => useGetAllItems());

    await act(async () => {
      result.current.fetchAllItems();
      rerender();
    });

    expect(result.current.data).toEqual(mockItemListResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set error when fetch fails', async () => {
    const mockError = new Error('Fetch failed');
    (global.fetch as Mock).mockRejectedValueOnce(mockError);

    const { result, rerender } = renderHook(() => useGetAllItems());

    await act(async () => {
      result.current.fetchAllItems();
      rerender();
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isLoading).toBe(false);
  });
});