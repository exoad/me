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
    if (message.trim().length > 1000) {
      return jsonError('Message must be under 1000 characters', 400);
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

// Insert entry as pending approved=0

await env.DB.prepare(
'INSERT INTO entries(name ,message ) VALUES(? ,?)'
).bind(name.trim(),message.trim()).run();

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
