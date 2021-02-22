import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';
import { v4 as uuid } from 'uuid';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const tripsCollection = await getCosmosDbConnection("vacation", "trips");
    const peopleCollection = await getCosmosDbConnection("vacation", "people");

    console.log("inside the trips endpoint")
    console.log(req)

    let resBody: any = {};
    if(req.method == "GET"){
        resBody = await getTripByTripUuid(req.query.tripUuid, tripsCollection);
    }else if(req.method == "POST"){
        resBody = await upsertNewTrip(req.user.sub, req.body, tripsCollection, peopleCollection);
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: JSON.stringify(resBody)
    }
    return context.done();
};


const getTripByTripUuid = async (tripUuid: string, tripsCollection: any) => {
    return await tripsCollection.findOne({tripUuid: tripUuid});
}
const upsertNewTrip = async (auth0UID: string, reqBody: any, tripsCollection: any, peopleCollection: any) => {
    const newTrip = {
        tripUuid: reqBody.tripUuid ? reqBody.tripUuid : uuid(),
        owner: auth0UID,
        tripName: reqBody.tripName,
        people: reqBody.people
    };
    await tripsCollection.update({tripUuid: newTrip.tripUuid}, newTrip, {upsert: true});

    Promise.all(reqBody.people.forEach(async (person) => {
        let personOnTrip = await peopleCollection.findOne({username: person.username});
        const tripToAddToPerson = {
            tripUuid: newTrip.tripUuid,
            tripName: newTrip.tripName,
            owner: personOnTrip.auth0UID === auth0UID ? true : false,
        }
        personOnTrip.trips = [tripToAddToPerson, ...personOnTrip.trips];
        await peopleCollection.update({username: person.username}, personOnTrip, {upsert: true});
    }));
    return newTrip;
}

export default addAuth(httpTrigger);