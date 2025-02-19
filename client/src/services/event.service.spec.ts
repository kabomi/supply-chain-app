import { renderHook, act } from '@testing-library/react';
import { usePostLatestEvent } from './event.service';
import { EventRequest, EventResponse } from '../models';
import { Mock } from 'vitest';

describe('usePostLatestEvent', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set isLoading to true while fetching data', async () => {
    const mockEventResponse: EventResponse = { id: '123', description: 'Test Event', type: 'Test', createdAt: '2021-09-01', location: 'Test Location' };
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => new Promise(resolve => setTimeout(() => resolve(mockEventResponse), 10)),
    });
    const { result } = renderHook(() => usePostLatestEvent());
    const mockEventRequest: EventRequest = { id: '123' };

    await act(async () => {
      result.current.fetchLatestEvent(mockEventRequest);
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('should set data when fetch is successful', async () => {
    const mockEventResponse: EventResponse = { id: '123', description: 'Test Event', type: 'Test', createdAt: '2021-09-01', location: 'Test Location' };
    (global.fetch as Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockEventResponse),
    });

    const { result, rerender } = renderHook(() => usePostLatestEvent());
    const mockEventRequest: EventRequest = { id: '123' };

    await act(async () => {
      result.current.fetchLatestEvent(mockEventRequest);
      rerender();
    });

    expect(result.current.data).toEqual(mockEventResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set error when fetch fails', async () => {
    const mockError = new Error('Fetch failed');
    (global.fetch as Mock).mockRejectedValueOnce(mockError);

    const { result, rerender } = renderHook(() => usePostLatestEvent());
    const mockEventRequest: EventRequest = { id: '123' };

    await act(async () => {
      result.current.fetchLatestEvent(mockEventRequest);
      rerender();
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isLoading).toBe(false);
  });
});