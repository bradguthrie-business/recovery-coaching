const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDocClient } = require('../dynamodb');
const { getCorsHeaders, isOptionsRequest } = require('../_corsHelper');

const TABLE_NAME = process.env.USERS_TABLE || 'RecoveryUsers';

exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
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
    if (typeof event.body === 'string') {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        body = {};
      }
    } else {
      body = event.body || {};
    }
    const { userId, email, displayName, recoveryPath, createdAt } = body;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId' }),
      };
    }

    // Get existing user data if it exists
    let existingData = {};
    try {
      const getParams = {
        TableName: TABLE_NAME,
        Key: { userId },
      };
      const existing = await dynamoDocClient.send(new GetCommand(getParams));
      if (existing.Item) {
        existingData = existing.Item;
      }
    } catch (error) {
      // User doesn't exist yet, that's fine
    }

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId,
        email: email || existingData.email || '',
        displayName: displayName || existingData.displayName || '',
        recoveryPath: recoveryPath !== undefined ? recoveryPath : (existingData.recoveryPath || null),
        createdAt: createdAt || existingData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    await dynamoDocClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Recovery path saved successfully',
        userId,
        recoveryPath 
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};

