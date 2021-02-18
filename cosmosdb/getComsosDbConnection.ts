import { MongoClient } from 'mongodb';

export default async (databaseName: string, collectionName: string) => {
    const cosmosMongoDbConnString = "mongodb://gregballsack:YsM7Ntyo8yfYDFwllyzG8HEGGtTjGMomZWSngYpwPIv0vA8VPovpanWQfBQDs8rdFBLJeDripDaDWwEoAplMoA%3D%3D@gregballsack.mongo.cosmos.azure.com:10255/?ssl=true&appName=@gregballsack@";
    const mongoClient = new MongoClient(cosmosMongoDbConnString);
    await mongoClient.connect();
    const database = mongoClient.db(databaseName);
    return database.collection(collectionName);
}