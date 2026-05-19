import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import SubpageNav from '../components/SubpageNav';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

interface Entry {
  id: number;
  name: string;
  message: string;
  created_at: string;
  approved: number;
  safety_status?: string;
  safety_reason?: string;
  safety_scores?: string;
}

export default function GuestbookAdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [password, setPassword] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const [expandedSafetyId, setExpandedSafetyId] = useState<number | null>(null);
    const [checkingSafetyId, setCheckingSafetyId] = useState<number | null>(null);

    useEffect(() => {
        window.fetch('/api/admin/session', { cache: 'no-store' })
            .then((res) => {
                if (!res.ok) return;
                setLoggedIn(true);
                loadEntries();
            })
            .catch(() => {})
            .finally(() => setCheckingSession(false));
    }, []);

    const handleLogin=async(e:React.FormEvent)=>{e.preventDefault();setStatusMsg(null);try{var res=await window.fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password}),});if(res.ok){setPassword('');setLoggedIn(true);loadEntries();}else{setStatusMsg('Invalid password.');}}catch(err){console.error(err);setStatusMsg('Could not log in.');}};

    const loadEntries=async()=>{setLoading(true);try{var res=await window.fetch('/api/admin/pending',{cache:'no-store'});if(res.ok){var data=await res.json();setEntries(data.entries||[]);}else if(res.status===401||res.status===403){setLoggedIn(false);setEntries([]);}}catch(err){console.error(err);}finally{setLoading(false);}};

    const setEntryState=async(id:number, approved:number)=>{setStatusMsg(null);try{var res=await window.fetch('/api/admin/approve',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approved}),});if(res.ok){setStatusMsg(approved===1?'Entry approved.':'Entry marked unapproved.');loadEntries();}else{setStatusMsg('Could not update entry.');}}catch(err){console.error(err);setStatusMsg('Could not update entry.');}};

    const deleteEntry=async(id:number)=>{if(!window.confirm('Delete this entry from the admin list?'))return;setStatusMsg(null);try{var res=await window.fetch('/api/admin/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id}),});if(res.ok){setStatusMsg('Entry deleted.');loadEntries();}else{setStatusMsg('Could not delete entry.');}}catch(err){console.error(err);setStatusMsg('Could not delete entry.');};};

    const checkSafety=async(entry:Entry)=>{setCheckingSafetyId(entry.id);setStatusMsg(null);try{var res=await window.fetch('/api/admin/check-safety',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:entry.id}),});if(res.ok){var data=await res.json();setEntries((current)=>current.map((item)=>item.id===entry.id?{...item,...data.entry}:item));setExpandedSafetyId(entry.id);}else if(res.status===401||res.status===403){setLoggedIn(false);setEntries([]);}else{var err=await res.json().catch(()=>({error:'Could not check safety.'}));setStatusMsg(err.error||'Could not check safety.');}}catch(err){console.error(err);setStatusMsg('Could not check safety.');}finally{setCheckingSafetyId(null);}};

    const formatDate=(dateStr:string)=>{try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(dateStr));}catch(e){return dateStr;}};

    const safetyLabel=(entry:Entry)=>entry.safety_status?entry.safety_status.toUpperCase():'UNCHECKED';
    const safetyClass=(entry:Entry)=>{
        if(entry.safety_status==='safe')return 'bg-green/20 text-green';
        if(entry.safety_status==='cautionary')return 'bg-yellow/20 text-yellow';
        if(entry.safety_status==='unsafe')return 'bg-red/20 text-red';
        return 'bg-gray/20 text-fg4';
    };

    const parseScores=(entry:Entry)=>{try{var scores=entry.safety_scores?JSON.parse(entry.safety_scores):{};return Object.entries(scores).filter(([,score])=>typeof score==='number').sort((a,b)=>(b[1] as number)-(a[1] as number)).slice(0,6) as [string,number][];}catch(e){return [];}};
    const hasSafetyReport=(entry:Entry)=>Boolean(entry.safety_status&&entry.safety_status!=='unchecked');
    const handleSafetyBadge=async(entry:Entry)=>{if(!hasSafetyReport(entry)){await checkSafety(entry);return;}setExpandedSafetyId((current)=>current===entry.id?null:entry.id);};


// PLACEHOLDER_LOGIN_FORM

