import { v7 } from 'uuid';

export type ItemEvent = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  location: string;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  events: ItemEvent[];
};

export class Factory {
  static createNewItem({
    name,
    price,
    description,
    color,
    events,
  }: Partial<Item>): Item {
    return {
      id: v7(),
      name: name ?? 'Item',
      price: price ?? 100,
      description: description ?? 'This is an item',
      color: color ?? 'red',
      events: events ?? [
        {
          id: v7(),
          type: 'created',
          description: 'Item created',
          createdAt: new Date().toISOString(),
          location: 'USA',
        },
      ],
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
