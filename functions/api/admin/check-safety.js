export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  try {
    const body = await request.json();
    const id = Number.parseInt(String(body.id), 10);

    if (!Number.isInteger(id) || id <= 0) {
      return jsonError('Invalid entry ID', 400);
    }

    const entry = await env.DB.prepare(
      'SELECT id, name, message, created_at, approved FROM entries WHERE id = ? AND approved != 3'
    ).bind(id).first();

    if (!entry) {
      return jsonError('Entry not found', 404);
    }

    const moderation = await moderateEntry({
      apiKey: env.OPENAI_API_KEY,
      name: entry.name,
      message: entry.message,
    });

    await env.DB.prepare(
      'UPDATE entries SET safety_status = ?, safety_reason = ?, safety_scores = ? WHERE id = ?'
    ).bind(
      moderation.status,
      moderation.reason,
      JSON.stringify(moderation.scores),
      id
    ).run();

    return new Response(JSON.stringify({
      entry: {
        ...entry,
        safety_status: moderation.status,
        safety_reason: moderation.reason,
        safety_scores: JSON.stringify(moderation.scores),
      },
    }), {
      status: 200,
      headers: jsonHeaders(),
    });
  } catch (e) {
    console.error(e);
    return jsonError('Something went wrong', 500);
  }
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: jsonHeaders(),
  });
}

function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
}

async function moderateEntry({ apiKey, name, message }) {
  if (!apiKey) {
    return {
      status: 'unchecked',
      reason: 'Moderation API key is not configured.',
      scores: {},
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'omni-moderation-latest',
        input: `Guestbook name: ${name}\nGuestbook message: ${message}`,
      }),
    });

    if (!response.ok) {
      return {
        status: 'unchecked',
        reason: `Moderation request failed with ${response.status}.`,
        scores: {},
      };
    }

    const data = await response.json();
    const result = data.results?.[0] || {};
    const categories = result.categories || {};
    const scores = result.category_scores || {};

    return classifyModeration({ message, categories, scores, flagged: !!result.flagged });
  } catch (e) {
    console.error('Moderation failed', e);
    return {
      status: 'unchecked',
      reason: 'Moderation request failed.',
      scores: {},
    };
  }
}

function classifyModeration({ message, categories, scores, flagged }) {
  const unsafeCategories = [
    'hate',
    'hate/threatening',
    'harassment/threatening',
    'sexual',
    'sexual/minors',
    'violence/graphic',
    'self-harm/intent',
    'self-harm/instructions',
    'illicit/violent',
  ];
  const cautionCategories = [
    'harassment',
    'violence',
    'self-harm',
    'illicit',
  ];
  const mildProfanity = /\b(fuck|shit|bitch|asshole|bastard|damn|crap|dick|piss)\b/i;

  const unsafeSignals = unsafeCategories.filter((category) => {
    return categories[category] || (typeof scores[category] === 'number' && scores[category] >= 0.55);
  });

  if (unsafeSignals.length > 0 || (flagged && maxScore(scores) >= 0.75)) {
    return {
      status: 'unsafe',
      reason: `Unsafe content: ${unsafeSignals.join(', ') || 'high moderation score'}.`,
      scores,
    };
  }

  const cautionSignals = cautionCategories.filter((category) => {
    return categories[category] || (typeof scores[category] === 'number' && scores[category] >= 0.25);
  });

  if (cautionSignals.length > 0 || mildProfanity.test(message)) {
    return {
      status: 'cautionary',
      reason: cautionSignals.length > 0
        ? `Review suggested: ${cautionSignals.join(', ')}.`
        : 'Review suggested: mild profanity.',
      scores,
    };
  }

  return {
    status: 'safe',
    reason: 'No notable safety signals.',
    scores,
  };
}

function maxScore(scores) {
  return Math.max(0, ...Object.values(scores).filter((value) => typeof value === 'number'));
}
