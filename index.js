const axios = require("axios");
const core = require('@actions/core');


try {

    console.log(`Test`);
    const time = (new Date()).toTimeString();
    console.log(time);

} catch (error) {
    core.setFailed(error.message);
}
/*
program
    .option("--environmentId <environmentId>")
    .option("--tenant_id <tenant_id>")
    .option("--client_id <client_id>")
    .option("--client_secret <client_secret>")
    .parse(process.argv);
*/
/*
async function generateBearerToken(clientId, clientSecret, tenantId, environmentId) {
    const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=https://api.crm.dynamics.com/${environmentId}`);
    console.log("Bearer token Acquired");
    return response.data.access_token;
}

async function updateFlowOwners(bearerToken, orgUrl, ownerId) {
    const flows = await axios.get(`${orgUrl}/api/data/v9.1/workflows`, {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    });
    console.log(`Flows Retrieved. Count: ${flows.Count}`);
    flows.data.forEach(async flow => {
        const ownerId = `systemusers(${ownerId})`;

        await axios.patch(`${orgUrl}/api/data/v9.1/workflows(${flow.workflowid})`, {
            ownerid: ownerId,
        }, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                'OData-MaxVersion': '4.0',
                'OData-EntityId': `workflows(${flow.workflowid})`,
            },
        });
    });
}

function main(clientId, clientSecret, tenantId, orgUrl, environmentId) {
    console.log("Entering main...")
    const clientId = core.getInput('clientId', { required: true });
    const clientSecret = core.getInput('clientSecret', { required: true });
    const tenantId = core.getInput('tenantId', { required: true });
    const orgUrl = core.getInput('orgUrl', { required: true });
    const environmentId = core.getInput('environmentId', { required: true });
    const ownerId = core.getInput('ownerId', { required: true });
    console.log("Grabbed Variables Successfully");
    try {
        const bearerToken = await generateBearerToken(clientId, clientSecret, tenantId, environmentId);
        updateFlowOwners(bearerToken, orgUrl, ownerId);
        console.log(`Flows Updated Successfully`);
        console.log("Exiting....")
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();

*/