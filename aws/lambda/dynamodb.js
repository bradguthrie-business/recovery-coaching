const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Shared DynamoDB DocumentClient (v3) for all Lambdas
const baseClient = new DynamoDBClient({});

const dynamoDocClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = { dynamoDocClient };
