import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import {
  getRxStorageMemory,
  RxStorageMemory,
} from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { itemSchema } from '../schemas';
import RxDbClient from './rxdb/rxDbClient';
import { subtle } from 'crypto';

const dbName = 'supply-chain';
const isProduction = process.env.ENV === 'production';
let _dbConnection: RxDatabase | null = null; // Reuse existing connection
export async function initialize(): Promise<RxDbClient> {
  if (!_dbConnection) {
    if (!isProduction) {
      addRxPlugin(RxDBDevModePlugin);
    }
    _dbConnection = await createDb(dbName);
    addCollections(_dbConnection);
  }

  return new RxDbClient(_dbConnection);
}

async function createDb(dbName: string) {
  let storage: RxStorageMemory;
  if (!isProduction) {
    storage = {
      ...wrappedValidateAjvStorage({
        storage: getRxStorageMemory(),
      }),
      collectionStates: new Map(),
    };
  } else {
    storage = getRxStorageMemory();
  }
  return await createRxDatabase({
    name: dbName,
    hashFunction: nativeSha256,
    storage,
  });
}

async function addCollections(_dbConnection: RxDatabase) {
  await _dbConnection.addCollections({
    inventory: {
      schema: itemSchema,
    },
  });
}

export function get(): RxDbClient {
  if (!_dbConnection) {
    throw new Error('Database connection is not initialized');
  }
  return new RxDbClient(_dbConnection);
}

export async function nativeSha256(input: string) {
  // Not sure why crypto is undefined on rxDb module
  // function copied from ./node_modules/rxdb/src/plugins/utils/utils-hash.ts
  const data = new TextEncoder().encode(input);
  /**
   * If your JavaScript runtime does not support crypto.subtle.digest,
   * provide your own hash function when calling createRxDatabase().
   */

  const hashBuffer = await subtle.digest('SHA-256', data);
  /**
   * @link https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/
   */
  const hash = Array.prototype.map
    .call(new Uint8Array(hashBuffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
  return hash;
}

export default {
  initialize,
  get,
};
