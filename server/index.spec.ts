import app from './app';

jest.mock('./app', () => {
  return {
    use: jest.fn(),
    get: jest.fn(),
    on: jest.fn(),
    listen: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        use: jest.fn(),
        get: jest.fn(),
      };
    }),
  };
});

async function loadIndex() {
  try {
    const module = await import('./index');
    // Use the imported module
    return module;
  } catch (error) {
    console.error('Error loading the module:', error);
  }
}

describe('Server', () => {
  it('should start', async () => {
    await loadIndex();
    expect(app.listen).toHaveBeenCalledWith(process.env.PORT);
  });
});
