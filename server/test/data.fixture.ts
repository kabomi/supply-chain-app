import { v7 } from 'uuid';

export type Item = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
};

class Factory {
  static createNewItem({
    name,
    price,
    description,
    color,
  }: Partial<Item>): Item {
    return {
      id: v7(),
      name: name ?? 'Item',
      price: price ?? 100,
      description: description ?? 'This is an item',
      color: color ?? 'red',
    };
  }
}

const data = {
  items: [
    Factory.createNewItem({ name: 'Item 1', price: 200 }),
    Factory.createNewItem({ name: 'Item 2', price: 300, color: 'blue' }),
  ],
};

export default data;
