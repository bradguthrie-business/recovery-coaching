const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDocClient } = require('../dynamodb');
const { getCorsHeaders, isOptionsRequest } = require('../_corsHelper');

const TABLE_NAME = process.env.JOURNAL_TABLE || 'JournalEntries';

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
    const { userId, limit = 10 } = body;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId' }),
      };
    }

    const params = {
      TableName: TABLE_NAME,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
      Limit: limit,
    };

    const result = await dynamoDocClient.send(new QueryCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        entries: result.Items || [],
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