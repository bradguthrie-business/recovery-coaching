const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../dynamodb");
const { getCorsHeaders, isOptionsRequest } = require("../_corsHelper");

const TABLE_NAME = process.env.JOURNAL_TABLE || "JournalEntries";

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
    const { userId, entry } = body;

    if (!userId || !entry) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const entryId = `${userId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const params = {
      TableName: TABLE_NAME,
      Item: {
        entryId,
        userId,
        ...entry,
        createdAt: entry.createdAt || new Date().toISOString(),
      },
    };

    await dynamoDocClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Journal entry saved successfully",
        entryId,
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
