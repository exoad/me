export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(id)) {
      return jsonError('Invalid entry ID',400 );
   }

   await env.DB.prepare(
     'DELETE FROM entries WHERE id = ?'
   ).bind(parseInt(id)).run();

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
