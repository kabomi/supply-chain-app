import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ComponentType, ReactElement } from 'react';

type CustomRenderOptions = {
  initialRouterEntries?: string[];
};

export const renderWithProviders = (
  ui: ReactElement,
  { initialRouterEntries = ['/'], ...renderOptions }: CustomRenderOptions = {}
) => {
  const history = createMemoryHistory({ initialEntries: initialRouterEntries });
  const AllProviders: ComponentType<React.PropsWithChildren> = ({
    children,
  }: React.PropsWithChildren) => <MemoryRouter initialEntries={initialRouterEntries}>{children}</MemoryRouter>;

  return {
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
    history,
  };
};