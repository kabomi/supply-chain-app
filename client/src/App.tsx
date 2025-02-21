import './App.css'
import {
  Routes,
  Route,
  Link
} from "react-router-dom";
import { About } from './components/About';
import { ItemList } from './components/ItemList';
import { Home } from './components/Home';

function App() {

  return (
      <div>
        <nav>
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/items">Items</Link>
            </li>
          </ul>
        </nav>
    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/items" element={<ItemList />}>
            <Route path=":id" element={<ItemList  />} />
          </Route>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
  )
}

export default App
