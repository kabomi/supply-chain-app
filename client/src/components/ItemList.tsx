import { useEffect, useState } from 'react';
import { useGetAllItems } from '../services/inventory.service';
import { ItemResponse } from '../models';
import { Item } from './Item';
import { useNavigate, useParams } from 'react-router-dom';

export function ItemList() {
  const {id: selectedItemId} = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ItemResponse>();
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
      const item = data.find(item => item.id === selectedItemId);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [data]);

  function onNavigate(id: string) {
    console.log('Navigating to item detail:', id);
    navigate(`/items/${id}`);
  }

  function onEditItem() {
    console.log('Editing item:', selectedItem);
    //navigate(`/items/${selectedItem?.id}/edit`);
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p data-testid="itemlist-error">Error: {error.message}</p> : null}
      {!selectedItem && itemList && itemList.length > 0 ? (
        itemList.map((item, index) => 
        <Item key={item.id} dataTestId={`itemlist-${index + 1}-card`} {...item} onClick={() => onNavigate(item.id)}/>)
      ) : 
        (selectedItem ? 
          <Item dataTestId={`itemlist-selected-card`} {...selectedItem} onClick={() => onEditItem()} />
          : <p className="text-2xl">No items to show</p>
        )}
    </div>
  );
}
