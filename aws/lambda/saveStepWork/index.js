const { GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDocClient } = require("../dynamodb");
const { getCorsHeaders, isOptionsRequest } = require("../_corsHelper");

const TABLE_NAME = process.env.STEPWORK_TABLE || "StepWork";

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
    const { userId, step, stepWork } = body;

    if (!userId || !step || !stepWork) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Get existing step work
    const getParams = {
      TableName: TABLE_NAME,
      Key: { userId },
    };
    const existing = await dynamoDocClient.send(new GetCommand(getParams));
    const currentStepWork = existing.Item?.stepWork || {};

    // Update specific step
    const updatedStepWork = {
      ...currentStepWork,
      [step]: stepWork,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        stepWork: updatedStepWork,
        updatedAt: new Date().toISOString(),
      },
    };

    await dynamoDocClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Step work saved successfully" }),
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
