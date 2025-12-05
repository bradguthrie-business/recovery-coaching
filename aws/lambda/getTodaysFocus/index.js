const { GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDocClient } = require('../dynamodb');
const { getCorsHeaders, isOptionsRequest } = require('../_corsHelper');
const OpenAI = require('openai');

const JOURNAL_TABLE = process.env.JOURNAL_TABLE || 'JournalEntries';
const USERS_TABLE = process.env.USERS_TABLE || 'RecoveryUsers';

const parseJsonSafe = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

const buildFallbackFocus = (recoveryPath, recentEntries) => {
  const focusTemplates = {
    aa: {
      title: 'Daily Reflection',
      content:
        'Take a moment today to reflect on Step 1: admitting powerlessness. Remember, admitting we need help is a sign of strength, not weakness.',
      suggestions: ['Attend a meeting today', 'Call your sponsor', 'Read from the Big Book']
    },

    na: {
      title: 'One Day at a Time',
      content:
        'Focus on staying clean just for today. Each clean day is a victory and a reminder of the life you are building.',
      suggestions: ['Connect with your support network', 'Practice gratitude', 'Help another person in recovery']
    },

    celebrate: {
      title: 'Faith & Reflection',
      content:
        'Pause and reflect on God’s role in your healing. Recovery is a journey of grace, courage, and surrender. Let today be a step toward deeper peace.',
      suggestions: ['Take 5 minutes for quiet prayer', 'Read a scripture that encourages you', 'Reach out to someone from your group']
    },

    smart: {
      title: 'Building Motivation',
      content:
        'Remind yourself why you chose recovery. Motivation grows when we reconnect with our values and long-term goals.',
      suggestions: ['Review your change plan', 'Practice an urge management tool', 'Track a positive behavior today']
    },

    mat: {
      title: 'Stability & Safety',
      content:
        'Medication-assisted treatment is a tool of strength, not weakness. Take a moment to appreciate the stability you’re building as your brain and body heal.',
      suggestions: ['Notice how your body feels today', 'Reflect on what stability means to you', 'Take medications on schedule and without shame']
    },

    'cali-sober': {
      title: 'Mindful Living',
      content:
        'Your path is about balance, intention, and avoiding substances that pull you off course. Today, check in with whether your choices support your goals.',
      suggestions: ['Set a mindful intention for the day', 'Do one activity completely sober and present', 'Jot down one boundary that keeps you safe']
    },

    psychedelic: {
      title: 'Integration Moment',
      content:
        'Growth from psychedelic experiences comes through integration, not the experience alone. Reflect on one insight you want to apply in real life today.',
      suggestions: ['Journal a recent insight', 'Practice grounding or meditation', 'Choose one small action aligned with your intentions']
    },

    'harm-reduction': {
      title: 'Safer Choices Today',
      content:
        'Harm reduction is about compassion and meeting yourself where you are. What is one way you can reduce risk and increase safety today?',
      suggestions: ['Identify one high-risk situation to avoid', 'Check in with your emotional state', 'Reach out to someone who supports your goals']
    },

    abstinence: {
      title: 'Commitment to Growth',
      content:
        'Every substance-free day strengthens your clarity, resilience, and sense of self. Celebrate the discipline you’re practicing today.',
      suggestions: ['Reflect on one benefit of staying sober', 'Practice an urge-surfing technique', 'Spend time in a healthy routine you enjoy']
    },

    'not-sure': {
      title: 'Exploring Your Path',
      content:
        'It’s okay not to have it all figured out. Recovery is personal, and exploring options is part of the journey. Today, focus on what feels supportive, not perfect.',
      suggestions: ['Learn about one recovery approach', 'Ask yourself what you truly want healing from', 'Do one small act of self-kindness']
    }
  };

  const template = focusTemplates[recoveryPath] || focusTemplates['aa'];

  if (recentEntries && recentEntries.length > 0) {
    const lastEntry = recentEntries[0];
    if (lastEntry.mood === 'struggling' || lastEntry.cravingIntensity > 7) {
      template.content += ' You have been facing some challenges recently. Remember to reach out for support and use your coping strategies.';
    }
  }

  return template;
};

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

    // Get user's recovery path
    const userParams = {
      TableName: USERS_TABLE,
      Key: { userId },
    };
    const userResult = await dynamoDocClient.send(new GetCommand(userParams));
    const recoveryPath = userResult.Item?.recoveryPath || 'aa';

    // Get recent journal entries
    const journalParams = {
      TableName: JOURNAL_TABLE,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
      Limit: 5,
    };
    const journalResult = await dynamoDocClient.send(new QueryCommand(journalParams));
    const recentEntries = journalResult.Items || [];

    let focus = buildFallbackFocus(recoveryPath, recentEntries);

    console.log('focus', focus);

    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const recentSummary = recentEntries && recentEntries.length > 0
          ? recentEntries.slice(0, 3).map(e => ({
              date: e.createdAt || e.date,
              mood: e.mood,
              cravingIntensity: e.cravingIntensity,
              triggers: e.triggers,
              content: e.content?.slice(0, 240)
            }))
          : [];

          console.log('recentSummary', recentSummary, 'recoveryPath', recoveryPath);


        const prompt = `
You are a supportive recovery coach creating a concise "Today's Focus" message.
Recovery path: ${recoveryPath || 'unknown'}
Recent journal signals: ${JSON.stringify(recentSummary)}

Respond as JSON with keys: title, content, suggestions (array of 3 short items).
Make content 2–3 sentences, compassionate, practical, and specific to the path.
Avoid mentioning this is AI-generated.`;

        console.log('prompt, ',   prompt);

        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        });

        console.log('completion', completion);

        const aiContent = completion.choices?.[0]?.message?.content;

        console.log('aiContent', aiContent, 'completion.choices?.[0]?.message',  completion.choices?.[0]?.message);
        const parsed = parseJsonSafe(aiContent);
        console.log('parsed ai contet', parsed);
        if (parsed?.title && parsed?.content) {
          focus = {
            title: parsed.title,
            content: parsed.content,
            suggestions: parsed.suggestions && Array.isArray(parsed.suggestions) ? parsed.suggestions : []
          };
        }
      } catch (err) {
        console.error('OpenAI generation failed, using fallback:', err);
      }
    }

    console.log('focus to return', focus, journalResult, recentEntries, recoveryPath);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(focus),
    };
  } catch (error) {
    console.error('Error fetching today\'s focus:', error);
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