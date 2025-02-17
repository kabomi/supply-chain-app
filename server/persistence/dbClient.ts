/* eslint-disable @typescript-eslint/no-unused-vars */
/** Abstract DbClient */

export interface Collection {
  insert: (doc: object) => Promise<void>;
  find: (query: object) => { exec: () => Promise<object[]> };
  // Add other methods as needed
}

export interface DbConnection {
  [collectionName: string]: Collection;
}
export interface DbClient {
  create(collection: string, state: object): Promise<object>;
  findById(collection: string, id: string): Promise<object | null>;
  findAll(collection: string): Promise<object[]>;
  update(collection: string, state: object): Promise<void>;
}
