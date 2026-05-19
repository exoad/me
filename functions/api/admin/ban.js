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
    const { ip } = body;

    if (!ip || typeof ip !== 'string') {
      return jsonError('IP address required ',400 );
   }

   await env.DB.prepare(
     'INSERT OR IGNORE INTO bans (ip) VALUES (?)'
   ).bind(ip.trim()).run();

   return new Response(JSON.stringify({success:true }),{
     status :200 ,
     headers:{'Content-Type':'application/json','Cache-Control':'no-store'},
   });

 }catch(e){
   console.error(e);
   return jsonError('Something went wrong ',500 );
 }
}

function jsonError(message ,status ){
 return new Response(JSON.stringify({error:message }),{
   status ,
   headers:{'Content-Type':'application/json','Cache-Control':'no-store'},
 });
}
