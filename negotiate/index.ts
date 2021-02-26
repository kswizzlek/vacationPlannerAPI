import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, connectionInfo: any): Promise<void> {
    console.log('connection info-----------------')
    console.log(connectionInfo);
    context.res.body = connectionInfo;
};

export default httpTrigger;