import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    const locationsCollection = await getCosmosDbConnection("vacation", "locations");

    if(req.method === "GET"){
        console.log("");
    }else if(req.method === "POST"){
        console.log("");
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
    };

};

const getTripLocations = async (tripUuid: string, locationsCollection) => {

}

const addLocationToTrip = async (reqBody: any, locationsCollection) => {

}

export default addAuth(httpTrigger);