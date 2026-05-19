export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, message, turnstileToken } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return jsonError('Name is required', 400);
    }
    if (name.trim().length > 100) {
      return jsonError('Name must be under 100 characters', 400);
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return jsonError('Message is required', 400);
    }
    if (message.trim().length > 600) {
      return jsonError('Message must be under 600 characters', 400);
    }
    if (!turnstileToken) {
      return jsonError('Turnstile verification required', 400);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

   // Check ban list
   const banned = await env.DB.prepare(
     'SELECT ip FROM bans WHERE ip = ?'
   ).bind(ip).first();
   if (banned) {
     return jsonError('Access denied',403 );
   }

   // Rate limit check using D1 instead of KV
   // Store rate limit in a simple approach: count entries from this IP in last hour
   const oneHourAgo = new Date(Date.now() -60 *60 *1000).toISOString();
   
   
   
   
   
   
   
   

// Verify Turnstile token

const turnstileResult=await fetch(
'https://challenges.cloudflare.com/turnstile/v0/siteverify',
{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
secret:env.TURNSTILE_SECRET_KEY,
response:turnstileToken,
remoteip:ip,
}),
}
).then(r=>r.json());

if(!turnstileResult.success){
return jsonError('Verification failed Please try again ',400 );
}

const moderation = await moderateEntry({
  apiKey: env.OPENAI_API_KEY,
  name: name.trim(),
  message: message.trim(),
});

// Insert entry as pending approved=0. Unsafe entries stay hidden from public views,
// but remain visible in the admin dashboard for review.
await env.DB.prepare(
'INSERT INTO entries(name ,message, safety_status, safety_reason, safety_scores ) VALUES(? ,?, ?, ?, ?)'
).bind(
  name.trim(),
  message.trim(),
  moderation.status,
  moderation.reason,
  JSON.stringify(moderation.scores)
).run();

return new Response(JSON.stringify({
success :true ,
message:'Your entry has been submitted for review '
}),{
status :200 ,
headers:{'Content-Type':'application/json'},
});

}catch(e){
console.error(e);
return jsonError('Something went wrong ',500 );
}
}

function jsonError(message ,status ){
return new Response(JSON.stringify({error :message }),{
status ,
headers:{'Content-Type':'application/json'},
});
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
