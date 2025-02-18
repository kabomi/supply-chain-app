import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { About } from './components/About';
import { ItemList } from './components/ItemList';
import { Home } from './components/Home';

function App() {

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
          <Route path="/items" element={<ItemList />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
