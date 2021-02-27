import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    console.log("subscribing to dates")
    console.log(req.body)
    context.bindings.signalRGroupActions = [{
        userId: req.body.userId,
        groupName: req.body.tripUuid,
        action: req.body.action
    }];
    context.done();
};

export default httpTrigger;