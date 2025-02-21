import { ItemResponse } from '../models';

export function Item({
  name,
  description,
  color,
  price,
  events,
  dataTestId,
  showEvents,
  onClick,
}: ItemResponse & {
  dataTestId: string;
  showEvents?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      data-testid={dataTestId}
      onClick={onClick}
      className="flex justify-center items-center m-4 flex-wrap"
    >
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-sm w-full sm:max-w-md sm:w-5/4">
        <h2 className="text-xl font-bold overflow-ellipsis overflow-hidden">
          {name}
        </h2>
        <p className="text-gray-500" style={{ 'overflowWrap': 'break-word' }}>
          {description}
        </p>
        <p className="text-gray-500">Color: {color}</p>
        <p className="text-gray-500">Price: ${price}</p>
        {showEvents && (
          <div
            data-testid="item-component-events"
            className="bg-amber-100 rounded-lg p-4 max-w-sm w-full mt-8"
          >
            <h2 className="text-xl font-bold overflow-ellipsis overflow-hidden">Events</h2>
            <ul>
              {events
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .map((event, index) => (
                  <li key={index}>
                    <p className="overflow-ellipsis overflow-hidden">Type: {event.type}</p>
                    <p style={{ 'overflowWrap': 'break-word' }}>{event.description}</p>
                    <p>Date: {event.createdAt}</p>
                    <p>Location: {event.location}</p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
