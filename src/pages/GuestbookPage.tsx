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
  totalEntries?: number;
  totalPages: number;
  currentPage: number;
}

type StatusMessage = {
  text: string;
  ok: boolean;
};

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
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
  const [statusMsg, setStatusMsg] = useState<StatusMessage | null>(null);

  useEffect(() => {
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
    loadEntries(page);
    if (!document.querySelector('script[src*="turnstile"]')) {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      document.head.appendChild(s);
    }

    async function loadEntries(p: number) {
      setLoading(true);
      try {
        const res = await window.fetch('/api/guestbook/list?page=' + p + '&limit=20');
        let data: GuestbookResponse;
        if (res.ok) {
          data = await res.json();
        } else {
          data = { entries: [], totalPages: 1, currentPage: p };
        }
        setEntries(data.entries || []);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        console.error(e);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
  }, [page]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !msgText.trim()) return;

    const turnstileEl = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');
    const turnstileToken = turnstileEl ? turnstileEl.value : '';

    if (!turnstileToken) {
      setStatusMsg({ text: 'Please complete the verification.', ok: false });
      return;
    }

    setSubmitting(true);

    try {
      const res = await window.fetch('/api/guestbook/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: msgText.trim(), turnstileToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setName('');
        setMsgText('');
        setStatusMsg({ text: data.message || strings.pages.guestbook.success_message, ok: true });
        if (window.turnstile) window.turnstile.reset();
      } else {
        setStatusMsg({ text: data.error || strings.pages.guestbook.error_submit, ok: false });
      }
    } catch (err) {
      setStatusMsg({ text: String(strings.pages.guestbook.error_submit), ok: false });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      <SEO
        title={strings.pages.guestbook.title}
        description={strings.pages.guestbook.description}
        url="https://exoad.net/guestbook"
      />
      <main className="min-h-screen bg-bg0 px-[calc(var(--spacing)*_6)] py-[calc(var(--spacing)*_10)] sm:px-[calc(var(--spacing)*_8)] md:px-[calc(var(--spacing)*_16)] md:py-[calc(var(--spacing)*_16)]">
        <div className="mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-[calc(var(--spacing)*_10)] inline-flex items-center gap-2 text-fg4 hover:text-yellow transition-colors duration-300 text-sm font-sans group"
          >
            <MdArrowBack size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </button>

          <header className="mb-[calc(var(--spacing)*_10)]">
            <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-[calc(var(--spacing)*_4)]">
              Guest Book
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-fg0 mb-[calc(var(--spacing)*_3)]">
              {strings.pages.guestbook.title}
            </h1>
            <p className="text-fg3 text-sm font-sans leading-relaxed max-w-lg">
              {strings.pages.guestbook.description}
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mb-[calc(var(--spacing)*_14)] border-y border-bg2 py-[calc(var(--spacing)*_6)]"
          >
            <div className="mb-[calc(var(--spacing)*_4)]">
              <label className="block text-xs uppercase tracking-wide text-fg4 mb-[calc(var(--spacing)*_2)] font-sans">
                {strings.pages.guestbook.name_label}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                placeholder="Your name"
                className="w-full bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:outline-none focus:border-yellow"
              />
            </div>

            <div className="mb-[calc(var(--spacing)*_4)]">
              <label className="block text-xs uppercase tracking-wide text-fg4 mb-[calc(var(--spacing)*_2)] font-sans">
                {strings.pages.guestbook.message_label}
              </label>
              <textarea
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                maxLength={1000}
                required
                rows={5}
                placeholder="Leave a message"
                className="w-full resize-y bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:outline-none focus:border-yellow"
              />
            </div>

            <div
              className="cf-turnstile mb-[calc(var(--spacing)*_4)]"
              data-sitekey="0x4AAAAAADRVTMltusSmfuQN"
              data-theme="dark"
            />

            {statusMsg && (
              <p
                className={`mb-[calc(var(--spacing)*_4)] text-sm font-sans ${
                  statusMsg.ok ? 'text-green' : 'text-red'
                }`}
              >
                {statusMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !msgText.trim()}
              className="inline-flex items-center gap-2 bg-yellow text-bg0 px-6 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <MdSend size={14} />
              {submitting ? 'Submitting...' : strings.pages.guestbook.submit_button}
            </button>
          </form>

          <section>
            <h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-[calc(var(--spacing)*_5)]">
              Recent Entries
            </h2>

            {loading ? (
              <p className="text-fg4 text-sm font-sans">{strings.pages.guestbook.loading_entries}</p>
            ) : entries.length === 0 ? (
              <p className="text-fg3 text-sm font-sans">{strings.pages.guestbook.no_entries}</p>
            ) : (
              <div>
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="border-b border-bg2 pb-[calc(var(--spacing)*_5)] mb-[calc(var(--spacing)*_5)]"
                  >
                    <header className="mb-[calc(var(--spacing)*_2)] flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-bold text-fg0">{entry.name}</h3>
                      <time className="text-fg4 text-xs font-sans">{formatDate(entry.created_at)}</time>
                    </header>
                    <p className="text-fg3 text-sm font-sans leading-relaxed whitespace-pre-wrap">
                      {entry.message}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <nav className="mt-[calc(var(--spacing)*_8)] flex items-center justify-center gap-4 text-sm font-sans">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-fg4 hover:text-yellow transition-colors disabled:opacity-40 disabled:hover:text-fg4"
            >
              <MdChevronLeft size={18} />
              Prev
            </button>
            <span className="text-fg4">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 text-fg4 hover:text-yellow transition-colors disabled:opacity-40 disabled:hover:text-fg4"
            >
              Next
              <MdChevronRight size={18} />
            </button>
          </nav>
        </div>
      </main>
    </>
  );
}
