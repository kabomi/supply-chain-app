export type EventRequest = {
  id: string;
}
export type EventResponse = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  location: string;
}

export type ItemResponse = {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  events: EventResponse[];
}