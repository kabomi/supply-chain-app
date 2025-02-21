import { useCallback, useState } from "react";
import { usePostLatestEvent } from "../services/event.service";

export function Home() {
  const [searchValue, setSearchValue] = useState('');
  const { isLoading, error, fetchLatestEvent, data } = usePostLatestEvent();

  const handleClick = useCallback(async () => {
    fetchLatestEvent({ id: searchValue });
  }, [searchValue]);

  return (
    <div data-testid="home-page" className="flex justify-center h-screen mt-40">
      <main>
        <input
          data-testid="home-search-input"
          className="border border-gray-300 rounded-lg p-2 sm:w-64 md:w-128 w-48"
          placeholder="Enter Item id..."
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          data-testid="home-search-action"
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ml-2 cursor-pointer mt-2.5">
            { isLoading ? 'loading ...' : 'Last Trail' }
        </button>
        <article className="text-center">
          { error && <p data-testid="home-search-error" className="text-red-500">An error occurred</p> }
          { data && <p data-testid="home-search-response">{data.description}</p> }
        </article>
      </main>
    </div>
  )
}