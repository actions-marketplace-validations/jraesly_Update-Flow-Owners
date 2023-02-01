const axios = require('axios');
const args = require('yargs').argv;

const clientId = args.clientId;
const clientSecret = args.clientSecret;
const tenantId = args.tenantId;


const getAccessToken = async () => {
    const response = await axios({
        method: 'post',
        url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        data: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=https%3A%2F%2Fmanagement.core.windows.net%2F.default`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
};

const updateFlow = async (accessToken, flowId) => {
    await axios({
        method: 'patch',
        url: `https://management.azure.com/providers/Microsoft.PowerAutomate/flows/${flowId}?api-version=2020-06-01`,
        data: {
            'properties': {
                'owner': clientId
            }
        },
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
};

const main = async () => {
    const accessToken = await getAccessToken();
    const flowsResponse = await axios({
        method: 'get',
        url: `https://management.azure.com/providers/Microsoft.PowerAutomate/flows?api-version=2020-06-01`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const flows = flowsResponse.data.value;
    for (const flow of flows) {
        await updateFlow(accessToken, flow.id);
        console.log(`Updated flow: ${flow.id}`);
    }

    console.log('All flows updated');
};

main().catch(error => {
    console.error(error);
});
