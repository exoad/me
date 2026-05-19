const SESSION_COOKIE = 'gb_session';
const SESSION_DURATION =7 *24 *60 *60 *1000 ;//7 days

export async function onRequest(context){
const{request ,env}=context;

if(request.method !=='POST'){
return new Response(JSON.stringify({error:'Method not allowed '}),{
status :405 ,
headers:{'Content-Type':'application/json'},
});
}

try{
if(!env.ADMIN_PASSWORD){
return jsonError('Admin password is not configured ',500 );
}

const body=await request.json();
const{password}=body;

if(!password){
return jsonError('Password required ',400 );
}

// Timing-safe password comparison using SHA-256
const encoder=new TextEncoder();
const inputHash=await crypto.subtle.digest(
'SHA-256',
encoder.encode(password)
);
const expectedHash=await crypto.subtle.digest(
'SHA-256',
encoder.encode(env.ADMIN_PASSWORD)
);

const inputArr=new Uint8Array(inputHash);
const expectedArr=new Uint8Array(expectedHash);

if(inputArr.length !==expectedArr.length){
return jsonError('Invalid password ',401 );
}

let result=0 ;
for(let i=0 ;i<inputArr.length ;i++){
result|=inputArr[i]^expectedArr[i];
}
if(result !==0 ){
return jsonError('Invalid password ',401 );
}

// Create HMAC-signed session token
const secret=env.SESSION_SECRET ||env.ADMIN_PASSWORD;
const payload=btoa(JSON.stringify({
sid:crypto.randomUUID(),
exp:Date.now()+SESSION_DURATION,
})).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const sessionToken=await sign(payload ,secret );

// Set cookie
const expires=new Date(Date.now()+SESSION_DURATION).toUTCString();
return new Response(JSON.stringify({success:true }),{
status :200 ,
headers:{
'Content-Type':'application/json',
'Cache-Control':'no-store',
'Set-Cookie':`${SESSION_COOKIE}=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires}`,
},
});

}catch(e){
console.error(e);
return jsonError('Something went wrong ',500 );
}
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

function jsonError(message ,status ){
 return new Response(JSON.stringify({error:message }),{
   status ,
   headers:{'Content-Type':'application/json','Cache-Control':'no-store'},
 });
}
