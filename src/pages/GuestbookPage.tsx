import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { strings } from '../data/shared';
import { MdArrowBack, MdSend, MdChevronLeft, MdChevronRight, MdAdd, MdClose } from 'react-icons/md';

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
  const [formOpen, setFormOpen] = useState(false);

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
        setFormOpen(false);
        setStatusMsg({
          text: data.message || 'Your note is on its way. I will give it a quick look and approve it soon.',
          ok: true,
        });
        if (window.turnstile) window.turnstile.reset();
      } else {
        setStatusMsg({ text: data.error || strings.pages.guestbook.error_submit, ok: false });
      }
    } catch (err) {
      setStatusMsg({ text: String(strings.pages.guestbook.error_submit), ok: false });
    } finally {
      setSubmitting(false);
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

          <header className="mb-[calc(var(--spacing)*_8)] animate-fade-in-up">
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

          <section className="mb-[calc(var(--spacing)*_12)] border-y border-bg2 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <button
              type="button"
              onClick={() => setFormOpen((open) => !open)}
              className="group flex w-full items-center justify-between gap-4 py-[calc(var(--spacing)*_5)] text-left transition-colors duration-300 hover:text-fg0"
              aria-expanded={formOpen}
            >
              <span>
                <span className="block text-fg0 font-bold text-lg">
                  {formOpen ? 'Hide signing form' : 'Sign the guestbook'}
                </span>
                <span className="block text-fg4 text-xs font-sans mt-1">
                  Leave a lighthearted note, a hello, or a tiny internet footprint.
                </span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-yellow text-bg0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-80">
                {formOpen ? <MdClose size={20} /> : <MdAdd size={20} />}
              </span>
            </button>

            {formOpen && (
              <form
                onSubmit={handleSubmit}
                className="animate-fade-in-up pb-[calc(var(--spacing)*_6)]"
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
                    rows={4}
                    placeholder="Leave a message"
                    className="w-full resize-y bg-bg1 border border-bg3 rounded-sm px-3 py-2 text-fg placeholder:text-fg4 focus:outline-none focus:border-yellow"
                  />
                </div>

                <div
                  className="cf-turnstile mb-[calc(var(--spacing)*_4)]"
                  data-sitekey="0x4AAAAAADRVTMltusSmfuQN"
                  data-theme="dark"
                />

                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !msgText.trim()}
                  className="inline-flex items-center gap-2 bg-yellow text-bg0 px-6 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  <MdSend size={14} />
                  {submitting ? 'Submitting...' : strings.pages.guestbook.submit_button}
                </button>
              </form>
            )}
          </section>

          {statusMsg && !statusMsg.ok && (
            <p
              className={`mb-[calc(var(--spacing)*_8)] border-b border-bg2 pb-[calc(var(--spacing)*_4)] text-sm font-sans ${
                statusMsg.ok ? 'text-green' : 'text-red'
              }`}
            >
              {statusMsg.text}
            </p>
          )}

          {statusMsg?.ok && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg0/80 px-6 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-sm border border-bg2 bg-bg0 p-6 shadow-2xl animate-scale-in">
                <p className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-4">
                  Guest Book
                </p>
                <h2 className="text-2xl font-bold text-fg0 mb-3">Note received</h2>
                <p className="text-fg3 text-sm font-sans leading-relaxed mb-6">
                  {statusMsg.text}
                </p>
                <button
                  type="button"
                  onClick={() => setStatusMsg(null)}
                  className="bg-yellow text-bg0 px-5 py-2 rounded-sm font-sans text-sm hover:opacity-80 transition-opacity"
                >
                  Nice
                </button>
              </div>
            </div>
          )}

          <section className="animate-fade-in-up" style={{ animationDelay: '90ms' }}>
            <h2 className="text-fg4 font-sans uppercase tracking-[0.2em] text-[10px] mb-[calc(var(--spacing)*_5)]">
              Recent Entries
            </h2>

            {loading ? (
              <p className="text-fg4 text-sm font-sans">{strings.pages.guestbook.loading_entries}</p>
            ) : entries.length === 0 ? (
              <p className="text-fg3 text-sm font-sans">{strings.pages.guestbook.no_entries}</p>
            ) : (
              <div className="flex flex-col gap-[calc(var(--spacing)*_4)]">
                {entries.map((entry, index) => (
                  <article
                    key={entry.id}
                    className="group relative animate-fade-in-up border border-bg2 border-l-yellow/45 bg-bg0_s/25 px-[calc(var(--spacing)*_5)] py-[calc(var(--spacing)*_5)] transition-colors duration-200 hover:border-bg3 hover:border-l-yellow hover:bg-bg1/20 sm:px-[calc(var(--spacing)*_6)]"
                    style={{ animationDelay: `${Math.min(index * 24, 120)}ms` }}
                  >
                    <span className="absolute right-[calc(var(--spacing)*_4)] top-[calc(var(--spacing)*_4)] font-sans text-[10px] tracking-[0.18em] text-fg4/50">
                      {String((page - 1) * 20 + index + 1).padStart(2, '0')}
                    </span>
                    <blockquote className="relative pr-[calc(var(--spacing)*_8)]">
                      <span className="pointer-events-none absolute -left-1 top-[-0.35rem] font-serif text-5xl leading-none text-yellow/25">
                        &ldquo;
                      </span>
                      <p className="relative pl-[calc(var(--spacing)*_5)] text-lg leading-relaxed text-fg0 whitespace-pre-wrap sm:text-xl">
                        {entry.message}
                      </p>
                      <footer className="mt-[calc(var(--spacing)*_5)] flex flex-col gap-2 border-t border-bg2/80 pt-[calc(var(--spacing)*_3)] font-sans sm:flex-row sm:items-center sm:justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-fg2">
                          <span className="h-px w-5 bg-yellow/70 transition-colors duration-200 group-hover:bg-yellow" />
                          <cite className="not-italic transition-colors duration-200 group-hover:text-yellow">
                            {entry.name}
                          </cite>
                        </span>
                        <time className="text-[11px] uppercase tracking-[0.14em] text-fg4">
                          {formatDate(entry.created_at)}
                        </time>
                      </footer>
                    </blockquote>
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
