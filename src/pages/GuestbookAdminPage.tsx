import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

interface Entry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export default function GuestbookAdminPage() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLogin=async(e:React.FormEvent)=>{e.preventDefault();try{var res=await window.fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password}),});if(res.ok){setLoggedIn(true);loadPending();}}catch(err){console.error(err);}};

    const loadPending=async()=>{setLoading(true);try{var res=await window.fetch('/api/admin/pending');if(res.ok){var data=await res.json();setEntries(data.entries||[]);}}catch(err){console.error(err);}finally{setLoading(false);}};

    const approveEntry=async(id:number)=>{try{var res=await window.fetch('/api/admin/approve/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({approved:1}),});if(res.ok)loadPending();}catch(err){console.error(err);}};

    const deleteEntry=async(id:number)=>{try{var res=await window.fetch('/api/admin/delete/'+id,{method:'DELETE'});if(res.ok)loadPending();}catch(err){console.error(err)};};


// PLACEHOLDER_LOGIN_FORM

// PLACEHOLDER_LOGGED_IN
    if (!loggedIn) {
        return (
          <>
          <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
          <div className="min-h-screen bg-bg0">
          <div className="max-w-2xl mx-auto px-6 py-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans mb-12 group">Home</button>
          <h1 className="text-4xl font-bold text-fg0 mb-8">Guestbook Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
          <button type="submit">Login</button>
          </form>
          </div>
          </div>
          </>
      );
  }

  return(
      <>
      <SEO title="Guestbook Admin" description="Admin panel" url="https://exoad.net/guestbook/admin"/>
      <div className="min-h-screen bg-bg0">
      <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-fg0 mb-8">Pending Entries</h1>
      {loading ? (
          <p>Loading...</p>
      ) : entries.length === 0 ? (
          <p>No pending entries.</p>
      ) : (
          <>
          {entries.map((entry) => (
              <article key={entry.id} className="py-4 border-b border-bg2">
                  <header className="flex items-baseline gap-3 mb-1">
                      <span className="font-bold text-fg1">{entry.name}</span>
                      <time className="text-xs text-fg4">{entry.created_at}</time>
                  </header>
                  <p className="text-fg3">{entry.message}</p>
                  <div className="flex gap-2 mt-2">
                      <button onClick={() => approveEntry(entry.id)} className="text-sm text-green hover:underline">Approve</button>
                      <button onClick={() => deleteEntry(entry.id)} className="text-sm text-red hover:underline">Delete</button>
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
