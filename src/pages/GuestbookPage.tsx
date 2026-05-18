import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { strings } from '../data/shared';
import { MdArrowBack, MdSend, MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface GuestbookResponse {
  entries: GuestbookEntry[];
  totalPages: number;
  currentPage: number;
}

export default function GuestbookPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [msgText, setMsgText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);

    useEffect(() => {
        if (window.scrollY > 0) window.scrollTo({ top: 0 });
        loadEntries(page);
        if (!document.querySelector('script[src*="turnstile"]')) {
            var s=document.createElement('script');
            s.src='https://challenges.cloudflare.com/turnstile/v0/api.js';
            s.async=true;
            document.head.appendChild(s);
        }
        return () => {};
        
        async function loadEntries(p) {
          setLoading(true);
          try{
              var res=await window.fetch('/api/guestbook/list?page='+p+'&limit=20');
              var data;
              if(res.ok){data=await res.json();}else{data={entries:[],totalPages:1,currentPage:p};}
              setEntries(data.entries||[]);
              setTotalPages(data.totalPages||1);
          }catch(e){
              console.error(e);setEntries([]);
          }finally{setLoading(false);}
      }
    },[page]);

    const handleSubmit=async(e)=>{
e.preventDefault();
if(!name.trim()||!msgText.trim())return;

var turnstileEl=document.querySelector('[name="cf-turnstile-response"]');
var turnstileToken=turnstileEl?turnstileEl.value:'';

if(!turnstileToken){
setStatusMsg({text:'Please complete the verification.',ok:false});
return;
}

setSubmitting(true);

try{
var res=await window.fetch('/api/guestbook/submit',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({name:name.trim(),message:msgText.trim(),turnstileToken}),
});

var data=await res.json();

if(res.ok){
setName('');
setMsgText('');
setStatusMsg({text:data.message||strings.pages.guestbook.success_message,ok:true});
if(window.turnstile)window.turnstile.reset();
}else{
setStatusMsg({text:data.error||strings.pages.guestbook.error_submit,ok:false});
}
}catch(err){
setStatusMsg({text:String(strings.pages.guestbook.error_submit),ok:false});
}finally{
setSubmitting(false);
setTimeout(()=>setStatusMsg(null),5000);
}
};

const formatDate=(dateStr)=>{
try{
return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(dateStr));
}catch(e){return dateStr;}
};

return(
<div className="min-h-screen bg-bg0">
<div className="max-w-2xl mx-auto px-6 py-12">
<button onClick={()=>navigate('/')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans mb-12 group">Home</button>
<div className="mb-8"><h2 className="text-[10px] uppercase tracking-[0.2em] text-fg4 mb-4 font-sans">Visitors</h2><h1 className="text-4xl md:text-5xl font-bold text-fg0 mb-4">{strings.pages.guestbook.title}</h1><p className="text-fg3 text-base font-sans leading-relaxed max-w-xl">{strings.pages.guestbook.description}</p></div>
<form onSubmit={handleSubmit} className="mb-12 border border-bg2 p-6 space-y-4">
<div><label className="block text-xs uppercase tracking-wide text-fg4 mb-1 font-sans">{strings.pages.guestbook.name_label}</label><input type="text" value={name} onChange={(e)=>setName(e.target.value)} maxLength={100} required/></div>
<div><label className="block text-xs uppercase tracking-wide text-fg4 mb-1 font-sans">Message</label><textarea value={msgText} onChange={(e)=>setMsgText(e.target.value)} maxLength={1000} required rows={3}/></div>
{/* Turnstile */}<div data-sitekey="TURNSTILE_SITE_KEY" data-theme="dark"/>
{statusMsg&&(<p>{statusMsg.text}</p>)}
<button type="submit" disabled={submitting||!name.trim()||!msgText.trim()}><MdSend size={14}/>{submitting?'Submitting...':strings.pages.guestbook.submit_button}</button>
</form>
<div><h3>Recent Entries</h3>
{loading?(<span>{strings.pages.guestbook.loading_entries}</span>)
:entries.length===0?(<p>{strings.pages.guestbook.no_entries}</p>)  
:(<>
{entries.map((entry)=>(<article key={entry.id}><header><span>{entry.name}</span><time>{" "+formatDate(entry.created_at)}</time></header><p>{" "+entry.message+" "}</p></article>))}  
</>)}
</div>
{/* Pagination */}<nav><button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button><span>Page {" "+page+" "} of {" "+totalPages+" "}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button></nav>
</div>
</div>
);
}