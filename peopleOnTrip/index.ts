import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const resBody = {}
    
    const peopleOnTripCollection = await getCosmosDbConnection("vacation", "peopleOnTrip");

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resBody
    };

};

const findPeopleOnTrip = (tripUuid: string, collection: any) => {

}

const findTripsPersonIsOn = (personUuid: string, collection: any) => {

}

const addPersonToTrip = (personUuid: string, tripUuid: string) => {

}

export default httpTrigger;