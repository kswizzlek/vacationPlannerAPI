import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    let resBody = {};

    const datesCollection = await getCosmosDbConnection("vacation", "dates");

    if(req.method === "GET"){
        resBody = await getTripDates(req.query.tripUuid, datesCollection);
    }else if(req.method === "POST"){
        resBody = await addDateToTrip(req.body, datesCollection);
        console.log(req.body.tripUuid)
        const updates = [{
            target: 'dates',
            groupName: req.body.tripUuid,
            arguments: [resBody]
        }];
        context.bindings.signalRMessages = updates;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resBody
    };

    context.done();
};

const getTripDates = async (tripUuid: string, datesCollection: any) => {
    return await datesCollection.findOne({tripUuid: tripUuid});
}

const addDateToTrip = async (reqBody: any, datesCollection: any) => {
    const tripDates = {
        tripUuid: reqBody.tripUuid,
        dates: reqBody.tripDates

    }

    await datesCollection.update({tripUuid: reqBody.tripUuid}, tripDates, {upsert: true});

    return tripDates;
}

export default addAuth(httpTrigger);