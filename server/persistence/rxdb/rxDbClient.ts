import { RxDatabase } from 'rxdb';
import { DbClient } from '../dbClient';

class RxDbClient implements DbClient {
  protected _dbConnection: RxDatabase;
  constructor(_dbConnection: RxDatabase) {
    this._dbConnection = _dbConnection;
  }

  async create(collection: string, state: object) {
    await this._dbConnection[collection].insert({
      ...state,
      createdAt: new Date().toISOString(),
    });
  }

  async findById(collection: string, id: string): Promise<object> {
    const results = await this._dbConnection[collection]
      .find({
        selector: {
          id: {
            $eq: id,
          },
        },
      })
      .exec();
    return results[0];
  }

  async update(
    collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { id, createdAt, ...rest }: { id: string; createdAt: string }
  ) {
    const document = await this.findById(collection, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (document as any).modify((docData: object) => {
      Object.assign(docData, rest);
      return docData;
    });
  }

  async findAll(collection: string): Promise<object[]> {
    return await this._dbConnection[collection].find({}).exec();
  }
}

export default RxDbClient;
