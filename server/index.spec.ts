import app from './app';

jest.mock('./persistence/dbConnection', () => {
  const dbClient = { create: jest.fn() };
  return {
    initialize: jest.fn().mockResolvedValue(dbClient),
    get: () => dbClient,
  };
});
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

  it('should initialize Db/DbConnection', async () => {
    const dbConnection = await import('./persistence/dbConnection');

    await loadIndex().then(() => {
      expect(dbConnection.initialize).toHaveBeenCalled();
    });
  });
});
