const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../dynamodb");
const { getCorsHeaders, isOptionsRequest } = require("../_corsHelper");

const TABLE_NAME = process.env.USERS_TABLE || "RecoveryUsers";

exports.handler = async (event) => {
  const headers = getCorsHeaders();

  // Safety check for event
  if (!event) {
    console.error("Event is null or undefined");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Invalid event" }),
    };
  }

  // Handle OPTIONS request
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

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
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
