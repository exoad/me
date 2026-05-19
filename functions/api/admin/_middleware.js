const SESSION_COOKIE = 'gb_session';

export async function onRequest(context) {
  const { request, env } = context;

  // Skip middleware for login endpoint
  if (new URL(request.url).pathname === '/api/admin/login') {
    return context.next();
  }

  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: noStoreJsonHeaders(),
    });
  }

  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  const sessionToken = cookies[SESSION_COOKIE];

// Verify session token
const secret=env.SESSION_SECRET ||env.ADMIN_PASSWORD;
if(!secret){
return new Response(JSON.stringify({error:'Admin session secret is not configured '}),{
status :500 ,
headers:noStoreJsonHeaders(),
});
}
const isValid=await verifySession(sessionToken ,secret );

if(!isValid){
return new Response(JSON.stringify({error:'Invalid or expired session '}),{
status :403 ,
headers:noStoreJsonHeaders(),
});
}

return context.next();
}

async function verifySession(token ,secret ){
if(!token ||!token.includes('.'))return null ;

const[data ,signature]=token.split('.');
const expectedToken=await sign(data ,secret );
const expectedSignature=expectedToken.split('.')[1];
if(!timingSafeEqual(signature, expectedSignature))return null ;
const payload=parsePayload(data);
if(!payload ||typeof payload.exp !=='number'||payload.exp <Date.now())return null ;
return data ;
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

function parsePayload(data){
try{
const normalized=data.replace(/-/g,'+').replace(/_/g,'/');
const padded=normalized.padEnd(Math.ceil(normalized.length/4)*4,'=');
return JSON.parse(atob(padded));
}catch(e){
return null ;
}
}

function timingSafeEqual(a,b){
if(typeof a !=='string'||typeof b !=='string')return false ;
const encoder=new TextEncoder();
const aBytes=encoder.encode(a);
const bBytes=encoder.encode(b);
if(aBytes.length !==bBytes.length)return false ;
let result=0;
for(let i=0;i<aBytes.length;i++){
result|=aBytes[i]^bBytes[i];
}
return result===0;
}

function noStoreJsonHeaders(){
return {
'Content-Type':'application/json',
'Cache-Control':'no-store',
};
}
