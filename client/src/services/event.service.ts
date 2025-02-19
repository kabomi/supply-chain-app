import { useState } from "react";
import { EventRequest, EventResponse } from "../models";

const apiUrl = import.meta.env.VITE_API_URL as string;

export const usePostLatestEvent =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object>();
  const [data, setData] = useState<EventResponse>();

  async function fetchLatestEvent(body: EventRequest) {
    try {
      setError(undefined);
      setIsLoading(true);
      const response = await fetch(apiUrl + '/supply-chain/latest-trail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: body.id })
      });
      // const startTime = new Date().getMilliseconds();
      const data = await response.json();
      // const endTime = new Date().getMilliseconds();
      // console.log('time taken:', endTime - startTime);
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
