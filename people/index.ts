import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import addAuth from '../auth0/auth0Decorator';
import getCosmosDbConnection from '../cosmosdb/getComsosDbConnection';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest | any): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    console.log("beginning of people request")

    const peopleCollection = await getCosmosDbConnection("vacation", "people");

    let resBody: any = {}

    console.log("in the people api")

    if(req.method === "GET"){
        resBody = await getUsersPerson(req.user.sub, peopleCollection)
    }else if(req.method == "POST"){
        resBody = await updateUsersPerson(req.user.sub, req.body, peopleCollection)
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: JSON.stringify(resBody)
    }
    return context.done();
};

const searchPeopleByUsername = (username: string, collection: any) => {

}

const getUsersPerson = async (auth0UID: string, collection: any) => {
    return await collection.find({auth0UID: auth0UID}).toArray();
}

const updateUsersPerson = async (auth0UID: string, reqBody: any, collection: any) => {
    console.log("in post function")
    const userNameAlreadyExist: boolean = await collection.findOne({username: reqBody, auth0UID: {$ne: auth0UID}})
    if(userNameAlreadyExist){
        return {
            error: "User already exist"
        }
    }

    const personToInsert = {
        auth0UID: auth0UID,
        username: reqBody.username,
        trips: []
    }
    console.log("before update")
    await collection.update({auth0UID: auth0UID}, personToInsert, {upsert: true});
    console.log("after update")
    return personToInsert;
}

export default addAuth(httpTrigger);