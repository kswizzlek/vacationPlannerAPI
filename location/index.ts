import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';

// DATABASE CONNECTION
const cosmosMongoDbConnString = "mongodb://gregballsack:YsM7Ntyo8yfYDFwllyzG8HEGGtTjGMomZWSngYpwPIv0vA8VPovpanWQfBQDs8rdFBLJeDripDaDWwEoAplMoA%3D%3D@gregballsack.mongo.cosmos.azure.com:10255/?ssl=true&appName=@gregballsack@";
const mongoClient = new MongoClient(cosmosMongoDbConnString);

//HTTP TRIGGER
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('vacation http trigger started');
    
    await mongoClient.connect();
    const database = mongoClient.db("vacation");
    const collection = database.collection("locations");

    switch(req.method){
        case "GET":
            await getLocations(collection);
        case "POST":
            await validateLocation(req.body);
            await addLocation(mapLocation(req.body, {}), collection);
    }

    context.res = {
        status: 200,
    };

};

//REQUEST HANDLERS
const getLocations = async (collection: any): Promise<Location[]> => {
    return await collection.find().toArray();
}

const addLocation = async (location: Location, collection: any) => {
    await collection.insertOne(location);
}

const updateLocation = (location: Location) => {

}

const removeLocation = (locationId: number) => {

}

const voteOnLocation = (locationId: number, likedTheLocation: boolean) => {

}

//VALITATORS

const validateLocation = async (requestBody: any) => {

}

//MAPPERS

const mapLocation = (requestBody: any, userObj: any): Location => {
    return {
        uuid: uuid(),
        name: requestBody.name,
        description: requestBody.description
    }
}

interface Location {
    uuid: string
    name: string
    description: string
    votes?: Votes[]
    comments?: Comment[]
}

interface Votes {
    userId: string
    like: boolean
}

interface Comment {
    userId: string
    userName: string
    comment: string
}

export default httpTrigger;