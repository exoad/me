import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

interface Entry {
  id: number;
  name: string;
  message: string;
  created_at: string;
  approved: number;
  safety_status?: string;
  safety_reason?: string;
}

export default function GuestbookAdminPage() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<string | null>(null);

    const handleLogin=async(e:React.FormEvent)=>{e.preventDefault();setStatusMsg(null);try{var res=await window.fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password}),});if(res.ok){setLoggedIn(true);loadEntries();}else{setStatusMsg('Invalid password.');}}catch(err){console.error(err);setStatusMsg('Could not log in.');}};

    const loadEntries=async()=>{setLoading(true);try{var res=await window.fetch('/api/admin/pending');if(res.ok){var data=await res.json();setEntries(data.entries||[]);}}catch(err){console.error(err);}finally{setLoading(false);}};

    const setEntryState=async(id:number, approved:number)=>{try{var res=await window.fetch('/api/admin/approve',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,approved}),});if(res.ok)loadEntries();}catch(err){console.error(err);}};

    const deleteEntry=async(id:number)=>{try{var res=await window.fetch('/api/admin/delete',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id}),});if(res.ok)loadEntries();}catch(err){console.error(err)};};

    const formatDate=(dateStr:string)=>{try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(dateStr));}catch(e){return dateStr;}};

    const safetyLabel=(entry:Entry)=>entry.safety_status?entry.safety_status.toUpperCase():'UNCHECKED';
    const safetyClass=(entry:Entry)=>{
        if(entry.safety_status==='safe')return 'bg-green/20 text-green';
        if(entry.safety_status==='cautionary')return 'bg-yellow/20 text-yellow';
        if(entry.safety_status==='unsafe')return 'bg-red/20 text-red';
        return 'bg-gray/20 text-fg4';
    };


// PLACEHOLDER_LOGIN_FORM

// PLACEHOLDER_LOGGED_IN
    if (!loggedIn) {
        return (
          <>
          <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
          <div className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)]">
          <div className="max-w-xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans mb-12 group">Home</button>
          <h1 className="text-4xl font-bold text-fg0 mb-8">Guestbook Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:outline-none focus:border-yellow"/>
          {statusMsg&&<p className="text-red text-sm font-sans">{statusMsg}</p>}
          <button type="submit" className="bg-yellow text-bg0 px-6 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity">Login</button>
          </form>
          </div>
          </div>
          </>
      );
  }

  return(
      <>
      <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
      <div className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)]">
      <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/guestbook')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans mb-12 group">Back to guestbook</button>
      <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">Moderation</p>
      <h1 className="text-4xl font-bold text-fg0 mb-3">Guestbook Entries</h1>
      <p className="text-fg3 text-sm font-sans mb-8">Newest entries are shown first. Deleted entries are hidden from this list.</p>
      {loading ? (
          <p className="text-fg4 text-sm font-sans">Loading...</p>
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
                                  <span className={`text-[10px] font-sans uppercase tracking-widest px-2 py-1 rounded-sm ${safetyClass(entry)}`}>
                                      {safetyLabel(entry)}
                                  </span>
                              </div>
                              <time className="text-xs text-fg4">{formatDate(entry.created_at)}</time>
                          </header>
                          <p className="text-fg3 text-sm font-sans leading-relaxed whitespace-pre-wrap">{entry.message}</p>
                          {entry.safety_reason&&(
                              <p className="mt-2 text-xs text-fg4 font-sans">{entry.safety_reason}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3">
                              {entry.approved===1 ? (
                                  <button onClick={() => setEntryState(entry.id,0)} className="text-sm text-yellow hover:underline">Mark unapproved</button>
                              ) : (
                                  <button onClick={() => setEntryState(entry.id,1)} className="text-sm text-green hover:underline">Approve</button>
                              )}
                              <button onClick={() => deleteEntry(entry.id)} className="text-sm text-red hover:underline">Delete</button>
                          </div>
                      </div>
                  </div>
              </article>
          ))}
          </>
      )}
      </div>
      </div>
</>
);
}
