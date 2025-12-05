const { GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDocClient } = require('../dynamodb');
const { getCorsHeaders, isOptionsRequest } = require('../_corsHelper');

const COUNTERS_TABLE = process.env.COUNTERS_TABLE || 'RecoveryCounters';
const JOURNAL_TABLE = process.env.JOURNAL_TABLE || 'JournalEntries';

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
    
    const { userId } = body;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing userId' }),
      };
    }

    // Get counters
    const countersParams = {
      TableName: COUNTERS_TABLE,
      Key: { userId },
    };
    const countersResult = await dynamoDocClient.send(new GetCommand(countersParams));
    const counters = countersResult.Item?.counters || {};

    // Calculate longest streak
    let longestStreak = 0;
    Object.values(counters).forEach(counter => {
      if (counter.startDate) {
        const start = new Date(counter.startDate);
        const now = new Date();
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        longestStreak = Math.max(longestStreak, days);
      }
    });

    // Get journal entry count
    const journalParams = {
      TableName: JOURNAL_TABLE,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      Select: 'COUNT',
    };
    const journalResult = await dynamoDocClient.send(new QueryCommand(journalParams));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        daysSober: longestStreak,
        journalEntries: journalResult.Count || 0,
        communityPosts: 0, // TODO: Implement when community feature is added
      }),
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
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