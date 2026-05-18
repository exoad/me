const SESSION_COOKIE = 'gb_session';

export async function onRequest(context) {
  const { request, env } = context;

  // Skip middleware for login endpoint
  if (request.url.includes('/api/admin/login')) {
    return context.next();
  }

  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  const sessionToken = cookies[SESSION_COOKIE];

// Verify session token
const secret=env.SESSION_SECRET ||env.ADMIN_PASSWORD ||'fallback-secret';
const isValid=await verifySession(sessionToken ,secret );

if(!isValid){
return new Response(JSON.stringify({error:'Invalid or expired session '}),{
status :403 ,
headers:{'Content-Type':'application/json'},
});
}

return context.next();
}

async function verifySession(token ,secret ){
if(!token ||!token.includes('.'))return null ;

const[data ,signature]=token.split('.');
const expectedToken=await sign(data ,secret );
return expectedToken ===token ?data :null ;
}

async function sign(data ,secret ){
const encoder=new TextEncoder();
const keyData=encoder.encode(secret );
const key=await crypto.subtle.importKey(
'raw',keyData,{name:'HMAC',hash:'SHA-256'},false,['sign']
);
const signature=await crypto.subtle.sign(
'HMAC',key,encoder.encode(data )
);
return data+'.'+btoa(String.fromCharCode(...new Uint8Array(signature)))
.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
