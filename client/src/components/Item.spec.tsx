import { render, screen } from '@testing-library/react';
import { Item } from './Item';
import data from '../../test/data.fixture';
import userEvent from '@testing-library/user-event';

describe('Item Component', () => {
  const mockOnClick = vi.fn();
  const item = data.items[0];
  const itemProps = {
    ...item,
    dataTestId: 'item-component',
    onClick: mockOnClick,
  };

  it('renders Item component with correct props', () => {
    render(<Item {...itemProps} />);

    expect(screen.getByTestId('item-component')).toBeInTheDocument();
    expect(screen.getByText(item.name)).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.getByText(`Color: ${item.color}`)).toBeInTheDocument();
    expect(screen.getByText(`Price: $${item.price}`)).toBeInTheDocument();
  });

  it('renders event data when showEvents is set', async () => {
    render(<Item {...itemProps} showEvents={true} />);

    expect(screen.getByTestId('item-component-events')).toBeInTheDocument();
  });

  it('calls onClick when the item is clicked', async () => {
    render(<Item {...itemProps} />);

    await userEvent.click(screen.getByTestId('item-component'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});