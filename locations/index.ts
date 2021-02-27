import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';
import { Location, Locations } from "../shared/vacationPlannerShared/models/locations";
import { v4 as uuid } from 'uuid';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    const locationsCollection = await getCosmosDbConnection("vacation", "locations");
    const operation = context.bindingData.operation;
    let resBody = {};

    if(req.method === "GET"){
        console.log("geting trip locations----------------")
        resBody = await getTripLocations(req.query.tripUuid, locationsCollection);
    }else if(req.method === "POST" && operation === "vote"){
        resBody = await voteOnLocation(req.body, locationsCollection)
    }else if(req.method === "POST"){
        resBody = await upsertLocationToTrip(req.body, locationsCollection);
    }else if(req.method === "DELETE"){
        await deleteLocation(req.body, locationsCollection);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resBody
    };
    context.done();
};

const getTripLocations = async (tripUuid: string, locationsCollection: any) => {
    let locations = {};
    await locationsCollection.findOne({tripUuid: tripUuid}).then(res => {
        locations = res;
    }).catch(e => console.log(e)); 
    return locations !== null ? locations : {};
}

const upsertLocationToTrip = async (reqBody: any, locationsCollection: any) => {
    reqBody.locationToAdd.locationUuid = reqBody.locationToAdd.locationUuid || uuid();
    let tripLocations: Locations = await locationsCollection.findOne({tripUuid: reqBody.tripUuid});
    if(!tripLocations){
        tripLocations = {
            tripUuid: reqBody.tripUuid,
            locations: []
        }
    }
    tripLocations.locations = [reqBody.locationToAdd, ...tripLocations.locations];
    await locationsCollection.update({tripUuid: reqBody.tripUuid}, tripLocations, {upsert: true})
    return tripLocations;
}

const voteOnLocation = async (reqBody: any, locationsCollection: any) => {
    const tripLocations: Locations = await locationsCollection.findOne({tripUuid: reqBody.tripUuid});
    tripLocations.locations.map(l => {
        if(l.locationUuid === reqBody.locationUuid){
            const userVote = l.locationVotes.find(lv => lv.person.username === reqBody.person.username);
            if(userVote){
                userVote.like = reqBody.like;
            }else{
                l.locationVotes.push({
                    person: reqBody.person,
                    like: reqBody.like
                })
            }
        }
    })
    await locationsCollection.update({tripUuid: reqBody.tripUuid}, tripLocations, {upsert: true})
    return tripLocations;
}

const deleteLocation = async (reqBody: any, locationsCollection: any) => {
    const tripLocations: Locations = await locationsCollection.findOne({tripUuid: reqBody.tripUuid});
    tripLocations.locations = tripLocations.locations.filter(l => l.locationUuid !== reqBody.locationUuid);
    await locationsCollection.update({tripUuid: reqBody.tripUuid}, tripLocations, {upsert: true})
    return tripLocations;
}

export default addAuth(httpTrigger);