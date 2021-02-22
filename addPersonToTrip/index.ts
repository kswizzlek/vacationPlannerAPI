import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
   
    const tripsCollection = await getCosmosDbConnection("vacation", "trips");
    const peopleCollection = await getCosmosDbConnection("vacation", "people");

    let resBody = {}
    console.log(req)

    if(req.method === "POST"){
        resBody = await addPersonToTrip(req.user.sub, req.body, tripsCollection, peopleCollection);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resBody
    };
    return context.done();

};

const addPersonToTrip = async (auth0UID: string, reqBody: any, tripsCollection: any, peopleCollection: any) => {
    let person = await peopleCollection.findOne({auth0UID: auth0UID});
    let trip = await tripsCollection.findOne({tripUuid: reqBody.tripUuid});

    console.log(person.trips)
    const userAlreadyOnTrip = person.trips.some(t => t.tripUuid === trip.tripUuid);
    console.log(userAlreadyOnTrip)

    if(userAlreadyOnTrip){
        console.log('user has already been added to trip')
        return {
            updatedPerson: person,
            updatedTrip: trip
        }
    }

    person.trips = [
        {
            tripUuid: trip.tripUuid,
            tripName: trip.tripName,
            owner: false
        },
        ...person.trips
    ];
    trip.people = [
        {
            auth0UID: person.auth0UID,
            username: person.username
        },
        ...trip.people
    ];
    Promise.all([
        peopleCollection.update({auth0UID: auth0UID}, person, {upsert: true}),
        tripsCollection.update({tripUuid: trip.tripUuid}, trip, {upsert: true})
    ])
    return {
        updatedPerson: person,
        updatedTrip: trip
    }
}

export default addAuth(httpTrigger);