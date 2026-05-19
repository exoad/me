export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'PATCH') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const body = await request.json();
    const pathId = url.pathname.split('/').pop();
    const id = body.id ?? pathId;
    const { approved } = body; // 0 = unapproved, 1 = approved, 3 = deleted

    if (!id || isNaN(id)) {
      return jsonError('Invalid entry ID', 400);
    }
    if (approved !== 0 && approved !== 1 && approved !== 3) {
      return jsonError('approved must be 0 (unapproved), 1 (approved), or 3 (deleted)',400 );
   }

   await env.DB.prepare(
     'UPDATE entries SET approved = ? WHERE id = ?'
   ).bind(approved ,parseInt(id)).run();

   return new Response(JSON.stringify({success:true }),{
     status :200 ,
     headers:{'Content-Type':'application/json'},
   });

 }catch(e){
   console.error(e);
   return jsonError('Something went wrong ',500 );
 }
}

function jsonError(message ,status ){
 return new Response(JSON.stringify({error:message }),{
   status ,
   headers:{'Content-Type':'application/json'},
 });
}
