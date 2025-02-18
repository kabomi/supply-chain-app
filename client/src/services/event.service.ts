import { useState } from "react";
import { EventRequest, EventResponse } from "../models";

export const usePostLatestEvent =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object>();
  const [data, setData] = useState<EventResponse>();

  async function fetchLatestEvent(body: EventRequest) {
    try {
      setIsLoading(true);
      const response = await fetch('/api/supply-chain/last-trail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: body.id })
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setError(error as object);
    } finally {
      setIsLoading(false);
    }
  }
  
  return { fetchLatestEvent, isLoading, error, data };
};
