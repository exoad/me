export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit')) || 50));
    const offset = (page -1 )*limit ;

   // Get total count
   const countResult=await env.DB.prepare(
     'SELECT COUNT(*) as total FROM entries WHERE approved = ?'
   ).bind(1).first();
   
   
   
   
   
   
   

// Get paginated entries

const{results}=await env.DB.prepare(
'SELECT id ,name ,message ,created_at FROM entries WHERE approved = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
).bind(1 ,limit ,offset).all();

return new Response(JSON.stringify({
entries :results ,
totalEntries :countResult.total ,
totalPages :Math.ceil(countResult.total /limit ),
currentPage :page ,
}),{
status :200 ,
headers:{'Content-Type':'application/json'},
});

}catch(e){
console.error(e);
return new Response(JSON.stringify({error:'Something went wrong '}),{
status :500 ,
headers:{'Content-Type':'application/json'},
});
}
}
