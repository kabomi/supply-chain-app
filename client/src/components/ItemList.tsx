import { useEffect, useState } from 'react';
import { useGetAllItems } from '../services/inventory.service';
import { ItemResponse } from '../models';
import { Item } from './Item';
import { useNavigate } from 'react-router-dom';

export function ItemList() {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState<ItemResponse[]>();
  const { isLoading, error, fetchAllItems, data } = useGetAllItems();

  useEffect(() => {
    async function fetchData() {
      await fetchAllItems();
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setItemList(data);
    }
  }, [data]);

  function onNavigate(id: string) {
    console.log('Navigating to item detail:', id);
    navigate(`/item/${id}`);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p data-testid="itemlist-error">Error: {error.message}</p> : null}
      {itemList ? (
        itemList.map((item, index) => 
        <Item key={item.id} dataTestId={`itemlist-${index + 1}-card`} {...item} onClick={() => onNavigate(item.id)}/>)
      ) : (
        <p className="text-2xl">No items to show</p>
      )}
    </div>
  );
}
