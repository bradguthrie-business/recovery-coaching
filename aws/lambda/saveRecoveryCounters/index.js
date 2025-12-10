const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../dynamodb");
const { getCorsHeaders, isOptionsRequest } = require("../_corsHelper");

const TABLE_NAME = process.env.COUNTERS_TABLE || "RecoveryCounters";

exports.handler = async (event) => {
  const headers = getCorsHeaders();

  if (isOptionsRequest(event)) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    // Parse body - handle both string and object
    let body;
    if (typeof event.body === "string") {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }
    } else {
      body = event.body || {};
    }
    const { userId, counters } = body;

    if (!userId || !counters) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        counters,
        updatedAt: new Date().toISOString(),
      },
    };

    await dynamoDocClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Counters saved successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
