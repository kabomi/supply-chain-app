import { useCallback, useState } from "react";
import { usePostLatestEvent } from "../services/event.service";
import { ItemEvent } from "./ItemEvent";

export function Home() {
  const [searchValue, setSearchValue] = useState('');
  const { isLoading, error, fetchLatestEvent, data } = usePostLatestEvent();

  const handleClick = useCallback(async () => {
    fetchLatestEvent({ id: searchValue });
  }, [fetchLatestEvent, searchValue]);

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
          { error && <div data-testid="home-search-error" className="text-red-400 m-0.5">An error occurred</div> }
          { data && 
          <div data-testid="home-search-response" className="bg-amber-100 rounded-lg p-4 max-w-sm w-full mt-8 inline-block">
            <h2 className="text-xl font-bold overflow-ellipsis overflow-hidden">Latest Event</h2>
            <ul><ItemEvent event={data} /></ul>
          </div> }
        </article>
      </main>
    </div>
  )
}