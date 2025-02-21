import { useState } from "react";
import { EventRequest, EventResponse } from "../models";
import { apiUrl, commonHeaders } from "./config";

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
        headers: commonHeaders,
        body: JSON.stringify({ id: body.id })
      });
      // const startTime = new Date().getMilliseconds();
      const data = await response.json();
      // const endTime = new Date().getMilliseconds();
      // console.log('time taken:', endTime - startTime);
      if (response.status !== 200) {
        throw new Error('Item not found');
      }
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
