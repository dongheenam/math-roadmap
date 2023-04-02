import { MongoClient } from 'mongodb';

// ref: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts
// ref: https://www.mongodb.com/docs/atlas/manage-connections-aws-lambda/
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClient = client;
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export default client;
