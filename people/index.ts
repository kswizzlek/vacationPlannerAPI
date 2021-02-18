import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: any): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    console.log("here")

    if(req.method === "GET"){
        console.log(req.user);
    }
    context.res = {
        status: 200, /* Defaults to 200 */
        body: JSON.stringify(["test"])
    }
    return context.done();
};

const searchPeopleByUsername = (username: string) => {

}

const getUsersPerson = (requstUser: any) => {

}

const updateUsersPerson = (updateUsersPerson: any) => {

}

const AUTH0_SIGNING_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJR+xWvKO55Ux3MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1oOWd0OG1qei51cy5hdXRoMC5jb20wHhcNMjAxMDE3MTg1MTQzWhcN
MzQwNjI2MTg1MTQzWjAkMSIwIAYDVQQDExlkZXYtaDlndDhtanoudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2oCkBlka7bpfnRWO
014OoLV08SatRamDCglg6C/9TUON1v6DF7EM10EGHETGIeiu2Ajockx+AH7kqHCJ
EgtTkxjo3AGl21Wx2vwZEu0bn10Z6JzguQKnOgwjiG215S73/xJYcjkVw4JkhqdH
RO3OhIEqK4jjb3qtz5nUcWRKsClj0La/Porzc/ZVnN1oafVezxehutm9u+bDQ0Z4
EIMnraKNrYFE8PQCQf5B/nwwEnSRoB662xFDtuxBbljwrxH1u+uOqxyjWfLNHzLl
Fj/ATPX44Rd5Pp3yXcAcULuBuePn0iJA3uBAzWynP2bYWaMVg7gtzA+9SdN6UWj6
yjrg1wIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQFKvL/snSh
sYQsvhnpZOznIdo/IzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AMtqi4YzlmdVP9tUbck2cKstbpQnXYAZQNU5tg4d/ivK/3N41rSADChTc9fodh5U
uJduVCPwqLkeqwcM8tkfkPoQoh2EY5dMsPh+35zrdkUh6nMExLI00D4/M+3MSlmO
5sx0NO1g33YzSsUD8H6d2ghfls8UtgXWOnkznPZSufbEtlTe5OSlPnQXGom6dqlC
CZPfHVBTguztvQDbtDIS+pEGn/6I4Umuv6Sq+5oDKHHm/6l9KISbcZMxvZcT4dQm
bhfho3ZerObRKvO6YKajbr0BLx05NbJcdEYuos3NOdOHzvkKb8GW6TIDdHKb/bfs
gvvyAU0jr54WVC6xNA0JzGE=
-----END CERTIFICATE-----`

const AUTH0_DOMAIN_URL = 'dev-h9gt8mjz.us.auth0.com';
const AUTH0_API_ID = 'FamilyVacationPlanner.com';

const jwtValidateDecorator = require('azure-functions-auth0')({
    clientId: AUTH0_API_ID,
    clientSecret: AUTH0_SIGNING_CERTIFICATE,
    algorithms: ['RS256'],
    domain: `${AUTH0_DOMAIN_URL}`
  })

export default jwtValidateDecorator(httpTrigger);