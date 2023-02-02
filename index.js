const axios = require("axios");
const core = require('@actions/core');


/*
program
    .option("--environmentId <environmentId>")
    .option("--tenant_id <tenant_id>")
    .option("--client_id <client_id>")
    .option("--client_secret <client_secret>")
    .parse(process.argv);
*/

async function generateBearerToken(clientId, clientSecret, tenantId, environmentId) {
    const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=https://api.crm.dynamics.com/${environmentId}`);

    return response.data.access_token;
}

async function updateFlowOwners(bearerToken, orgUrl) {
    const flows = await axios.get(`${orgUrl}/api/data/v9.1/workflows`, {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    });

    flows.data.forEach(async flow => {
        const ownerId = 'new_owner_guid';

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

async function main(clientId, clientSecret, tenantId, orgUrl, environmentId) {
    const clientId = core.getInput('clientId', { required: true });
    const clientSecret = core.getInput('clientSecret', { required: true });
    const tenantId = core.getInput('tenantId', { required: true });
    const orgUrl = core.getInput('orgUrl', { required: true });
    const environmentId = core.getInput('environmentId', { required: true });
    const bearerToken = await generateBearerToken(clientId, clientSecret, tenantId, environmentId);
    updateFlowOwners(bearerToken, orgUrl);
}

module.exports = {
    main,
};