// PLACEHOLDER_LOGGED_IN
    if (checkingSession) {
        return (
          <>
          <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
          <main id="main" className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)]">
          <div className="max-w-xl mx-auto">
          <p className="text-fg4 text-sm font-sans" role="status" aria-live="polite">Checking admin session...</p>
          </div>
          </main>
          </>
      );
  }

    if (!loggedIn) {
        return (
          <>
          <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
          <main id="main" className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)]">
          <div className="max-w-xl mx-auto">
          <SubpageNav />
          <h1 className="text-4xl font-bold text-fg0 mb-8">Guestbook Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
          <label htmlFor="admin-password" className="block text-xs uppercase tracking-wide text-fg4 font-sans">Password</label>
          <input id="admin-password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" className="w-full bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:border-yellow"/>
          {statusMsg&&<p className="text-red text-sm font-sans" role="alert">{statusMsg}</p>}
          <button type="submit" className="bg-yellow text-bg0 px-6 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity">Login</button>
          </form>
          </div>
          </main>
          </>
      );
  }

  return(
      <>
      <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
      <main id="main" className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)]">
      <div className="max-w-2xl mx-auto">
      <SubpageNav backTo="/guestbook" backLabel="Guestbook" />
      <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">Moderation</p>
      <h1 className="text-4xl font-bold text-fg0 mb-3">Guestbook Entries</h1>
      <p className="text-fg3 text-sm font-sans mb-8">Newest entries are shown first. Deleted entries are hidden from this list. Safety checks run server-side only.</p>
      {statusMsg&&<p className="mb-4 text-yellow text-sm font-sans" role="status" aria-live="polite">{statusMsg}</p>}
      {loading ? (
          <p className="text-fg4 text-sm font-sans" role="status" aria-live="polite">Loading...</p>
      ) : entries.length === 0 ? (
          <p className="text-fg3 text-sm font-sans">No entries.</p>
      ) : (
          <>
          {entries.map((entry) => (
              <article key={entry.id} className="py-4 border-b border-bg2">
                  <div className="flex gap-4">
                      <div className={`pt-1 text-3xl ${entry.approved===1?'text-green':'text-yellow'}`} aria-hidden="true">
                          {entry.approved===1?<MdCheckCircle />:<MdRadioButtonUnchecked />}
                      </div>
                      <div className="min-w-0 flex-1">
                          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between mb-2">
                              <div className="flex items-center gap-3">
                                  <span className="font-bold text-fg0">{entry.name}</span>
                                  <span className={`text-[10px] font-sans uppercase tracking-widest px-2 py-1 rounded-sm ${entry.approved===1?'bg-green/20 text-green':'bg-yellow/20 text-yellow'}`}>
                                      {entry.approved===1?'Approved':'Unapproved'}
                                  </span>
                                  <button type="button" onClick={() => handleSafetyBadge(entry)} disabled={checkingSafetyId===entry.id} aria-expanded={expandedSafetyId===entry.id} className={`motion-press text-[10px] font-sans uppercase tracking-widest px-2 py-1 rounded-sm transition-opacity hover:opacity-80 disabled:opacity-50 ${safetyClass(entry)}`}>
                                      {checkingSafetyId===entry.id?'CHECKING...':safetyLabel(entry)}
                                  </button>
                              </div>
                              <time className="text-xs text-fg4">{formatDate(entry.created_at)}</time>
                          </header>
                          <p className="text-fg3 text-sm font-sans leading-relaxed whitespace-pre-wrap">{entry.message}</p>
                          {expandedSafetyId===entry.id&&(
                              <div className="mt-3 border border-bg2 bg-bg0_s/30 p-3 font-sans">
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                      <p className="text-xs text-fg3">{entry.safety_reason||'No safety report has been stored yet.'}</p>
                                      <button type="button" onClick={() => checkSafety(entry)} disabled={checkingSafetyId===entry.id} className="motion-press motion-link-reveal text-xs text-yellow disabled:opacity-50">
                                          {checkingSafetyId===entry.id?'Checking...':'Check again'}
                                      </button>
                                  </div>
                                  {parseScores(entry).length>0&&(
                                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                          {parseScores(entry).map(([category,score])=>(
                                              <div key={category} className="flex items-center justify-between gap-3 text-[11px] text-fg4">
                                                  <span>{category}</span>
                                                  <span className="text-fg2">{Math.round(score*100)}%</span>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                              {entry.approved===1 ? (
                                  <button type="button" onClick={() => setEntryState(entry.id,0)} className="motion-press motion-link-reveal text-sm text-yellow">Mark unapproved</button>
                              ) : (
                                  <button type="button" onClick={() => setEntryState(entry.id,1)} className="motion-press motion-link-reveal text-sm text-green">Approve</button>
                              )}
                              <button type="button" onClick={() => deleteEntry(entry.id)} className="motion-press motion-link-reveal text-sm text-red">Delete</button>
                          </div>
                      </div>
                  </div>
              </article>
          ))}
          </>
      )}
      </div>
      </main>
</>
);
}
