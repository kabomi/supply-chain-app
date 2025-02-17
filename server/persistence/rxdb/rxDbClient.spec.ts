import RxDbClient from './rxDbClient';
// import dbConnection from '../dbConnection';

jest.mock('../dbConnection', () => {
  return {
    game: {
      insert: jest.fn(),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ modify: jest.fn() }]),
      }),
    },
  };
});
describe('RxDbClient', () => {
  it('should create a document', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbConnection = (await import('../dbConnection')) as any;

    const client = new RxDbClient(dbConnection);
    const state = {
      id: expect.any(String),
      createdAt: expect.any(String),
    };

    client.create('game', state);

    expect(dbConnection.game.insert).toHaveBeenCalledWith(state);
  });
  it('should find a document', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbConnection = (await import('../dbConnection')) as any;

    const client = new RxDbClient(dbConnection);
    const state = {
      id: 'anyTestId',
    };

    const document = await client.findById('game', state.id);

    expect(dbConnection.game.find).toHaveBeenCalledWith(
      expect.objectContaining({
        selector: { id: { $eq: state.id } },
      })
    );
    expect(document).toBeDefined();
  });
  it('should update a document', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbConnection = (await import('../dbConnection')) as any;
    const client = new RxDbClient(dbConnection);
    const state = {
      id: 'anyTestId',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    await client.update('game', state);

    expect(dbConnection.game.find).toHaveBeenCalledWith(
      expect.objectContaining({
        selector: { id: { $eq: state.id } },
      })
    );
    const documents = await dbConnection.game.find().exec();
    expect(documents[0].modify).toHaveBeenCalled();
  });
});
