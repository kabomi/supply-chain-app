import { EventResponse } from '../models';

export function ItemEvent({ event }: {event: EventResponse }) {
  return (
    <li>
      <div className="overflow-ellipsis overflow-hidden">Type: {event.type}</div>
      <div style={{ 'overflowWrap': 'break-word' }}>{event.description}</div>
      <div>Date: {event.createdAt}</div>
      <div>Location: {event.location}</div>
    </li>
  );
}
