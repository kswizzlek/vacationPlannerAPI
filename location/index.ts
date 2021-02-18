import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { MongoClient } from 'mongodb';
import { v4 as uuid } from 'uuid';
import * as Auth0 from 'azure-functions-auth0';

// DATABASE CONNECTION - TODO: move to database folder
const cosmosMongoDbConnString = "mongodb://gregballsack:YsM7Ntyo8yfYDFwllyzG8HEGGtTjGMomZWSngYpwPIv0vA8VPovpanWQfBQDs8rdFBLJeDripDaDWwEoAplMoA%3D%3D@gregballsack.mongo.cosmos.azure.com:10255/?ssl=true&appName=@gregballsack@";
const mongoClient = new MongoClient(cosmosMongoDbConnString);

//HTTP TRIGGER
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('vacation http trigger started');
    
    await mongoClient.connect();
    const database = mongoClient.db("vacation");
    const collection = database.collection("locations");

    let resBody: any = {};

    switch(req.method){
        case "GET":
            resBody = await getLocations(collection);
            break;
        case "POST":
            await addLocation(mapLocation(req.body, {}), collection);
            break;
    }
    console.log("response--------------")
    console.log(resBody)

    context.res = {
        status: 200,
        body: JSON.stringify(resBody)
    };

};

//REQUEST HANDLERS
const getLocations = async (collection: any): Promise<any> => {
    const locations = await collection.find().toArray();
    console.log(locations)
    return locations;
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

const validateLocation = (requestBody: any): string[] => {
    if(!requestBody) return ['You must include a location in the request body to create a location'];
    const validationErrors: string[] = [];
    if(!requestBody.name) validationErrors.push('You must include a name to create a location');
    if(!requestBody.description) validationErrors.push('You must include a description to create a location');
    if(typeof requestBody.name != 'string') validationErrors.push('name must be a string');
    if(typeof requestBody.description !== 'string') validationErrors.push('description must be a string');
    return validationErrors;
}

//MAPPERS

const mapLocation = (requestBody: any, userObj: any): Location => {
    console.log("requestBody")
    console.log(requestBody)
    return {
        uuid: uuid(),
        name: requestBody.name,
        description: requestBody.description
    }
}

//TODO: move into models
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

//TODO: move out to auth folder
const auth0 = Auth0({
    clientId: 'zV5q9ZYrZXB7JrFT45TN1TwJgeolTCYY',
    clientSecret: '0_e3Axl-p5IUlJwjWFkGfGxhsGWc1crVCy6_tYZEpnZaPQhKEo_WLXRN7T2JDd8a',
    domain: 'dev-h9gt8mjz.us.auth0.com'
});

export default auth0(httpTrigger);