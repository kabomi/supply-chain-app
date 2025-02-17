import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import RxDbClient from './rxdb/rxDbClient';
import { itemSchema } from '../schemas';
import dbConnection from './dbConnection';

jest.mock('rxdb', () => {
  return {
    createRxDatabase: jest.fn().mockResolvedValue({
      addCollections: jest.fn(),
    }),
    addRxPlugin: jest.fn(),
  };
});
describe('dbConnection', () => {
  it('should initialize returning a db client', async () => {
    const dbClient = await dbConnection.initialize();

    expect(dbClient).toBeInstanceOf(RxDbClient);
  });
  it('should add an inventory collection', async () => {
    await dbConnection.initialize();

    expect(
      (
        await createRxDatabase({
          name: 'testdb',
          storage: getRxStorageMemory(),
        })
      ).addCollections
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        inventory: { schema: itemSchema },
      })
    );
  });
});
