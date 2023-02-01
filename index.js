const axios = require("axios");
const program = require("commander");

program
    .option("--environment <environment>")
    .option("--tenant_id <tenant_id>")
    .option("--client_id <client_id>")
    .option("--client_secret <client_secret>")
    .parse(process.argv);

const getAccessToken = async () => {
    const response = await axios.post("https://login.microsoftonline.com/" + program.tenant_id + "/oauth2/v2.0/token",
        "grant_type=client_credentials&client_id=" + program.client_id + "&client_secret=" + program.client_secret + "&scope=https://management.azure.com/.default",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );
    return response.data.access_token;
};

const updateFlowOwner = async (flowId, ownerId, accessToken) => {
    const response = await axios.patch("https://management.azure.com/providers/Microsoft.ProcessSimple/environments/" + program.environment + "/flows/" + flowId + "?api-version=2021-01-01-preview", {
        properties: {
            owner: {
                id: ownerId
            }
        }
    },
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
    console.log("Flow updated successfully: " + flowId);
};

const getAllFlows = async (accessToken) => {
    const response = await axios.get("https://management.azure.com/providers/Microsoft.ProcessSimple/environments/" + program.environment + "/flows?api-version=2021-01-01-preview",
        {
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });
    return response.data.value;
};

const main = async () => {
    const accessToken = await getAccessToken();
    const allFlows = await getAllFlows(accessToken);
    for (const flow of allFlows) {
        await updateFlowOwner(flow.id, program.client_id, accessToken);
    }
};

main();
