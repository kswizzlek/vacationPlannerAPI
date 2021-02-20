import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';
import { v4 as uuid } from 'uuid';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    console.log('in trips ')
    const tripsCollection = await getCosmosDbConnection("vacation", "trips");

    let resBody: any = {};

    if(req.method === "GET"){
        resBody = await findTripsForPerson(req.user.sub, tripsCollection)
    }else if(req.method == "POST"){
        resBody = await createNewTrip(req.user.sub, req.body, tripsCollection)
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: JSON.stringify(resBody)
    }
    return context.done();
};


const findTripsForPerson = async (auth0UID: string, collection: any) => {
    return await collection.find({auth0UID: auth0UID}).toArray();
}

const createNewTrip = async (auth0UID: string, reqBody: any, collection: any) => {
    console.log('create new trip')
    const newTrip = {
        tripUuid: reqBody.tripUuid ? reqBody.tripUuid : uuid(),
        auth0UID: auth0UID,
        tripName: reqBody.tripName
    }
    console.log('before upsert ')
    await collection.update({tripUuid: newTrip.tripUuid}, newTrip, {upsert: true})
    console.log('after upsert')

    return newTrip;
}

export default addAuth(httpTrigger);