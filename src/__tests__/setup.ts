// src/tests/setup.ts

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose connection is not open');
  }

  // Using type assertion to ensure TypeScript knows `db` is available
  const db = mongoose.connection.db!;
  const collections = await db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});
