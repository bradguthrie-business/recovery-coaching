const { GetCommand } = require("@aws-sdk/lib-dynamodb");
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
    const { userId } = body;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId,
      },
    };

    const result = await dynamoDocClient.send(new GetCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        counters: result.Item?.counters || {},
      }),
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
