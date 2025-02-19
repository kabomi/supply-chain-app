import { ItemResponse } from "../models";

export function Item({ name, description, color, price, dataTestId, onClick} : ItemResponse & { dataTestId: string, onClick: () => void }) {
  return (
    <div data-testid={dataTestId} onClick={onClick} className="flex justify-center items-center h-screen">
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-sm w-full">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-500">{description}</p>
        <p className="text-gray-500">Color: {color}</p>
        <p className="text-gray-500">Price: {price}</p>
      </div>
    </div>
  )
}