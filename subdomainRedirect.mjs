import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
    const domain = event.queryStringParameters.domain;
    const subdomain = event.queryStringParameters.subdomain;

    const params = {
        TableName: 'subdomainRedirect',
        Key: {
            domain,
            subdomain
        }
    };

    try {
        const { Item } = await docClient.send(new GetCommand(params));
        const url = Item ? Item.url : 'Default URL if not found';

        return {
            statusCode: 302,
            headers: {
                'Location': url
            },
            body: ''
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Server Error')
        };
    }
};
