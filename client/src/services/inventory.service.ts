import { useState } from "react";
import { ItemResponse } from "../models";
import { apiUrl, commonHeaders } from "./config";

export const useGetAllItems =  () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<ItemResponse[]>();

  async function fetchAllItems() {
    try {
      setError(undefined);
      setIsLoading(true);
      const response = await fetch(apiUrl + '/supply-chain/inventory', {
        method: 'GET',
        headers: commonHeaders
      });
      // const startTime = new Date().getMilliseconds();
      const data = await response.json();
      // const endTime = new Date().getMilliseconds();
      // console.log('time taken:', endTime - startTime);
      setData(data);
    } catch (error) {
      console.error(error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return { fetchAllItems, isLoading, error, data };
};
