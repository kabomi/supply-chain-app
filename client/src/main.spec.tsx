import { render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import App from './App';

test('renders App component without crashing', () => {
  const { container } = render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  expect(container).toBeDefined();
});

test('renders a specific element', () => {
  render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  const linkElement = screen.getByRole('link', { name: /Home/i });
  expect(linkElement).toBeInTheDocument();
});